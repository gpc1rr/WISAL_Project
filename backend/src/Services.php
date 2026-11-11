<?php
declare(strict_types=1);

namespace Wisal;

use PDO;

final class Services
{
    private static function invalid(string $message): never
    {
        Response::json(422, [
            'success' => false,
            'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => $message,
            ],
        ]);
    }

    private static function notFound(): never
    {
        Response::json(404, [
            'success' => false,
            'error' => [
                'code' => 'NOT_FOUND',
                'message' => 'الخدمة غير موجودة',
            ],
        ]);
    }

    private static function serviceQuery(): string
    {
        return '
            SELECT
                s.id,
                s.provider_id,
                s.service_name,
                s.description,
                s.price,
                u.name AS provider_name,
                p.service_type,
                p.experience_years,
                p.languages,
                (
                    SELECT ROUND(AVG(r.rating), 2)
                    FROM ratings r
                    WHERE r.service_id = s.id
                ) AS average_rating,
                (
                    SELECT COUNT(*)
                    FROM ratings r
                    WHERE r.service_id = s.id
                ) AS ratings_count
            FROM services s
            INNER JOIN providers p
                ON p.id = s.provider_id
            INNER JOIN users u
                ON u.id = p.user_id
        ';
    }

    private static function format(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'providerId' => (int) $row['provider_id'],
            'serviceName' => $row['service_name'],
            'description' => $row['description'] ?? '',
            'price' => (float) $row['price'],
            'providerName' => $row['provider_name'],
            'serviceType' => $row['service_type'],
            'experienceYears' => (int) $row['experience_years'],
            'languages' => empty($row['languages'])
                ? []
                : explode(',', $row['languages']),
            'averageRating' => $row['average_rating'] === null
                ? 0
                : (float) $row['average_rating'],
            'ratingsCount' => (int) $row['ratings_count'],
        ];
    }

    public static function index(): never
    {
        $db = Database::connect();

        $stmt = $db->query(
            self::serviceQuery() . '
                ORDER BY s.id DESC
            '
        );

        $services = array_map(
            [self::class, 'format'],
            $stmt->fetchAll(PDO::FETCH_ASSOC)
        );

        Response::json(200, [
            'success' => true,
            'data' => $services,
        ]);
    }

    public static function show(int $id): never
    {
        if ($id <= 0) {
            self::notFound();
        }

        $db = Database::connect();

        $stmt = $db->prepare(
            self::serviceQuery() . '
                WHERE s.id = ?
                LIMIT 1
            '
        );

        $stmt->execute([$id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            self::notFound();
        }

        Response::json(200, [
            'success' => true,
            'data' => self::format($row),
        ]);
    }

    private static function validate(array $data): array
    {
        $name = $data['serviceName'] ?? null;
        $description = $data['description'] ?? '';
        $price = $data['price'] ?? null;

        if (!is_string($name)) {
            self::invalid('اسم الخدمة مطلوب');
        }

        $name = trim($name);

        $nameLength = function_exists('mb_strlen')
            ? mb_strlen($name, 'UTF-8')
            : strlen($name);

        if ($nameLength < 2 || $nameLength > 100) {
            self::invalid('اسم الخدمة يجب أن يكون بين 2 و100 حرف');
        }

        if (!is_string($description)) {
            self::invalid('وصف الخدمة غير صالح');
        }

        $description = trim($description);

        if (strlen($description) > 10000) {
            self::invalid('وصف الخدمة طويل جداً');
        }

        if (
            (!is_string($price) && !is_int($price) && !is_float($price))
            || !is_numeric($price)
            || !is_finite((float) $price)
            || (float) $price < 0
            || (float) $price > 99999999.99
        ) {
            self::invalid('سعر الخدمة غير صالح');
        }

        $price = (float) $price;

        if (round($price, 2) !== $price) {
            self::invalid('السعر يجب ألا يتجاوز منزلتين عشريتين');
        }

        return [$name, $description, $price];
    }

    public static function create(): never
    {
        $providerId = Auth::requireProvider();

        $data = Auth::body();

        [$name, $description, $price] = self::validate($data);

        $db = Database::connect();

        $stmt = $db->prepare(
            'INSERT INTO services
                (provider_id, service_name, description, price)
             VALUES (?, ?, ?, ?)'
        );

        $stmt->execute([
            $providerId,
            $name,
            $description,
            $price,
        ]);

        self::show((int) $db->lastInsertId());
    }

    private static function requireOwnership(
        PDO $db,
        int $serviceId,
        int $providerId
    ): void {
        $stmt = $db->prepare(
            'SELECT id
             FROM services
             WHERE id = ?
               AND provider_id = ?
             LIMIT 1'
        );

        $stmt->execute([$serviceId, $providerId]);

        if (!$stmt->fetchColumn()) {
            self::notFound();
        }
    }

    public static function update(int $id): never
    {
        $providerId = Auth::requireProvider();

        $db = Database::connect();

        self::requireOwnership($db, $id, $providerId);

        $data = Auth::body();

        [$name, $description, $price] = self::validate($data);

        $stmt = $db->prepare(
            'UPDATE services
             SET service_name = ?,
                 description = ?,
                 price = ?
             WHERE id = ?
               AND provider_id = ?'
        );

        $stmt->execute([
            $name,
            $description,
            $price,
            $id,
            $providerId,
        ]);

        self::show($id);
    }


public static function delete(int $id): never
{
    $providerId = Auth::requireProvider();
    $db = Database::connect();

    // Ensure the service belongs to the logged-in provider.
    self::requireOwnership($db, $id, $providerId);

    // Prevent concurrent inserts during deletion checks.
    $db->beginTransaction();

    try {
        $stmt = $db->prepare(
            'SELECT id
             FROM services
             WHERE id = ? AND provider_id = ?
             FOR UPDATE'
        );
        $stmt->execute([$id, $providerId]);

        if (!$stmt->fetchColumn()) {
            $db->rollBack();
            self::notFound();
        }

        $stmt = $db->prepare(
            'SELECT
                (SELECT COUNT(*) FROM bookings WHERE service_id = ?) AS bookings_count,
                (SELECT COUNT(*) FROM ratings WHERE service_id = ?) AS ratings_count'
        );
        $stmt->execute([$id, $id]);

        $counts = $stmt->fetch(PDO::FETCH_ASSOC);

        if (
            (int) $counts['bookings_count'] > 0 ||
            (int) $counts['ratings_count'] > 0
        ) {
            $db->rollBack();

            Response::json(409, [
                'success' => false,
                'error' => [
                    'code' => 'SERVICE_HAS_HISTORY',
                    'message' => 'لا يمكن حذف خدمة مرتبطة بحجوزات أو تقييمات حفاظاً على السجلات.',
                ],
            ]);
        }

        $stmt = $db->prepare(
            'DELETE FROM services
             WHERE id = ? AND provider_id = ?'
        );
        $stmt->execute([$id, $providerId]);

        $db->commit();

        Response::json(200, [
            'success' => true,
            'data' => [
                'deleted' => true,
                'id' => $id,
            ],
        ]);
    } catch (\Throwable $exception) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }

        throw $exception;
    }
}

}
