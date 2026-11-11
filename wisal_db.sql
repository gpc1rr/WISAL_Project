-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 11 نوفمبر 2026 الساعة 14:49
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wisal_db`
--

-- --------------------------------------------------------

--
-- بنية الجدول `app_settings`
--

CREATE TABLE `app_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `value_type` enum('string','number','boolean','json') NOT NULL DEFAULT 'string',
  `description` varchar(500) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `app_settings`
--

INSERT INTO `app_settings` (`setting_key`, `setting_value`, `value_type`, `description`, `updated_at`) VALUES
('default_currency', 'SAR', 'string', 'العملة الافتراضية', '2026-11-04 17:26:49'),
('platform_name', 'وصال', 'string', 'اسم المنصة', '2026-11-04 17:26:49'),
('support_email', 'contact@wisal-makkah.demo', 'string', 'بريد التواصل التجريبي', '2026-11-04 17:26:49'),
('support_hours', '24/7', 'string', 'ساعات الدعم', '2026-11-04 17:26:49'),
('support_phone', '+966 12 500 0000', 'string', 'هاتف التواصل التجريبي', '2026-11-04 17:26:49');

-- --------------------------------------------------------

--
-- بنية الجدول `beneficiary_profiles`
--

CREATE TABLE `beneficiary_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `gender` enum('male','female','unspecified') DEFAULT 'unspecified',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_number` varchar(40) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `provider_id` bigint(20) UNSIGNED DEFAULT NULL,
  `booking_date` datetime NOT NULL,
  `time_slot` varchar(100) DEFAULT NULL,
  `meeting_point_id` bigint(20) UNSIGNED DEFAULT NULL,
  `meeting_location` varchar(255) DEFAULT NULL,
  `meeting_location_text` varchar(255) DEFAULT NULL,
  `meeting_latitude` decimal(10,7) DEFAULT NULL,
  `meeting_longitude` decimal(10,7) DEFAULT NULL,
  `beneficiary_name_snapshot` varchar(150) DEFAULT NULL,
  `beneficiary_phone_snapshot` varchar(25) DEFAULT NULL,
  `provider_name_snapshot` varchar(150) DEFAULT NULL,
  `provider_phone_snapshot` varchar(25) DEFAULT NULL,
  `service_name_snapshot` varchar(180) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `currency` char(3) NOT NULL DEFAULT 'SAR',
  `notes` text DEFAULT NULL,
  `status` enum('pending','confirmed','rejected','cancelled','completed') NOT NULL DEFAULT 'pending',
  `cancelled_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cancellation_reason` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- القوادح `bookings`
--
DELIMITER $$
CREATE TRIGGER `trg_bookings_reference` BEFORE INSERT ON `bookings` FOR EACH ROW BEGIN
  IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
    SET NEW.booking_number = CONCAT('WSL-', YEAR(NEW.booking_date), '-', UUID_SHORT());
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- بنية الجدول `booking_additional_contacts`
--

CREATE TABLE `booking_additional_contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `contact_name` varchar(150) NOT NULL,
  `contact_phone` varchar(25) NOT NULL,
  `relationship` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `booking_followups`
--

CREATE TABLE `booking_followups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `assigned_to_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `followup_type` enum('assignment','call','note','issue','resolution') NOT NULL DEFAULT 'note',
  `followup_status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `notes` text NOT NULL,
  `due_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `booking_status_history`
--

CREATE TABLE `booking_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `changed_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `old_status` varchar(30) DEFAULT NULL,
  `new_status` varchar(30) NOT NULL,
  `change_note` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `booking_time_slots`
--

CREATE TABLE `booking_time_slots` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `slot_key` varchar(60) NOT NULL,
  `name_ar` varchar(180) NOT NULL,
  `name_en` varchar(180) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `booking_time_slots`
--

INSERT INTO `booking_time_slots` (`id`, `slot_key`, `name_ar`, `name_en`, `start_time`, `end_time`, `sort_order`, `is_active`) VALUES
(1, 'fajr', 'الفجر (04:30 ص - 06:30 ص)', 'Fajr (04:30 AM - 06:30 AM)', '04:30:00', '06:30:00', 1, 1),
(2, 'duha', 'الضحى (07:30 ص - 10:30 ص)', 'Duha (07:30 AM - 10:30 AM)', '07:30:00', '10:30:00', 2, 1),
(3, 'dhuhr', 'الظهر (11:30 ص - 02:00 م)', 'Dhuhr (11:30 AM - 02:00 PM)', '11:30:00', '14:00:00', 3, 1),
(4, 'asr', 'العصر (03:30 م - 05:30 م)', 'Asr (03:30 PM - 05:30 PM)', '15:30:00', '17:30:00', 4, 1),
(5, 'maghrib_isha', 'المغرب والعشاء (06:30 م - 09:30 م)', 'Maghrib & Isha (06:30 PM - 09:30 PM)', '18:30:00', '21:30:00', 5, 1),
(6, 'late_night', 'ساعات الليل المتأخرة (10:30 م - 01:30 ص)', 'Late night (10:30 PM - 01:30 AM)', '22:30:00', '01:30:00', 6, 1);

-- --------------------------------------------------------

--
-- بنية الجدول `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sender_name` varchar(150) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','in_progress','answered','closed') NOT NULL DEFAULT 'new',
  `admin_reply` text DEFAULT NULL,
  `replied_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `content_pages`
--

