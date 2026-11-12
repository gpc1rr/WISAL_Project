-- جدول المحادثات بين المستفيد ومقدم الخدمة (لكل حجز محادثة خاصة)
-- شغّلي هذا الأمر مرة واحدة فقط في phpMyAdmin على قاعدة wesal-app_wisal

CREATE TABLE IF NOT EXISTS `booking_messages` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `sender_user_id` bigint(20) UNSIGNED NOT NULL,
  `body` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_messages_booking` (`booking_id`, `id`),
  KEY `idx_booking_messages_sender` (`sender_user_id`),
  CONSTRAINT `fk_booking_messages_booking`
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_messages_sender`
    FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
