<?php
declare(strict_types=1);

namespace Wisal;

use PDO;

final class Bookings
{
    private static function fail(
        int $status,
        string $code,
        string $message
    ): never {
        Response::json($status, [
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
            ],
        ]);
    }

    private static function query(): string
    {
        return '
            SELECT
                b.id,
                b.user_id,
                b.service_id,
                b.booking_date,
                b.meeting_location,
                b.status,
                s.service_name,
                s.price,
                p.id AS provider_id,
                pu.name AS provider_name,
                pu.phone AS provider_phone,
                bu.name AS beneficiary_name,
                bu.phone AS beneficiary_phone
            FROM bookings b
            INNER JOIN services s
                ON s.id = b.service_id
            INNER JOIN providers p
                ON p.id = s.provider_id
            INNER JOIN users pu
                ON pu.id = p.user_id
            INNER JOIN users bu
                ON bu.id = b.user_id
        ';
    }

    private static function format(array $row): array
    {
        $date = new \DateTimeImmutable($row['booking_date']);

        return [
            'id' => (string) $row['id'],
            'bookingNumber' =>
                'WSL-' . $date->format('Y') . '-' .
                str_pad((string) $row['id'], 6, '0', STR_PAD_LEFT),

            'serviceId' => (string) $row['service_id'],
            'serviceTitle' => $row['service_name'],

            'providerId' => (string) $row['provider_id'],
            'providerName' => $row['provider_name'],
            'providerPhone' => $row['provider_phone'],

            'beneficiaryId' => (string) $row['user_id'],
            'beneficiaryName' => $row['beneficiary_name'],
            'beneficiaryPhone' => $row['beneficiary_phone'],

            'date' => $date->format('Y-m-d'),
            'timeSlot' => $date->format('H:i'),
            'meetingPoint' => $row['meeting_location'] ?? '',

            'notes' => '',
            'totalPrice' => (float) $row['price'],
            'status' => $row['status'],
            'createdAt' => '',
            'rated' => false,
        ];
    }

    private static function currentUser(): array
    {
        Auth::start();

        $userId = (int) ($_SESSION['user_id'] ?? 0);

        if ($userId <= 0) {
            self::fail(401, 'UNAUTHENTICATED', 'يرجى تسجيل الدخول');
        }

        $db = Database::connect();

        $stmt = $db->prepare(
            'SELECT u.id, u.user_type, p.id AS provider_id
             FROM users u
             LEFT JOIN providers p ON p.user_id = u.id
             WHERE u.id = ?
             LIMIT 1'
        );

        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            self::fail(401, 'UNAUTHENTICATED', 'الجلسة غير صالحة');
        }

        return $user;
    }

    public static function index(): never
    {
        $user = self::currentUser();
        $db = Database::connect();

        if ($user['user_type'] === 'beneficiary') {
            $stmt = $db->prepare(
                self::query() .
                ' WHERE b.user_id = ?
                  ORDER BY b.id DESC'
            );

            $stmt->execute([(int) $user['id']]);
        } else {
            $stmt = $db->prepare(
                self::query() .
                ' WHERE p.id = ?
                  ORDER BY b.id DESC'
            );

            $stmt->execute([(int) $user['provider_id']]);
        }

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::json(200, [
            'success' => true,
            'data' => array_map([self::class, 'format'], $rows),
        ]);
    }

    public static function show(int $id): never
    {
        $user = self::currentUser();
        $db = Database::connect();

        $stmt = $db->prepare(
            self::query() .
            ' WHERE b.id = ?
              LIMIT 1'
        );

        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            self::fail(404, 'NOT_FOUND', 'الحجز غير موجود');
        }

        $isBeneficiary =
            $user['user_type'] === 'beneficiary' &&
            (int) $row['user_id'] === (int) $user['id'];

        $isProvider =
            $user['user_type'] === 'provider' &&
            (int) $row['provider_id'] === (int) $user['provider_id'];

        if (!$isBeneficiary && !$isProvider) {
            self::fail(404, 'NOT_FOUND', 'الحجز غير موجود');
        }

        Response::json(200, [
            'success' => true,
            'data' => self::format($row),
        ]);
    }

    public static function create(): never
    {
        $beneficiaryId = Auth::requireBeneficiary();
        $data = Auth::body();

        $serviceId = filter_var(
            $data['serviceId'] ?? null,
            FILTER_VALIDATE_INT
        );

        if ($serviceId === false || $serviceId <= 0) {
            self::fail(422, 'VALIDATION_ERROR', 'معرّف الخدمة غير صالح');
        }

        $date = $data['bookingDate'] ?? null;

        if (
            !is_string($date) ||
            !preg_match(
                '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/',
                $date
            )
        ) {
            self::fail(422, 'VALIDATION_ERROR', 'صيغة موعد الحجز غير صحيحة');
        }

        $parsedDate = \DateTimeImmutable::createFromFormat(
            '!Y-m-d H:i:s',
            $date
        );

        if (
            !$parsedDate ||
            $parsedDate->format('Y-m-d H:i:s') !== $date ||
            $parsedDate <= new \DateTimeImmutable()
        ) {
            self::fail(422, 'VALIDATION_ERROR', 'موعد الحجز غير صالح');
        }

        $location = $data['meetingLocation'] ?? null;

        if (
            !is_string($location) ||
            trim($location) === '' ||
            mb_strlen(trim($location), 'UTF-8') > 255
        ) {
            self::fail(422, 'VALIDATION_ERROR', 'نقطة الالتقاء غير صالحة');
        }

        $db = Database::connect();

        $stmt = $db->prepare(
            'SELECT id FROM services WHERE id = ? LIMIT 1'
        );

        $stmt->execute([$serviceId]);

        if (!$stmt->fetchColumn()) {
            self::fail(404, 'NOT_FOUND', 'الخدمة غير موجودة');
        }

        $stmt = $db->prepare(
            'INSERT INTO bookings
                (user_id, service_id, booking_date, meeting_location, status)
             VALUES (?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $beneficiaryId,
            $serviceId,
            $date,
            trim($location),
            'pending',
        ]);

        self::show((int) $db->lastInsertId());
    }

    public static function updateStatus(int $id): never
    {
        $user = self::currentUser();
        $data = Auth::body();

        $newStatus = $data['status'] ?? null;

        if (
            !is_string($newStatus) ||
            !in_array(
                $newStatus,
                ['confirmed', 'cancelled', 'completed'],
                true
            )
        ) {
            self::fail(422, 'VALIDATION_ERROR', 'حالة الحجز غير صالحة');
        }

        $db = Database::connect();

        $db->beginTransaction();

        try {
            $stmt = $db->prepare(
                self::query() .
                ' WHERE b.id = ?
                  FOR UPDATE'
            );

            $stmt->execute([$id]);
            $booking = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$booking) {
                $db->rollBack();
                self::fail(404, 'NOT_FOUND', 'الحجز غير موجود');
            }

            $isBeneficiary =
                $user['user_type'] === 'beneficiary' &&
                (int) $booking['user_id'] === (int) $user['id'];

            $isProvider =
                $user['user_type'] === 'provider' &&
                (int) $booking['provider_id'] === (int) $user['provider_id'];

            if (!$isBeneficiary && !$isProvider) {
                $db->rollBack();
                self::fail(404, 'NOT_FOUND', 'الحجز غير موجود');
            }

            $oldStatus = $booking['status'];

            $allowed = $isBeneficiary
                ? [
                    'pending' => ['cancelled'],
                    'confirmed' => ['cancelled'],
                ]
                : [
                    'pending' => ['confirmed', 'cancelled'],
                    'confirmed' => ['completed', 'cancelled'],
                ];

            if (
                !in_array(
                    $newStatus,
                    $allowed[$oldStatus] ?? [],
                    true
                )
            ) {
                $db->rollBack();
                self::fail(
                    409,
                    'INVALID_STATUS_TRANSITION',
                    'لا يمكن تغيير الحجز إلى الحالة المطلوبة'
                );
            }

            $stmt = $db->prepare(
                'UPDATE bookings SET status = ? WHERE id = ?'
            );

            $stmt->execute([$newStatus, $id]);
            $db->commit();

            self::show($id);
        } catch (\Throwable $exception) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }

            throw $exception;
        }
    }
}