CREATE TABLE `content_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_key` varchar(80) NOT NULL,
  `title_ar` varchar(200) NOT NULL,
  `body_ar` longtext NOT NULL,
  `title_en` varchar(200) DEFAULT NULL,
  `body_en` longtext DEFAULT NULL,
  `version_no` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `updated_by_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `content_pages`
--

INSERT INTO `content_pages` (`id`, `page_key`, `title_ar`, `body_ar`, `title_en`, `body_en`, `version_no`, `is_published`, `updated_by_user_id`, `updated_at`) VALUES
(1, 'about', 'عن وصال', 'منصة وصال تربط ضيوف الرحمن بمقدمي الخدمات المساندة في المسجد الحرام.', 'About Wisal', 'Wisal connects visitors with support service providers at the Grand Mosque.', 1, 1, NULL, '2026-11-04 17:26:49'),
(2, 'how_it_works', 'كيف تعمل المنصة', '1. استعرض الخدمات. 2. اختر الخدمة المناسبة. 3. أرسل طلب الحجز. 4. أكمل الخدمة وقيّم تجربتك.', 'How it works', 'Browse services, choose one, submit a booking, then review your experience.', 1, 1, NULL, '2026-11-04 17:26:49'),
(3, 'privacy', 'سياسة الخصوصية', 'تستخدم البيانات لتشغيل الحسابات والحجوزات والتواصل وتحسين الخدمات. يجب حماية كلمات المرور بتخزين تجزئتها فقط.', 'Privacy Policy', 'Data is used to operate accounts, bookings, communication and service improvement. Passwords must be stored as hashes.', 1, 1, NULL, '2026-11-04 17:26:49'),
(4, 'terms', 'الشروط والأحكام', 'يلتزم المستخدمون بالأنظمة والتعليمات واحترام قدسية المسجد الحرام، والالتزام بالمواعيد ونقاط الالتقاء.', 'Terms & Conditions', 'Users must follow applicable rules, respect the Grand Mosque, and honor agreed times and meeting points.', 1, 1, NULL, '2026-11-04 17:26:49');

-- --------------------------------------------------------

--
-- بنية الجدول `faq_categories`
--

CREATE TABLE `faq_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(150) NOT NULL,
  `name_en` varchar(150) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `faq_categories`
--

INSERT INTO `faq_categories` (`id`, `name_ar`, `name_en`, `sort_order`, `is_active`) VALUES
(1, 'عام عن المنصة', 'About the platform', 1, 1),
(2, 'الحجوزات والخدمات', 'Bookings & services', 2, 1),
(3, 'مقدمو الخدمة', 'Service providers', 3, 1);

-- --------------------------------------------------------

--
-- بنية الجدول `faq_items`
--

CREATE TABLE `faq_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `question_ar` varchar(500) NOT NULL,
  `answer_ar` text NOT NULL,
  `question_en` varchar(500) DEFAULT NULL,
  `answer_en` text DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `faq_items`
--

INSERT INTO `faq_items` (`id`, `category_id`, `question_ar`, `answer_ar`, `question_en`, `answer_en`, `sort_order`, `is_active`) VALUES
(1, 1, 'ما هي الأهداف الرئيسية لمنصة وصال؟', 'تهدف وصال إلى توفير تجربة ميسرة لضيوف الرحمن من خلال الربط مع مقدمي الخدمات المساندة.', NULL, NULL, 1, 1),
(2, 1, 'هل المنصة جهة رسمية أو حكومية؟', 'وصال نموذج رقمي تجريبي لمشروع تخرج جامعي، وليست جهة حكومية أو رسمية.', NULL, NULL, 2, 1),
(3, 2, 'كيف يمكنني حجز خدمة؟', 'اختر الخدمة المناسبة، ثم حدد التاريخ والفترة ونقطة الالتقاء وأكد طلب الحجز.', NULL, NULL, 1, 1),
(4, 2, 'ماذا يحدث بعد إرسال طلب الحجز؟', 'يظهر الطلب لدى المستفيد ومقدم الخدمة بحالة قيد الانتظار حتى يراجعه مقدم الخدمة.', NULL, NULL, 2, 1),
(5, 2, 'هل يمكن إلغاء الحجز؟', 'يمكن إلغاء الحجز وفق حالة الطلب وصلاحيات المستخدم.', NULL, NULL, 3, 1),
(6, 3, 'كيف يسجل مقدم الخدمة خدمة جديدة؟', 'من لوحة مقدم الخدمة يختار خدماتي المنشورة ثم إضافة خدمة جديدة.', NULL, NULL, 1, 1),
(7, 3, 'كيف يحصل مقدم الخدمة على التقييمات؟', 'بعد إكمال الحجز يمكن للمستفيد تقييم الخدمة من نجمة إلى خمس نجوم وكتابة تعليق.', NULL, NULL, 2, 1);

-- --------------------------------------------------------

--
-- بنية الجدول `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `beneficiary_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `homepage_faqs`
--

CREATE TABLE `homepage_faqs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `question_ar` varchar(500) NOT NULL,
  `answer_ar` text NOT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `homepage_faqs`
--

INSERT INTO `homepage_faqs` (`id`, `question_ar`, `answer_ar`, `sort_order`, `is_active`) VALUES
(1, 'ما هي منصة وصال؟', 'وصال هي منصة رقمية اجتماعية مخصصة لقاصدي المسجد الحرام بمكة المكرمة، تهدف إلى ربط الزوار والمعتمرين بمقدمي الخدمات المساندة المؤهلين مثل الإرشاد والترجمة ومساعدة كبار السن وذوي الاحتياجات لتسهيل رحلتهم الإيمانية بكل يسر وطمأنينة.', 1, 1),
(2, 'هل هذه النسخة هي نسخة فعلية أم نموذج تجريبي؟', 'هذه النسخة نموذج تجريبي وتفاعلي لمشروع تخرج جامعي، وتعتمد بعض واجهاتها الحالية على بيانات تجريبية وحفظ محلي لإظهار رحلات المستخدم والميزات.', 2, 1),
(3, 'كيف يتم التحقق من مقدمي الخدمات؟', 'في الرؤية التشغيلية للمنصة، يخضع مقدمو الخدمات المساندة لبرامج تأهيلية تشمل آداب التعامل مع ضيوف الرحمن ومعرفة مسارات وأبواب وتوسعات المسجد الحرام ومبادئ الإسعافات الأولية.', 3, 1),
(4, 'هل يمكنني التبديل بين تجربة المستفيد وتجربة مقدم الخدمة؟', 'تتيح الواجهة التجريبية التبديل بين دور المستفيد ودور مقدم الخدمة لاستعراض لوحات التحكم والميزات.', 4, 1),
(5, 'أين تتم نقاط الالتقاء عادة داخل الحرم المكي؟', 'تُقترح نقاط واضحة ومعروفة مثل ساحة باب الملك فهد (بوابة 79)، وساحة باب الملك عبدالعزيز (بوابة 1)، ومركز استلام العربات بالساحة الغربية، وأمام فندق برج الساعة.', 5, 1);

