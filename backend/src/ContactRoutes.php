<?php
declare(strict_types=1);

/*
 * مسار "تواصل معنا"
 *
 * يُستدعى من داخل public/index.php بعد تحديد $path و $method.
 *
 *   POST /api/contact  → حفظ الرسالة في القاعدة + إرسالها لإيميل الفريق
 */

require_once __DIR__ . '/Contact.php';

if (isset($path, $method) && $path === '/api/contact') {
    if ($method === 'POST') {
        \Wisal\Auth::verifyCsrf();
        \Wisal\Contact::create();
    }

    \Wisal\Response::json(405, [
        'success' => false,
        'error' => [
            'code' => 'METHOD_NOT_ALLOWED',
            'message' => 'Method not allowed',
        ],
    ]);
}
