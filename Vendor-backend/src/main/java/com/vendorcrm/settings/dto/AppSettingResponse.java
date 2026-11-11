package com.vendorcrm.settings.dto;

import com.vendorcrm.settings.entity.AppSetting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppSettingResponse {

    private Long id;
    private String settingKey;
    private String settingValue;
    private String description;
    private String settingCategory;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AppSettingResponse fromEntity(AppSetting entity) {
        if (entity == null) {
            return null;
        }
        return AppSettingResponse.builder()
                .id(entity.getId())
                .settingKey(entity.getSettingKey())
                .settingValue(entity.getSettingValue())
                .description(entity.getDescription())
                .settingCategory(entity.getSettingCategory())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