-- --------------------------------------------------------

--
-- بنية الجدول `how_it_works_steps`
--

CREATE TABLE `how_it_works_steps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `step_number` varchar(5) NOT NULL,
  `title_ar` varchar(180) NOT NULL,
  `description_ar` text NOT NULL,
  `icon_name` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `how_it_works_steps`
--

INSERT INTO `how_it_works_steps` (`id`, `step_number`, `title_ar`, `description_ar`, `icon_name`) VALUES
(1, '01', 'استعراض واختيار الخدمة', 'تصفح قائمة الخدمات المساندة المعتمدة في الحرم المكي الشريف، مع الاطلاع على خبرات ومؤهلات مقدمي الخدمة وتقييمات المعتمرين السابقين.', 'compass'),
(2, '02', 'تحديد الموعد ونقطة الالتقاء', 'اختر اليوم والفترة الزمنية المناسبة لزيارتك، وحدد البوابة أو الساحة الأقرب لمكان قدومك مثل بوابة الملك فهد أو أجياد أو الساحة الغربية.', 'map-pin'),
(3, '03', 'الالتقاء وأداء المناسك بطمأنينة', 'يلتقي بك مقدم الخدمة في النقطة المحددة لمرافقتك ومساعدتك طوال فترة الطواف والسعي والزيارة برفق وإتقان وسكينة تامة.', 'check-circle'),
(4, '04', 'التقييم ومشاركة التجربة', 'بعد إتمام الخدمة بنجاح، شارك انطباعك وتقييمك للمساهمة في استمرار الارتقاء بجودة الخدمات المقدمة لضيوف الرحمن.', 'star');

-- --------------------------------------------------------

--
-- بنية الجدول `languages`
--

CREATE TABLE `languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `name_en` varchar(100) DEFAULT NULL,
  `language_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `languages`
--

INSERT INTO `languages` (`id`, `name_ar`, `name_en`, `language_code`) VALUES
(1, 'العربية', 'Arabic', 'ar'),
(2, 'الإنجليزية', 'English', 'en'),
(3, 'الأردية', 'Urdu', 'ur'),
(4, 'الإندونيسية', 'Indonesian', 'id'),
(5, 'التركية', 'Turkish', 'tr'),
(6, 'الفرنسية', 'French', 'fr'),
(7, 'الفارسية', 'Persian', 'fa'),
(8, 'البنغالية', 'Bengali', 'bn'),
(9, 'الملايوية', 'Malay', 'ms');

-- --------------------------------------------------------

--
-- بنية الجدول `meeting_points`
--

CREATE TABLE `meeting_points` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(180) NOT NULL,
  `name_en` varchar(180) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `meeting_points`
--

INSERT INTO `meeting_points` (`id`, `name_ar`, `name_en`, `description`, `latitude`, `longitude`, `is_active`, `sort_order`) VALUES
(1, 'ساحة باب الملك فهد (بوابة 79)', 'King Fahd Gate Plaza (Gate 79)', 'نقطة لقاء مقترحة', NULL, NULL, 1, 1),
(2, 'ساحة باب الملك عبدالعزيز (بوابة 1)', 'King Abdulaziz Gate Plaza (Gate 1)', 'نقطة لقاء مقترحة', NULL, NULL, 1, 2),
(3, 'الساحة الغربية', 'Western Plaza', 'نقطة لقاء مقترحة', NULL, NULL, 1, 3),
(4, 'أمام فندق برج الساعة - الميزانين', 'Abraj Al Bait - Mezzanine', 'نقطة لقاء مقترحة', NULL, NULL, 1, 4),
(5, 'ساحة باب الفتح (بوابة 45)', 'Al-Fath Gate Plaza (Gate 45)', 'نقطة لقاء مقترحة', NULL, NULL, 1, 5),
(6, 'ساحة باب أجياد (بوابة 5)', 'Ajyad Gate Plaza (Gate 5)', 'نقطة لقاء مقترحة', NULL, NULL, 1, 6),
(7, 'محطة كدي للنقل الترددي', 'Kudai Shuttle Station', 'نقطة لقاء مقترحة', NULL, NULL, 1, 7),
(8, 'ساحة باب السلام (المسعى)', 'Bab Al-Salam Plaza (Masa’a)', 'نقطة لقاء مقترحة', NULL, NULL, 1, 8),
(9, 'منطقة الشبيكة - مدخل الحرم', 'Al-Shubaikah - Haram Entrance', 'نقطة لقاء مقترحة', NULL, NULL, 1, 9);

-- --------------------------------------------------------

--
-- بنية الجدول `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(180) NOT NULL,
  `body` text NOT NULL,
  `notification_type` varchar(60) NOT NULL DEFAULT 'general',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `platform_values`
--

CREATE TABLE `platform_values` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value_title_ar` varchar(150) NOT NULL,
  `description_ar` text NOT NULL,
  `icon_name` varchar(80) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `platform_values`
--

INSERT INTO `platform_values` (`id`, `value_title_ar`, `description_ar`, `icon_name`, `sort_order`) VALUES
(1, 'الأمانة والمسؤولية', 'استشعار شرف خدمة ضيف الرحمن والالتزام بأعلى درجات المصداقية والإخلاص.', 'shield-check', 1),
(2, 'الرفق والإتقان', 'معاملة كبار السن والعائلات بالرحمة واللين، وضمان تقديم خدمات بمستوى احترافي عالٍ.', 'award', 2),
(3, 'الضيافة المكية', 'إحياء الموروث العريق لأهل مكة في إكرام الوفود وبذل الجهد لإدخال السرور على قلوبهم.', 'users', 3);

-- --------------------------------------------------------

--
-- بنية الجدول `providers`
--

CREATE TABLE `providers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `age` tinyint(3) UNSIGNED DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `service_type` varchar(150) NOT NULL DEFAULT '',
  `languages` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `experience_years` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `verification_status` enum('not_submitted','pending','approved','rejected') NOT NULL DEFAULT 'not_submitted',
  `average_rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `ratings_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `providers`
