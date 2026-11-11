<?php
declare(strict_types=1);
namespace Wisal;
final class Env
{
    public static function load(string $path): void
    {
        if (!is_file($path)) { return; }
        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) { continue; }
            $parts = explode('=', $line, 2);
            if (count($parts) !== 2) { continue; }
            $key = trim($parts[0]);
            if (!preg_match('/^[A-Z][A-Z0-9_]*$/', $key)) { continue; }
            if (getenv($key) !== false) { continue; }
            $value = trim($parts[1]);
            if (strlen($value) >= 2 && (($value[0] === '"' && substr($value, -1) === '"') || ($value[0] === "'" && substr($value, -1) === "'"))) {
                $value = substr($value, 1, -1);
            }
            putenv($key . '=' . $value);
        }
    }
    public static function get(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);
        return $value === false ? $default : $value;
    }
}
