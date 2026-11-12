<?php
declare(strict_types=1);

namespace Wisal;

use PDO;

/**
 * المحادثة بين المستفيد ومقدم الخدمة داخل الحجز.
 *
 * - كل حجز له محادثة خاصة به.
 * - لا يقرأ المحادثة أو يكتب فيها إلا صاحب الحجز (المستفيد)
 *   أو مقدم الخدمة صاحب الخدمة المحجوزة.
 * - لا يمكن إرسال رسائل في حجز ملغي أو مرفوض.
 */
final class Messages
{
    private const MAX_LENGTH = 1000;
    private const LIST_LIMIT = 200;

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

    /** نخلي أوقات الرسائل بتوقيت مكة بدل توقيت السيرفر (فرنسا) */
    private static function connect(): PDO
    {
        $db = Database::connect();
        $db->exec("SET time_zone = '+03:00'");
        return $db;
    }

    private static function currentUserId(): int
    {
        Auth::start();

        $userId = (int) ($_SESSION['user_id'] ?? 0);

        if ($userId <= 0) {
            self::fail(401, 'UNAUTHENTICATED', 'يرجى تسجيل الدخول');
        }

        return $userId;
    }

    /**
     * يرجّع بيانات الحجز إذا كان المستخدم طرفاً فيه، وإلا يرجّع 404.
     */
    private static function bookingFor(PDO $db, int $bookingId, int $userId): array
    {
        $stmt = $db->prepare(
            'SELECT
                b.id,
                b.status,
                b.user_id AS beneficiary_user_id,
                p.user_id AS provider_user_id
             FROM bookings b
             INNER JOIN services s ON s.id = b.service_id
             INNER JOIN providers p ON p.id = s.provider_id
             WHERE b.id = ?
             LIMIT 1'
        );

        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$booking) {
            self::fail(404, 'NOT_FOUND', 'الحجز غير موجود');
        }

        $isParticipant =
            (int) $booking['beneficiary_user_id'] === $userId ||
            (int) $booking['provider_user_id'] === $userId;

        if (!$isParticipant) {
            self::fail(404, 'NOT_FOUND', 'الحجز غير موجود');
        }

        return $booking;
    }

    private static function canSend(array $booking): bool
    {
        return !in_array(
            $booking['status'],
            ['cancelled', 'rejected'],
            true
        );
    }

    private static function format(array $row, array $booking, int $userId): array
    {
        $senderId = (int) $row['sender_user_id'];

        return [
            'id' => (string) $row['id'],
            'bookingId' => (string) $row['booking_id'],
            'senderId' => (string) $senderId,
            'senderName' => $row['sender_name'],
            'senderRole' =>
                $senderId === (int) $booking['provider_user_id']
                    ? 'provider'
                    : 'beneficiary',
            'isMine' => $senderId === $userId,
            'body' => $row['body'],
            'createdAt' => $row['created_at'],
        ];
    }

    private static function fetchMessages(
        PDO $db,
        array $booking,
        int $userId,
        int $afterId
    ): array {
        $stmt = $db->prepare(
            'SELECT m.id, m.booking_id, m.sender_user_id, m.body, m.created_at,
                    u.name AS sender_name
             FROM booking_messages m
             INNER JOIN users u ON u.id = m.sender_user_id
             WHERE m.booking_id = ? AND m.id > ?
             ORDER BY m.id DESC
             LIMIT ' . self::LIST_LIMIT
        );

        $stmt->execute([(int) $booking['id'], $afterId]);

        $rows = array_reverse($stmt->fetchAll(PDO::FETCH_ASSOC));

        return array_map(
            fn (array $row) => self::format($row, $booking, $userId),
            $rows
        );
    }

    /**
     * GET /api/bookings/{id}/messages?after={lastMessageId}
     */
    public static function index(int $bookingId): never
    {
        $userId = self::currentUserId();
        $db = self::connect();
        $booking = self::bookingFor($db, $bookingId, $userId);

        $afterId = filter_var(
            $_GET['after'] ?? 0,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 0]]
        );

        Response::json(200, [
            'success' => true,
            'data' => [
                'messages' => self::fetchMessages(
                    $db,
                    $booking,
                    $userId,
                    $afterId === false ? 0 : $afterId
                ),
                'canSend' => self::canSend($booking),
            ],
        ]);
    }

    /**
     * POST /api/bookings/{id}/messages   { "body": "..." }
     */
    public static function create(int $bookingId): never
    {
        $userId = self::currentUserId();
        $data = Auth::body();
        $db = self::connect();
        $booking = self::bookingFor($db, $bookingId, $userId);

        if (!self::canSend($booking)) {
            self::fail(
                409,
                'CHAT_CLOSED',
                'لا يمكن إرسال رسائل في حجز ملغي'
            );
        }

        $body = $data['body'] ?? null;

        if (!is_string($body)) {
            self::fail(422, 'VALIDATION_ERROR', 'نص الرسالة غير صالح');
        }

        $body = trim($body);
        $length = mb_strlen($body, 'UTF-8');

        if ($length === 0) {
            self::fail(422, 'VALIDATION_ERROR', 'لا يمكن إرسال رسالة فارغة');
        }

        if ($length > self::MAX_LENGTH) {
            self::fail(
                422,
                'VALIDATION_ERROR',
                'الرسالة طويلة جداً (الحد الأقصى ' . self::MAX_LENGTH . ' حرف)'
            );
        }

        $stmt = $db->prepare(
            'INSERT INTO booking_messages (booking_id, sender_user_id, body)
             VALUES (?, ?, ?)'
        );

        $stmt->execute([$bookingId, $userId, $body]);

        $newId = (int) $db->lastInsertId();

        $stmt = $db->prepare(
            'SELECT m.id, m.booking_id, m.sender_user_id, m.body, m.created_at,
                    u.name AS sender_name
             FROM booking_messages m
             INNER JOIN users u ON u.id = m.sender_user_id
             WHERE m.id = ?
             LIMIT 1'
        );

        $stmt->execute([$newId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        Response::json(201, [
            'success' => true,
            'data' => self::format($row, $booking, $userId),
        ]);
    }
}
