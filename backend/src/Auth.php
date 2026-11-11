<?php
declare(strict_types=1);
namespace Wisal;

use PDO;
use PDOException;
use Throwable;

final class Auth
{
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) return;
        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');
        ini_set('session.cookie_httponly', '1');
        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Lax']);
        session_start();
    }

    public static function csrf(): string
    {
        self::start();
        if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
        return $_SESSION['csrf'];
    }

    public static function verifyCsrf(): void
    {
        self::start();
        $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!is_string($sent) || !hash_equals(self::csrf(), $sent)) {
            Response::json(419, ['success' => false, 'error' => ['code' => 'CSRF_FAILED', 'message' => 'انتهت الجلسة الأمنية؛ يرجى تحديث الصفحة والمحاولة مجدداً']]);
        }
    }

    public static function body(): array
    {
        if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) self::invalid('مطلوب JSON');
        $raw = file_get_contents('php://input', false, null, 0, 16385);
        if (!is_string($raw) || strlen($raw) > 16384) self::invalid('حجم الطلب غير صالح');
        $data = json_decode($raw, true);
        if (!is_array($data) || array_is_list($data)) self::invalid('بيانات الطلب غير صحيحة');
        return $data;
    }

    private static function invalid(string $message): never
    {
        Response::json(422, ['success' => false, 'error' => ['code' => 'VALIDATION_ERROR', 'message' => $message]]);
    }

    private static function field(array $data, string $field, int $min, int $max): string
    {
        $value = $data[$field] ?? null;
        if (!is_string($value)) self::invalid('الحقل ' . $field . ' مطلوب');
        $value = trim($value);
        $length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
        if ($length < $min || $length > $max) self::invalid('طول الحقل ' . $field . ' غير صالح');
        return $value;
    }

    private static function phone(array $data): string
    {
        $phone = preg_replace('/[\s\-()]/', '', self::field($data, 'phone', 8, 30));
        if (!preg_match('/^\+?[0-9]{8,15}$/', $phone)) self::invalid('رقم الجوال غير صالح');
        return $phone;
    }

    private static function password(array $data): string
    {
        $pass = $data['password'] ?? null;
        if (!is_string($pass) || strlen($pass) < 8 || strlen($pass) > 72) self::invalid('كلمة المرور يجب أن تكون من 8 إلى 72 حرفاً');
        return $pass;
    }

    private static function number(array $data, string $field, int $min, int $max): int
    {
        $v = filter_var($data[$field] ?? null, FILTER_VALIDATE_INT);
        if ($v === false || $v < $min || $v > $max) self::invalid('القيمة غير صحيحة: ' . $field);
        return $v;
    }

    private static function current(PDO $db, int $id): ?array
    {
        $stmt = $db->prepare('SELECT u.id, u.name, u.phone, u.user_type, u.created_at, p.id AS provider_id, p.age, p.service_type, p.experience_years, p.languages FROM users u LEFT JOIN providers p ON p.user_id = u.id WHERE u.id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) return null;
        $user = ['id' => (int)$row['id'], 'fullName' => $row['name'], 'phone' => $row['phone'], 'role' => $row['user_type'], 'createdAt' => $row['created_at']];
        $provider = null;
        if ($row['user_type'] === 'provider' && $row['provider_id'] !== null) {
            $provider = ['id' => (int)$row['provider_id'], 'userId' => (int)$row['id'], 'fullName' => $row['name'], 'phone' => $row['phone'], 'age' => (int)$row['age'], 'serviceType' => $row['service_type'], 'experienceYears' => (int)$row['experience_years'], 'languages' => $row['languages'] === '' || $row['languages'] === null ? [] : explode(',', $row['languages'])];
        }
        return ['user' => $user, 'provider' => $provider];
    }

    private static function establish(int $id): array
    {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $id;
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        return self::current(Database::connect(), $id);
    }

    public static function register(string $role): never
    {
        $data = self::body();
        $name = self::field($data, 'fullName', 2, 100);
        $phone = self::phone($data);
        $password = self::password($data);
        $age = null; $serviceType = null; $experience = null; $languages = null;
        if ($role === 'provider') {
            $age = self::number($data, 'age', 18, 100);
            $serviceType = self::field($data, 'serviceType', 2, 100);
            $experience = self::number($data, 'experienceYears', 0, 80);
            if (!isset($data['languages']) || !is_array($data['languages']) || count($data['languages']) < 1 || count($data['languages']) > 8) self::invalid('اختر لغة واحدة على الأقل');
            $langs = [];
            foreach ($data['languages'] as $lang) {
                if (!is_string($lang) || trim($lang) === '' || str_contains($lang, ',')) self::invalid('اللغات غير صالحة');
                $langs[] = trim($lang);
            }
            $languages = implode(',', array_unique($langs));
            if (strlen($languages) > 255) self::invalid('اللغات طويلة جداً');
        }
        $db = Database::connect();
        try {
            $db->beginTransaction();
            $stmt = $db->prepare('INSERT INTO users (name, phone, password, user_type) VALUES (?, ?, ?, ?)');
            $stmt->execute([$name, $phone, password_hash($password, PASSWORD_DEFAULT), $role]);
            $id = (int)$db->lastInsertId();
            if ($role === 'provider') {
                $stmt = $db->prepare('INSERT INTO providers (user_id, age, service_type, experience_years, languages) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$id, $age, $serviceType, $experience, $languages]);
            }
            $db->commit();
        } catch (PDOException $e) {
            if ($db->inTransaction()) $db->rollBack();
            if ($e->getCode() === '23000') Response::json(409, ['success' => false, 'error' => ['code' => 'PHONE_EXISTS', 'message' => 'رقم الجوال مسجل مسبقاً']]);
            throw $e;
        } catch (Throwable $e) {
            if ($db->inTransaction()) $db->rollBack();
            throw $e;
        }
        Response::json(201, ['success' => true, 'data' => self::establish($id)]);
    }

    public static function login(): never
    {
        $data = self::body();
        $phone = self::phone($data);
        $pass = $data['password'] ?? '';
        $db = Database::connect();
        $stmt = $db->prepare('SELECT id, password FROM users WHERE phone = ? LIMIT 1');
        $stmt->execute([$phone]);
        $row = $stmt->fetch();
        if (!is_string($pass) || !$row || !password_verify($pass, $row['password'])) {
            Response::json(401, ['success' => false, 'error' => ['code' => 'INVALID_CREDENTIALS', 'message' => 'رقم الجوال أو كلمة المرور غير صحيحة']]);
        }
        Response::json(200, ['success' => true, 'data' => self::establish((int)$row['id'])]);
    }

    public static function me(): never
    {
        self::start();
        $id = (int)($_SESSION['user_id'] ?? 0);
        if ($id === 0) Response::json(401, ['success' => false, 'error' => ['code' => 'UNAUTHENTICATED', 'message' => 'يرجى تسجيل الدخول']]);
        $data = self::current(Database::connect(), $id);
        if (!$data) {
            $_SESSION = [];
            Response::json(401, ['success' => false, 'error' => ['code' => 'UNAUTHENTICATED', 'message' => 'الجلسة لم تعد صالحة']]);
        }
        Response::json(200, ['success' => true, 'data' => $data]);
    }

    public static function logout(): never
    {
        self::start();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => $params['path'], 'secure' => $params['secure'], 'httponly' => true, 'samesite' => 'Lax']);
        }
        session_destroy();
        Response::json(200, ['success' => true, 'data' => ['loggedOut' => true]]);
    }

    public static function requireProvider(): int
    {
        self::start();

        $userId = (int) ($_SESSION['user_id'] ?? 0);

        if ($userId <= 0) {
            Response::json(401, [
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'يرجى تسجيل الدخول أولاً',
                ],
            ]);
        }

        $db = Database::connect();

        $stmt = $db->prepare(
            'SELECT p.id
            FROM providers p
            INNER JOIN users u ON u.id = p.user_id
            WHERE u.id = ?
            AND u.user_type = ?
            LIMIT 1'
        );

        $stmt->execute([$userId, 'provider']);

        $providerId = $stmt->fetchColumn();

        if ($providerId === false) {
            Response::json(403, [
                'success' => false,
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'هذه العملية متاحة لمقدمي الخدمات فقط',
                ],
            ]);
        }

        return (int) $providerId;
    }
    
    /**
     * Return the authenticated beneficiary user ID.
     *
     * The identity comes exclusively from the PHP session
     * and is verified against MariaDB.
     */
    public static function requireBeneficiary(): int
    {
        self::start();

        $userId = (int) ($_SESSION['user_id'] ?? 0);

        if ($userId <= 0) {
            Response::json(401, [
                'success' => false,
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'يرجى تسجيل الدخول أولاً',
                ],
            ]);
        }

        $db = Database::connect();

        $stmt = $db->prepare(
            'SELECT id
             FROM users
             WHERE id = ?
               AND user_type = ?
             LIMIT 1'
        );

        $stmt->execute([
            $userId,
            'beneficiary',
        ]);

        $beneficiaryId = $stmt->fetchColumn();

        if ($beneficiaryId === false) {
            Response::json(403, [
                'success' => false,
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'هذه العملية متاحة للمستفيدين فقط',
                ],
            ]);
        }

        return (int) $beneficiaryId;
    }

}
