<?php
declare(strict_types=1);

namespace Wisal;

/**
 * نموذج "تواصل معنا"
 *
 * - يحفظ الرسالة في جدول contact_messages.
 * - يرسل نسخة منها لإيميل فريق وصال (CONTACT_EMAIL).
 * - فيه حماية بسيطة ضد الإزعاج: رسالة وحدة كل دقيقة لنفس الزائر،
 *   وخانة مخفية (honeypot) لصيد البرامج الآلية.
 */
final class Contact
{
    private const DEFAULT_EMAIL = 'wesal.support.team@gmail.com';
    private const COOLDOWN_SECONDS = 60;

    private static function fail(int $status, string $code, string $message): never
    {
        Response::json($status, [
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
            ],
        ]);
    }

    /** يشيل أسطر جديدة عشان ما أحد يحقن هيدرات في الإيميل */
    private static function oneLine(string $value): string
    {
        return trim(str_replace(["\r", "\n"], ' ', $value));
    }

    private static function text(array $data, string $field, int $min, int $max, string $label): string
    {
        $value = $data[$field] ?? null;

        if (!is_string($value)) {
            self::fail(422, 'VALIDATION_ERROR', $label . ' غير صالح');
        }

        $value = trim($value);
        $length = mb_strlen($value, 'UTF-8');

        if ($length < $min) {
            self::fail(422, 'VALIDATION_ERROR', $label . ' قصير جداً');
        }

        if ($length > $max) {
            self::fail(422, 'VALIDATION_ERROR', $label . ' طويل جداً');
        }

        return $value;
    }

    /**
     * POST /api/contact
     * { "name": "...", "phone": "...", "email": "(اختياري)", "message": "..." }
     */
    public static function create(): never
    {
        Auth::start();
        $data = Auth::body();

        // خانة مخفية: الإنسان ما يشوفها، فلو انعبت غالباً برنامج آلي
        if (!empty($data['website'])) {
            Response::json(201, ['success' => true, 'data' => ['received' => true]]);
        }

        $lastSent = (int) ($_SESSION['contact_last_sent'] ?? 0);
        if ($lastSent > 0 && time() - $lastSent < self::COOLDOWN_SECONDS) {
            self::fail(429, 'TOO_MANY_REQUESTS', 'أرسلت رسالة قبل قليل؛ انتظر دقيقة ثم حاول مجدداً');
        }

        $name = self::oneLine(self::text($data, 'name', 2, 150, 'الاسم'));
        $phone = self::oneLine(self::text($data, 'phone', 7, 25, 'رقم الجوال'));
        $message = self::text($data, 'message', 5, 2000, 'نص الرسالة');

        if (!preg_match('/^\+?[0-9 ]{7,20}$/', $phone)) {
            self::fail(422, 'VALIDATION_ERROR', 'رقم الجوال غير صالح');
        }

        $email = null;
        $rawEmail = $data['email'] ?? '';
        if (is_string($rawEmail) && trim($rawEmail) !== '') {
            $email = self::oneLine($rawEmail);
            if (mb_strlen($email, 'UTF-8') > 190 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                self::fail(422, 'VALIDATION_ERROR', 'البريد الإلكتروني غير صالح');
            }
        }

        $userId = (int) ($_SESSION['user_id'] ?? 0);

        // ١) نحفظ الرسالة في القاعدة
        $db = Database::connect();
        $stmt = $db->prepare(
            'INSERT INTO contact_messages (user_id, sender_name, phone, email, message)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId > 0 ? $userId : null,
            $name,
            $phone,
            $email,
            $message,
        ]);
        $messageId = (int) $db->lastInsertId();

        $_SESSION['contact_last_sent'] = time();

        // ٢) نرسلها للإيميل (لو فشل الإرسال، الرسالة محفوظة في القاعدة)
        $emailed = self::sendEmail($messageId, $name, $phone, $email, $message);

        Response::json(201, [
            'success' => true,
            'data' => [
                'received' => true,
                'id' => (string) $messageId,
                'emailed' => $emailed,
            ],
        ]);
    }

    private static function sendEmail(
        int $id,
        string $name,
        string $phone,
        ?string $email,
        string $message
    ): bool {
        $to = Env::get('CONTACT_EMAIL', self::DEFAULT_EMAIL) ?: self::DEFAULT_EMAIL;
        $from = Env::get('MAIL_FROM', 'noreply@wesal-app.alwaysdata.net') ?: 'noreply@wesal-app.alwaysdata.net';

        $subject = 'رسالة جديدة من موقع وصال #' . $id . ' — ' . $name;
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFromName = '=?UTF-8?B?' . base64_encode('منصة وصال') . '?=';

        $body = "وصلتكم رسالة جديدة من صفحة \"تواصل معنا\":\n\n"
            . "الاسم: {$name}\n"
            . "الجوال: {$phone}\n"
            . 'الإيميل: ' . ($email ?? 'لم يُذكر') . "\n"
            . "رقم الرسالة: {$id}\n"
            . 'التاريخ: ' . (new \DateTimeImmutable('now', new \DateTimeZone('Asia/Riyadh')))->format('Y-m-d H:i') . " (بتوقيت مكة)\n\n"
            . "نص الرسالة:\n"
            . "------------------------------\n"
            . $message . "\n"
            . "------------------------------\n\n"
            . ($email ? "للرد عليه: اضغط Reply مباشرة.\n" : "للرد عليه: تواصل معه على رقم الجوال.\n");

        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            'From: ' . $encodedFromName . ' <' . $from . '>',
        ];

        if ($email) {
            $headers[] = 'Reply-To: ' . $email;
        }

        try {
            return @mail($to, $encodedSubject, $body, implode("\r\n", $headers));
        } catch (\Throwable $e) {
            error_log('WISAL contact mail failed: ' . $e->getMessage());
            return false;
        }
    }
}