--

INSERT INTO `providers` (`id`, `user_id`, `age`, `nationality`, `service_type`, `languages`, `bio`, `experience_years`, `is_verified`, `verification_status`, `average_rating`, `ratings_count`, `created_at`, `updated_at`) VALUES
(4, 4, 31, 'سعودي', 'مرافقة وإرشاد وتسهيل مناسك', 'العربية,الإنجليزية,الأردية', 'ابن مكة المكرمة، نشأت في رحابها وتطوعت لسنوات في خدمة قاصدي البيت الحرام. خبير بتنظيم مسارات الطواف والسعي وأوقات الهدوء وتجنب الازدحام مع الالتزام بأعلى معايير الرفق والأدب.', 7, 1, 'approved', 0.00, 0, '2026-11-11 13:46:14', '2026-11-11 13:46:14'),
(5, 5, 38, 'سعودي', 'مساعدة كبار السن وذوي الحركة المحدودة', 'العربية,التركية,الإنجليزية', 'متخصص في رعاية ومساندة كبار السن وقيادة العربات المخصصة داخل الحرم المكي. حاصل على دورات الإسعافات الأولية والتعامل مع الطوارئ وتيسير العبادة بكل طمأنينة ووقار.', 6, 1, 'approved', 0.00, 0, '2026-11-11 13:46:14', '2026-11-11 13:46:14');

-- --------------------------------------------------------

--
-- بنية الجدول `provider_languages`
--

