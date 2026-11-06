-- =====================================================
-- Migration V2: Modules 9, 10, 11, 12, 13
-- Vendor Communication, Notifications, App Settings
-- =====================================================

-- Vendor Communications Table
CREATE TABLE IF NOT EXISTS vendor_communications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    communication_type VARCHAR(30) NOT NULL,
    communication_date DATETIME NOT NULL,
    communication_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_by VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comm_vendor FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE,
    INDEX idx_comm_vendor_id (vendor_id),
    INDEX idx_comm_type (communication_type),
    INDEX idx_comm_status (communication_status)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id BIGINT,
    reference_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_notification_user_id (user_id),
    INDEX idx_notification_is_read (is_read),
    INDEX idx_notification_type (notification_type)
);

-- Application Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(500) NOT NULL,
    description VARCHAR(255),
    setting_category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_app_settings_key (setting_key),
    INDEX idx_app_settings_category (setting_category)
);

-- Default Application Settings
INSERT INTO app_settings (setting_key, setting_value, description, setting_category, is_active)
VALUES
    ('COMPANY_NAME', 'Vendor CRM Enterprise', 'Official company name displayed in CRM', 'GENERAL', true),
    ('CURRENCY_CODE', 'USD', 'Default currency code for transactions', 'GENERAL', true),
    ('CURRENCY_SYMBOL', '$', 'Default currency symbol', 'GENERAL', true),
    ('DEFAULT_PAYMENT_TERMS', 'Net 30', 'Default payment terms assigned to new vendors', 'GENERAL', true),
    ('CONTRACT_EXPIRY_ALERT_DAYS', '30', 'Days before contract expiration to trigger alert', 'NOTIFICATION', true),
    ('PO_APPROVAL_THRESHOLD', '10000.00', 'Threshold above which POs require Admin approval', 'SYSTEM', true),
    ('ENABLE_EMAIL_NOTIFICATIONS', 'true', 'Master toggle for system email notifications', 'NOTIFICATION', true)
ON DUPLICATE KEY UPDATE setting_value = setting_value;

