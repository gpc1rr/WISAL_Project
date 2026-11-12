<?php
declare(strict_types=1);

use Wisal\Auth;
use Wisal\Database;
use Wisal\Env;
use Wisal\Response;
use Wisal\Services;

require dirname(__DIR__) . '/src/Env.php';
require dirname(__DIR__) . '/src/Database.php';
require dirname(__DIR__) . '/src/Response.php';
require dirname(__DIR__) . '/src/Auth.php';
require dirname(__DIR__) . '/src/Services.php';
require dirname(__DIR__) . '/src/Bookings.php';

Env::load(dirname(__DIR__) . '/config/.env');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = Env::get('CORS_ORIGIN', 'http://localhost:5173');

if ($origin !== '' && $origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::json(
        $origin === $allowedOrigin ? 204 : 403,
        []
    );
}

$path = parse_url(
    $_SERVER['REQUEST_URI'] ?? '/',
    PHP_URL_PATH
) ?: '/';

$scriptPrefix = str_replace(
    '\\',
    '/',
    dirname($_SERVER['SCRIPT_NAME'] ?? '')
);

if (
    $scriptPrefix !== '/' &&
    $scriptPrefix !== '.' &&
    str_starts_with($path, $scriptPrefix . '/')
) {
    $path = substr($path, strlen($scriptPrefix));
}

$path = rtrim($path, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    /*
     * Authentication API
     */
    if ($path === '/api/auth/csrf' && $method === 'GET') {
        Response::json(200, [
            'success' => true,
            'data' => [
                'csrfToken' => Auth::csrf(),
            ],
        ]);
    }

    if ($path === '/api/auth/me' && $method === 'GET') {
        Auth::me();
    }

    if ($path === '/api/auth/login' && $method === 'POST') {
        Auth::verifyCsrf();
        Auth::login();
    }

    if (
        $path === '/api/auth/register/beneficiary' &&
        $method === 'POST'
    ) {
        Auth::verifyCsrf();
        Auth::register('beneficiary');
    }

    if (
        $path === '/api/auth/register/provider' &&
        $method === 'POST'
    ) {
        Auth::verifyCsrf();
        Auth::register('provider');
    }

    if ($path === '/api/auth/logout' && $method === 'POST') {
        Auth::verifyCsrf();
        Auth::logout();
    }

    /*
     * Services API
     */
    if ($path === '/api/services') {
        if ($method === 'GET') {
            Services::index();
        }

        if ($method === 'POST') {
            Auth::verifyCsrf();
            Services::create();
        }

        Response::json(405, [
            'success' => false,
            'error' => [
                'code' => 'METHOD_NOT_ALLOWED',
                'message' => 'Method not allowed',
            ],
        ]);
    }

    if (preg_match('#^/api/services/([0-9]+)$#', $path, $matches)) {
        $serviceId = (int) $matches[1];

        if ($method === 'GET') {
            Services::show($serviceId);
        }

        if ($method === 'PUT') {
            Auth::verifyCsrf();
            Services::update($serviceId);
        }

        if ($method === 'DELETE') {
            Auth::verifyCsrf();
            Services::delete($serviceId);
        }

        Response::json(405, [
            'success' => false,
            'error' => [
                'code' => 'METHOD_NOT_ALLOWED',
                'message' => 'Method not allowed',
            ],
        ]);
    }

    
    /*
     * Bookings API
     */
    if ($path === '/api/bookings') {
        if ($method === 'GET') {
            \Wisal\Bookings::index();
        }

        if ($method === 'POST') {
            Auth::verifyCsrf();
            \Wisal\Bookings::create();
        }

        Response::json(405, [
            'success' => false,
            'error' => [
                'code' => 'METHOD_NOT_ALLOWED',
                'message' => 'Method not allowed',
            ],
        ]);
    }

    if (
        preg_match(
            '#^/api/bookings/([1-9][0-9]*)$#',
            $path,
            $matches
        )
    ) {
        $bookingId = (int) $matches[1];

        if ($method === 'GET') {
            \Wisal\Bookings::show($bookingId);
        }

        Response::json(405, [
            'success' => false,
            'error' => [
                'code' => 'METHOD_NOT_ALLOWED',
                'message' => 'Method not allowed',
            ],
        ]);
    }

    if (
        preg_match(
            '#^/api/bookings/([1-9][0-9]*)/status$#',
            $path,
            $matches
        )
    ) {
        $bookingId = (int) $matches[1];

        if ($method === 'PATCH') {
            Auth::verifyCsrf();
            \Wisal\Bookings::updateStatus($bookingId);
        }

        Response::json(405, [
            'success' => false,
            'error' => [
                'code' => 'METHOD_NOT_ALLOWED',
                'message' => 'Method not allowed',
            ],
        ]);
    }


    /*
     * Health API
     */
    require dirname(__DIR__) . '/src/MessageRoutes.php';

    if ($path === '/api/health') {
        if ($method !== 'GET') {
            Response::json(405, [
                'success' => false,
                'error' => [
                    'code' => 'METHOD_NOT_ALLOWED',
                    'message' => 'Method not allowed',
                ],
            ]);
        }

        Response::json(200, [
            'success' => true,
            'data' => [
                'service' => 'WISAL API',
                'status' => 'ok',
                'phase' => 3,
            ],
        ]);
    }

    if ($path === '/api/health/db') {
        if ($method !== 'GET') {
            Response::json(405, [
                'success' => false,
                'error' => [
                    'code' => 'METHOD_NOT_ALLOWED',
                    'message' => 'Method not allowed',
                ],
            ]);
        }

        try {
            $db = Database::connect();

            $db->query('SELECT 1')->fetchColumn();

            $tables = $db->query(
                'SELECT table_name
                 FROM information_schema.tables
                 WHERE table_schema = DATABASE()'
            )->fetchAll(PDO::FETCH_COLUMN);

            $expected = [
                'users',
                'providers',
                'services',
                'bookings',
                'ratings',
            ];

            $missing = array_values(
                array_diff($expected, $tables)
            );

            Response::json(
                $missing === [] ? 200 : 503,
                [
                    'success' => $missing === [],
                    'data' => [
                        'database' => $missing === []
                            ? 'ready'
                            : 'schema_incomplete',
                        'missing_tables' => $missing,
                    ],
                ]
            );
        } catch (Throwable $exception) {
            error_log(
                'WISAL DB health failed: ' .
                $exception->getMessage()
            );

            Response::json(503, [
                'success' => false,
                'error' => [
                    'code' => 'DB_UNAVAILABLE',
                    'message' => 'Database unavailable',
                ],
            ]);
        }
    }

    if (str_starts_with($path, '/api/')) {
        Response::json(404, [
            'success' => false,
            'error' => [
                'code' => 'NOT_FOUND',
                'message' => 'Endpoint not found',
            ],
        ]);
    }

    Response::json(404, [
        'success' => false,
        'error' => [
            'code' => 'NOT_FOUND',
            'message' => 'Endpoint not found',
        ],
    ]);
} catch (Throwable $exception) {
    error_log(
        'WISAL API error: ' .
        $exception->getMessage()
    );

    Response::json(500, [
        'success' => false,
        'error' => [
            'code' => 'INTERNAL_ERROR',
            'message' => 'حدث خطأ داخلي؛ يرجى المحاولة لاحقاً',
        ],
    ]);
}