CREATE TABLE `provider_languages` (
  `provider_id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `proficiency` enum('basic','good','fluent','native') NOT NULL DEFAULT 'good'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `provider_languages`
--

INSERT INTO `provider_languages` (`provider_id`, `language_id`, `proficiency`) VALUES
(4, 1, 'fluent'),
(4, 2, 'fluent'),
(4, 3, 'fluent'),
(5, 1, 'fluent'),
(5, 2, 'fluent'),
(5, 5, 'fluent');

-- --------------------------------------------------------

--
-- بنية الجدول `provider_rayan`
--

CREATE TABLE `provider_rayan` (
  `id` int(11) NOT NULL,
  `provider_name` varchar(150) NOT NULL,
  `service_name` varchar(180) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `provider_rayan`
--

INSERT INTO `provider_rayan` (`id`, `provider_name`, `service_name`) VALUES
(1, 'م. ريان بن خالد الشريف', 'مرافقة وإرشاد'),
(2, 'م. ريان بن خالد الشريف', 'الترجمة والمساعدة اللغوية'),
(3, 'م. ريان بن خالد الشريف', 'خدمات الدعم والمساند');

-- --------------------------------------------------------

--
-- بنية الجدول `provider_sulaiman`
--

CREATE TABLE `provider_sulaiman` (
  `id` int(11) NOT NULL,
  `provider_name` varchar(150) NOT NULL,
  `service_name` varchar(180) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `provider_sulaiman`
--

INSERT INTO `provider_sulaiman` (`id`, `provider_name`, `service_name`) VALUES
(1, 'سليمان بن عبدالله الهذلي', 'مساعدة كبار السن'),
(2, 'سليمان بن عبدالله الهذلي', 'خدمات المساعد والتنقل');

-- --------------------------------------------------------

--
-- بنية الجدول `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `provider_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `saudi_regions`
--

CREATE TABLE `saudi_regions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_ar` varchar(100) NOT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `saudi_regions`
--

INSERT INTO `saudi_regions` (`id`, `name_ar`, `sort_order`, `is_active`) VALUES
(1, 'مكة المكرمة', 1, 1),
(2, 'المدينة المنورة', 2, 1),
(3, 'الرياض', 3, 1),
(4, 'جدة', 4, 1),
(5, 'الشرقية', 5, 1),
(6, 'عسير', 6, 1),
(7, 'تبوك', 7, 1),
(8, 'أخرى', 8, 1);

-- --------------------------------------------------------

--
-- بنية الجدول `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `provider_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `service_name` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `price_unit` varchar(100) DEFAULT 'ريال / خدمة',
  `duration` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `cover_image_url` varchar(1000) DEFAULT NULL,
  `average_rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `ratings_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `services`
--

INSERT INTO `services` (`id`, `provider_id`, `category_id`, `service_name`, `description`, `price`, `price_unit`, `duration`, `location`, `cover_image_url`, `average_rating`, `ratings_count`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(5, 4, 1, 'مرافقة معتمر وإرشاد خلال مناسك العمرة كاملة', 'خدمة مرافقة احترافية متكاملة لخطوات العمرة بداية من نقطة الالتقاء بالساحات، وتوجيه مسار الطواف في أوقات الهدوء، والسعي، مع تقديم التوجيه المكاني والإرشادي برفق وسكينة.', 150.00, 'ريال / جولة كاملة', '3 - 4 ساعات', 'ساحات وصحن المطاف والمسعى', 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80', 0.00, 0, 1, 0, '2026-11-11 13:46:14', '2026-11-11 13:46:14'),
(6, 5, 2, 'مساعدة كبار السن في الطواف والسعي بالعربة', 'رعاية فائقة ومساندة حانية لآبائنا وأمهاتنا من كبار السن، تتضمن قيادة وتأمين الكراسي المتحركة في الأدوار المخصصة، والتوقف المناسب للاستراحة وشرب ماء زمزم.', 180.00, 'ريال / جولة', '2.5 - 3.5 ساعات', 'أدوار العربات - المطاف والمسعى', 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80', 0.00, 0, 1, 0, '2026-11-11 13:46:14', '2026-11-11 13:46:14'),
(7, 4, 3, 'الترجمة والتواصل اللغوي لضيوف الحرم (الإنجليزية والأردية)', 'تسهيل التواصل الفوري وترجمة التعليمات والإرشادات للزوار الناطقين بالإنجليزية أو الأردية، ومساعدتهم في إنهاء متطلبات الزيارة والتنقل بين مرافق الحرم بكل يسر.', 120.00, 'ريال / ساعتين', 'ساعتان', 'أروقة وساحات الحرم المكي', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80', 0.00, 0, 1, 0, '2026-11-11 13:46:14', '2026-11-11 13:46:14'),
(8, 5, 4, 'إدارة وتوجيه التنقل بالعربات الكهربائية والجسور', 'مساعدة الحجاج والمعتمرين في حجز واستلام وتشغيل العربات الكهربائية الرسمية، وتوجيه المسار عبر المسارات المعتمدة والجسور المعلقة لتيسير الحركة والتنقل.', 130.00, 'ريال / جولة', '2 - 3 ساعات', 'جسر العربات وميزانين المطاف', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80', 0.00, 0, 1, 0, '2026-11-11 13:46:14', '2026-11-11 13:46:14'),
(9, 4, 5, 'مساندة العائلات ومرافقة الأطفال وذوي الاحتياجات', 'خدمة دعم شاملة للعائلات الزائرة لضمان سلامة الأطفال والتنسيق خلال أوقات الذروة، وتنظيم التقاء أفراد الأسرة عند نقاط تجمع واضحة ومحمية.', 160.00, 'ريال / 3 ساعات', '3 ساعات', 'الساحات الخارجية والتوسعة السعودية الثالثة', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80', 0.00, 0, 1, 0, '2026-11-11 13:46:14', '2026-11-11 13:46:14');

-- --------------------------------------------------------

--
-- بنية الجدول `service_categories`
--

CREATE TABLE `service_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_key` varchar(60) NOT NULL,
  `name_ar` varchar(150) NOT NULL,
  `name_en` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon_name` varchar(80) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `service_categories`
--

INSERT INTO `service_categories` (`id`, `category_key`, `name_ar`, `name_en`, `description`, `icon_name`, `sort_order`, `is_active`) VALUES
(1, 'escort_guidance', 'مرافقة وإرشاد', 'Escort & Guidance', 'مرافقة معتمرين وزوار الحرم الشريف والإرشاد الدقيق للمناسك والأبواب', 'map-pinned', 1, 1),
(2, 'elderly_assistance', 'مساعدة كبار السن', 'Elderly Assistance', 'رعاية فائقة ومساندة متخصصة لكبار السن أثناء الطواف والسعي والصلوات', 'heart-handshake', 2, 1),
(3, 'translation', 'الترجمة والمساعدة اللغوية', 'Translation & Languages', 'ترجمة فورية وتسهيل التواصل بعدة لغات لضيوف الرحمن من مختلف البلدان', 'languages', 3, 1),
(4, 'mobility_support', 'خدمات المساعدة والتنقل', 'Mobility Support', 'مساعدة في قيادة العربات اليدوية والكهربائية والتنقل السلس داخل أروقة الحرم', 'accessibility', 4, 1),
(5, 'support_care', 'خدمات الدعم والمساندة', 'Support & Care', 'تسهيل تلبية الاحتياجات الخاصة ومساعدة العائلات والأطفال أثناء التواجد بالحرم', 'hand-heart', 5, 1);

-- --------------------------------------------------------

--
-- بنية الجدول `service_features`
--

CREATE TABLE `service_features` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `feature_text` varchar(500) NOT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `service_features`
--

INSERT INTO `service_features` (`id`, `service_id`, `feature_text`, `sort_order`) VALUES
(1, 5, 'استقبال عند بوابة الحرم المتفق عليها', 1),
(2, 5, 'توجيه مسارات الطواف بعيداً عن الكثافة العالية', 2),
(3, 5, 'مرافقة السعي بين الصفا والمروة خطوة بخطوة', 3),
(4, 5, 'إرشاد لمصليات السكينة وأماكن ماء زمزم المبارك', 4),
(5, 5, 'مساعدة في إنهاء التحلل والعودة للنقطة المحددة', 5),
(6, 6, 'قيادة آمنة وهادئة للعربة وتجنب التدافع', 1),
(7, 6, 'عناية بوضعية الجلوس والراحة الجسدية للمسن', 2),
(8, 6, 'توفير ماء زمزم والتوقف وقت الصلوات المكتوبة', 3),
(9, 6, 'حاصل على تدريب إسعافات أولية متقدم', 4),
(10, 6, 'صبر ورحابة صدر ومراعاة تامة للحالة الصحية', 5),
(11, 7, 'ترجمة دقيقة وطلاقة لغوية بالإنجليزية والأردية', 1),
(12, 7, 'شرح معالم الحرم وأماكن الخدمات باللغة الأم', 2),
(13, 7, 'المساعدة في الاستفسار من مكاتب الإرشاد والتائهين', 3),
(14, 7, 'التنسيق مع مقدمي الخدمات ومحطات النقل', 4),
(15, 8, 'المساعدة في تفعيل تطبيقات استئجار العربات', 1),
(16, 8, 'التوجيه لمسارات الشحن المعتمدة ومصاعد الأدوار', 2),
(17, 8, 'مرافقة أمنية ووقائية لتفادي التوقف المفاجئ', 3),
(18, 8, 'إرشاد لمصليات ذوي الإعاقة المجهزة', 4),
(19, 9, 'تحديد نقاط التجمع وتجنب فقدان الأطفال', 1),
(20, 9, 'المساعدة في حمل الأمتعة الخفيفة والمستلزمات', 2),
(21, 9, 'اختيار أماكن هادئة ومكيفة لجلوس الأسرة والصلوات', 3),
(22, 9, 'دعم لوجستي حتى ركوب حافلات النقل', 4);

-- --------------------------------------------------------

--
-- بنية الجدول `service_media`
--

CREATE TABLE `service_media` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `media_url` varchar(1000) NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `service_meeting_points`
--

CREATE TABLE `service_meeting_points` (
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `meeting_point_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `service_meeting_points`
--

INSERT INTO `service_meeting_points` (`service_id`, `meeting_point_id`) VALUES
(5, 1),
(5, 2),
(5, 4),
(6, 6),
(6, 8),
(7, 1),
(7, 5),
(7, 9),
(8, 2),
(9, 1),
(9, 5),
(9, 7);

-- --------------------------------------------------------

--
-- بنية الجدول `service_templates`
--

CREATE TABLE `service_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `template_key` varchar(60) NOT NULL,
  `provider_display_name` varchar(180) NOT NULL,
  `service_name` varchar(220) NOT NULL,
  `description` text NOT NULL,
  `category_key` varchar(60) NOT NULL,
  `suggested_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `price_unit` varchar(100) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `meeting_points_json` longtext DEFAULT NULL,
  `features_json` longtext DEFAULT NULL,
  `image_url` varchar(1000) DEFAULT NULL,
  `sort_order` smallint(6) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `service_templates`
--

INSERT INTO `service_templates` (`id`, `template_key`, `provider_display_name`, `service_name`, `description`, `category_key`, `suggested_price`, `price_unit`, `duration`, `location`, `meeting_points_json`, `features_json`, `image_url`, `sort_order`) VALUES
(1, 'srv_demo_1', 'م. ريان بن خالد الشريف', 'مرافقة معتمر وإرشاد خلال مناسك العمرة كاملة', 'خدمة مرافقة احترافية متكاملة لخطوات العمرة بداية من نقطة الالتقاء بالساحات، وتوجيه مسار الطواف في أوقات الهدوء، والسعي، مع تقديم التوجيه المكاني والإرشادي برفق وسكينة.', 'escort_guidance', 150.00, 'ريال / جولة كاملة', '3 - 4 ساعات', 'ساحات وصحن المطاف والمسعى', '[\"ساحة باب الملك فهد (بوابة 79)\",\"ساحة باب الملك عبدالعزيز (بوابة 1)\",\"أمام فندق برج الساعة - الميزانين\"]', '[\"استقبال عند بوابة الحرم المتفق عليها\",\"توجيه مسارات الطواف بعيداً عن الكثافة العالية\",\"مرافقة السعي بين الصفا والمروة خطوة بخطوة\",\"إرشاد لمصليات السكينة وأماكن ماء زمزم المبارك\",\"مساعدة في إنهاء التحلل والعودة للنقطة المحددة\"]', 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&auto=format&fit=crop&q=80', 1),
(2, 'srv_demo_2', 'سليمان بن عبدالرحمن الهذلي', 'مساعدة كبار السن في الطواف والسعي بالعربة', 'رعاية فائقة ومساندة حانية لكبار السن، تتضمن قيادة وتأمين الكراسي المتحركة في الأدوار المخصصة، والتوقف المناسب للاستراحة وشرب ماء زمزم.', 'elderly_assistance', 180.00, 'ريال / جولة', '2.5 - 3.5 ساعات', 'أدوار العربات - المطاف والمسعى', '[\"مركز استلام العربات بالساحة الغربية\",\"ساحة باب أجياد (بوابة 5)\",\"ساحة باب السلام (المسعى)\"]', '[\"قيادة آمنة وهادئة للعربة وتجنب التدافع\",\"عناية بوضعية الجلوس والراحة الجسدية للمسن\",\"توفير ماء زمزم والتوقف وقت الصلوات المكتوبة\",\"حاصل على تدريب إسعافات أولية متقدم\",\"صبر ورحابة صدر ومراعاة تامة للحالة الصحية\"]', 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80', 2),
(3, 'srv_demo_3', 'م. ريان بن خالد الشريف', 'الترجمة والتواصل اللغوي لضيوف الحرم (الإنجليزية والأردية)', 'تسهيل التواصل الفوري وترجمة التعليمات والإرشادات للزوار الناطقين بالإنجليزية أو الأردية، ومساعدتهم في إنهاء متطلبات الزيارة والتنقل بين مرافق الحرم بكل يسر.', 'translation', 120.00, 'ريال / ساعتين', 'ساعتان', 'أروقة وساحات الحرم المكي', '[\"ساحة باب الفتح (بوابة 45)\",\"ساحة باب الملك فهد (بوابة 79)\",\"منطقة الشبيكة - مدخل الحرم\"]', '[\"ترجمة دقيقة وطلاقة لغوية بالإنجليزية والأردية\",\"شرح معالم الحرم وأماكن الخدمات باللغة الأم\",\"المساعدة في الاستفسار من مكاتب الإرشاد والتائهين\",\"التنسيق مع مقدمي الخدمات ومحطات النقل\"]', 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80', 3),
(4, 'srv_demo_4', 'سليمان بن عبدالرحمن الهذلي', 'إدارة وتوجيه التنقل بالعربات الكهربائية والجسور', 'مساعدة الحجاج والمعتمرين في حجز واستلام وتشغيل العربات الكهربائية الرسمية، وتوجيه المسار عبر المسارات المعتمدة والجسور المعلقة لتيسير الحركة والتنقل.', 'mobility_support', 130.00, 'ريال / جولة', '2 - 3 ساعات', 'جسر العربات وميزانين المطاف', '[\"مركز استلام العربات بالساحة الغربية\",\"ساحة باب الملك عبدالعزيز (بوابة 1)\"]', '[\"المساعدة في تفعيل تطبيقات استئجار العربات\",\"التوجيه لمسارات الشحن المعتمدة ومصاعد الأدوار\",\"مرافقة أمنية ووقائية لتفادي التوقف المفاجئ\",\"إرشاد لمصليات ذوي الإعاقة المجهزة\"]', 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80', 4),
(5, 'srv_demo_5', 'م. ريان بن خالد الشريف', 'مساندة العائلات ومرافقة الأطفال وذوي الاحتياجات', 'خدمة دعم شاملة للعائلات الزائرة لضمان سلامة الأطفال والتنسيق خلال أوقات الذروة، وتنظيم التقاء أفراد الأسرة عند نقاط تجمع واضحة ومحمية.', 'support_care', 160.00, 'ريال / 3 ساعات', '3 ساعات', 'الساحات الخارجية والتوسعة السعودية الثالثة', '[\"ساحة باب الملك فهد (بوابة 79)\",\"محطة كدي للنقل الترددي\",\"ساحة باب الفتح (بوابة 45)\"]', '[\"تحديد نقاط التجمع وتجنب فقدان الأطفال\",\"المساعدة في حمل الأمتعة الخفيفة والمستلزمات\",\"اختيار أماكن هادئة ومكيفة لجلوس الأسرة والصلوات\",\"دعم لوجستي حتى ركوب حافلات النقل\"]', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80', 5);

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('beneficiary','provider','employee','supervisor','admin') NOT NULL,
  `avatar_url` varchar(1000) DEFAULT NULL,
  `preferred_language_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `phone_verified_at` datetime DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `user_type`, `avatar_url`, `preferred_language_id`, `is_active`, `phone_verified_at`, `email_verified_at`, `last_login_at`, `created_at`, `updated_at`) VALUES
(4, 'م. ريان بن خالد الشريف', '0543219876', 'rayan.shareef@example.com', '$2y$10$53lhA3g3Oo3GvobnpJcHFO9Vru.DWOduQdgiw7YyWnYqh0ZD3qFCe', 'provider', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 1, 1, NULL, NULL, NULL, '2026-11-11 13:46:14', '2026-11-11 13:46:14'),
(5, 'سليمان بن عبدالرحمن الهذلي', '0567891234', 'sulaiman@example.com', '$2y$10$53lhA3g3Oo3GvobnpJcHFO9Vru.DWOduQdgiw7YyWnYqh0ZD3qFCe', 'provider', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 1, 1, NULL, NULL, NULL, '2026-11-11 13:46:14', '2026-11-11 13:46:14');

-- --------------------------------------------------------

--
-- بنية الجدول `user_consents`
--

CREATE TABLE `user_consents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `consent_type` enum('terms','privacy') NOT NULL,
  `version_no` int(10) UNSIGNED NOT NULL,
  `accepted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `user_devices`
--

CREATE TABLE `user_devices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `platform` enum('android','ios','web') NOT NULL,
  `device_token` varchar(1000) NOT NULL,
  `device_name` varchar(180) DEFAULT NULL,
  `last_seen_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `beneficiary_profiles`
--
ALTER TABLE `beneficiary_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_beneficiary_user` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_booking_number` (`booking_number`),
  ADD KEY `idx_bookings_beneficiary` (`user_id`,`created_at`),
  ADD KEY `idx_bookings_provider` (`provider_id`,`status`,`booking_date`),
  ADD KEY `idx_bookings_service` (`service_id`),
  ADD KEY `idx_bookings_date_status` (`booking_date`,`status`),
  ADD KEY `fk_booking_meeting_point` (`meeting_point_id`),
  ADD KEY `fk_booking_cancelled_by` (`cancelled_by_user_id`);

--
-- Indexes for table `booking_additional_contacts`
--
ALTER TABLE `booking_additional_contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_booking_contacts` (`booking_id`);

--
-- Indexes for table `booking_followups`
--
ALTER TABLE `booking_followups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_followups_booking` (`booking_id`,`created_at`),
  ADD KEY `idx_followups_assignee` (`assigned_to_user_id`,`followup_status`),
  ADD KEY `fk_followup_creator` (`created_by_user_id`);

--
-- Indexes for table `booking_status_history`
--
ALTER TABLE `booking_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_booking_history` (`booking_id`,`created_at`),
  ADD KEY `fk_booking_history_user` (`changed_by_user_id`);

--
-- Indexes for table `booking_time_slots`
--
ALTER TABLE `booking_time_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_time_slot_key` (`slot_key`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_status_date` (`status`,`created_at`),
  ADD KEY `fk_contact_user` (`user_id`),
  ADD KEY `fk_contact_replier` (`replied_by_user_id`);

--
-- Indexes for table `content_pages`
--
ALTER TABLE `content_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_content_page_key` (`page_key`),
  ADD KEY `fk_content_updated_by` (`updated_by_user_id`);

--
-- Indexes for table `faq_categories`
--
ALTER TABLE `faq_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faq_items`
--
ALTER TABLE `faq_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_faq_category` (`category_id`,`is_active`,`sort_order`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_favorite_user_service` (`beneficiary_id`,`service_id`),
  ADD KEY `idx_favorites_service` (`service_id`);

--
-- Indexes for table `homepage_faqs`
--
ALTER TABLE `homepage_faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `how_it_works_steps`
--
ALTER TABLE `how_it_works_steps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_step_number` (`step_number`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_language_ar` (`name_ar`),
  ADD UNIQUE KEY `uq_language_code` (`language_code`);

--
-- Indexes for table `meeting_points`
--
ALTER TABLE `meeting_points`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_meeting_points_active` (`is_active`,`sort_order`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notifications_user_read` (`user_id`,`is_read`,`created_at`),
  ADD KEY `fk_notification_booking` (`booking_id`);

--
-- Indexes for table `platform_values`
--
ALTER TABLE `platform_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_provider_user` (`user_id`),
  ADD KEY `idx_provider_verified` (`is_verified`,`verification_status`);

--
-- Indexes for table `provider_languages`
--
ALTER TABLE `provider_languages`
  ADD PRIMARY KEY (`provider_id`,`language_id`),
  ADD KEY `fk_provider_languages_language` (`language_id`);

--
-- Indexes for table `provider_rayan`
--
ALTER TABLE `provider_rayan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `provider_sulaiman`
--
ALTER TABLE `provider_sulaiman`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_rating_booking` (`booking_id`),
  ADD KEY `idx_ratings_user` (`user_id`),
  ADD KEY `idx_ratings_service` (`service_id`,`created_at`),
  ADD KEY `idx_ratings_provider` (`provider_id`,`created_at`);

--
-- Indexes for table `saudi_regions`
--
ALTER TABLE `saudi_regions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_region_name_ar` (`name_ar`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_services_provider` (`provider_id`),
  ADD KEY `idx_services_category_active` (`category_id`,`is_active`),
  ADD KEY `idx_services_price` (`price`),
  ADD KEY `idx_services_rating` (`average_rating`);
ALTER TABLE `services` ADD FULLTEXT KEY `ft_services_search` (`service_name`,`description`,`location`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_category_key` (`category_key`),
  ADD KEY `idx_category_active_sort` (`is_active`,`sort_order`);

--
-- Indexes for table `service_features`
--
ALTER TABLE `service_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_features_service` (`service_id`);

--
-- Indexes for table `service_media`
--
ALTER TABLE `service_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_service_media` (`service_id`);

--
-- Indexes for table `service_meeting_points`
--
ALTER TABLE `service_meeting_points`
  ADD PRIMARY KEY (`service_id`,`meeting_point_id`),
  ADD KEY `fk_service_meeting_point` (`meeting_point_id`);

--
-- Indexes for table `service_templates`
--
ALTER TABLE `service_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_service_template_key` (`template_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_phone` (`phone`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_role_active` (`user_type`,`is_active`),
  ADD KEY `fk_user_preferred_language` (`preferred_language_id`);

--
-- Indexes for table `user_consents`
--
ALTER TABLE `user_consents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_consent_version` (`user_id`,`consent_type`,`version_no`);

--
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_device_token` (`device_token`(191)),
  ADD KEY `idx_devices_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `beneficiary_profiles`
--
ALTER TABLE `beneficiary_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_additional_contacts`
--
ALTER TABLE `booking_additional_contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_followups`
--
ALTER TABLE `booking_followups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_status_history`
--
ALTER TABLE `booking_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_time_slots`
--
ALTER TABLE `booking_time_slots`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `content_pages`
--
ALTER TABLE `content_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `faq_categories`
--
ALTER TABLE `faq_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faq_items`
--
ALTER TABLE `faq_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `homepage_faqs`
--
ALTER TABLE `homepage_faqs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `how_it_works_steps`
--
ALTER TABLE `how_it_works_steps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `meeting_points`
--
ALTER TABLE `meeting_points`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `platform_values`
--
ALTER TABLE `platform_values`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `providers`
--
ALTER TABLE `providers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `provider_rayan`
--
ALTER TABLE `provider_rayan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `provider_sulaiman`
--
ALTER TABLE `provider_sulaiman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saudi_regions`
--
ALTER TABLE `saudi_regions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `service_features`
--
ALTER TABLE `service_features`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `service_media`
--
ALTER TABLE `service_media`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_templates`
--
ALTER TABLE `service_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_consents`
--
ALTER TABLE `user_consents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `beneficiary_profiles`
--
ALTER TABLE `beneficiary_profiles`
  ADD CONSTRAINT `fk_beneficiary_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_booking_beneficiary` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_booking_cancelled_by` FOREIGN KEY (`cancelled_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_booking_meeting_point` FOREIGN KEY (`meeting_point_id`) REFERENCES `meeting_points` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_booking_provider` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_booking_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- قيود الجداول `booking_additional_contacts`
--
ALTER TABLE `booking_additional_contacts`
  ADD CONSTRAINT `fk_booking_contacts_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `booking_followups`
--
ALTER TABLE `booking_followups`
  ADD CONSTRAINT `fk_followup_assignee` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_followup_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_followup_creator` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- قيود الجداول `booking_status_history`
--
ALTER TABLE `booking_status_history`
  ADD CONSTRAINT `fk_booking_history_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_history_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- قيود الجداول `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `fk_contact_replier` FOREIGN KEY (`replied_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_contact_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- قيود الجداول `content_pages`
--
ALTER TABLE `content_pages`
  ADD CONSTRAINT `fk_content_updated_by` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- قيود الجداول `faq_items`
--
ALTER TABLE `faq_items`
  ADD CONSTRAINT `fk_faq_category` FOREIGN KEY (`category_id`) REFERENCES `faq_categories` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorite_beneficiary` FOREIGN KEY (`beneficiary_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favorite_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `providers`
--
ALTER TABLE `providers`
  ADD CONSTRAINT `fk_provider_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `provider_languages`
--
ALTER TABLE `provider_languages`
  ADD CONSTRAINT `fk_provider_languages_language` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`),
  ADD CONSTRAINT `fk_provider_languages_provider` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `fk_rating_beneficiary` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_rating_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `fk_rating_provider` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rating_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- قيود الجداول `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `fk_services_category` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_services_provider` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`id`);

--
-- قيود الجداول `service_features`
--
ALTER TABLE `service_features`
  ADD CONSTRAINT `fk_features_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `service_media`
--
ALTER TABLE `service_media`
  ADD CONSTRAINT `fk_service_media_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `service_meeting_points`
--
ALTER TABLE `service_meeting_points`
  ADD CONSTRAINT `fk_service_meeting_point` FOREIGN KEY (`meeting_point_id`) REFERENCES `meeting_points` (`id`),
  ADD CONSTRAINT `fk_service_meeting_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_preferred_language` FOREIGN KEY (`preferred_language_id`) REFERENCES `languages` (`id`) ON DELETE SET NULL;

--
-- قيود الجداول `user_consents`
--
ALTER TABLE `user_consents`
  ADD CONSTRAINT `fk_consent_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `fk_device_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
