-- =====================================================
-- Migration V4: Seed default administrator user
-- Email    : admin@zenve.com
-- Password : password123 (BCrypt hashed)
-- =====================================================

INSERT INTO users (username, email, password, full_name, phone_number, is_active)
VALUES (
    'admin',
    'admin@zenve.com',
    '$2a$10$qrIT/H.7O7cakMWRcV/Lk.dr5aSPmutQFiQUVOVriWahxCxrR6ohy',
    'Zenve Administrator',
    NULL,
    TRUE
)
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    full_name = VALUES(full_name),
    is_active = VALUES(is_active);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'ROLE_ADMIN'
WHERE u.email = 'admin@zenve.com'
ON DUPLICATE KEY UPDATE user_id = user_id;