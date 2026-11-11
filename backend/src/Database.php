<?php
declare(strict_types=1);
namespace Wisal;
use PDO;
use PDOException;
use RuntimeException;
final class Database
{
    public static function connect(): PDO
    {
        $host = Env::get('DB_HOST', '127.0.0.1');
        $port = Env::get('DB_PORT', '3306');
        $name = Env::get('DB_NAME', 'wisal_db');
        $username = Env::get('DB_USER', 'root');
        $password = Env::get('DB_PASSWORD', '');
        if (!extension_loaded('pdo_mysql')) {
            throw new RuntimeException('pdo_mysql extension is not enabled');
        }
        if (!ctype_digit((string)$port) || (int)$port < 1 || (int)$port > 65535) {
            throw new RuntimeException('Invalid database port');
        }
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
        return new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}
