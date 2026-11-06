package com.vendorcrm.settings.entity;

import com.vendorcrm.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "setting_key", length = 100, nullable = false, unique = true)
    private String settingKey;

    @Column(name = "setting_value", length = 500, nullable = false)
    private String settingValue;

    @Column(length = 255)
    private String description;

    @Builder.Default
    @Column(name = "setting_category", length = 50, nullable = false)
    private String settingCategory = "GENERAL"; // GENERAL, SECURITY, EMAIL, NOTIFICATION, SYSTEM

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}

