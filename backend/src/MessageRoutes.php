<?php
declare(strict_types=1);

/*
 * مسارات المحادثة (Chat API)
 *
 * هذا الملف يُستدعى من داخل public/index.php بعد تحديد $path و $method.
 *
 *   GET  /api/bookings/{id}/messages?after={lastId}  → جلب الرسائل
 *   POST /api/bookings/{id}/messages                 → إرسال رسالة
 */

require_once __DIR__ . '/Messages.php';

if (
    isset($path, $method) &&
    preg_match(
        '#^/api/bookings/([1-9][0-9]*)/messages$#',
        $path,
        $chatMatches
    )
) {
    $chatBookingId = (int) $chatMatches[1];

    if ($method === 'GET') {
        \Wisal\Messages::index($chatBookingId);
    }

    if ($method === 'POST') {
        \Wisal\Auth::verifyCsrf();
        \Wisal\Messages::create($chatBookingId);
    }

    \Wisal\Response::json(405, [
        'success' => false,
        'error' => [
            'code' => 'METHOD_NOT_ALLOWED',
            'message' => 'Method not allowed',
        ],
    ]);
}
