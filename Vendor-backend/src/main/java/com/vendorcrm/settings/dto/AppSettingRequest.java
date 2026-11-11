package com.vendorcrm.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppSettingRequest {

    @NotBlank(message = "Setting key is required")
    @Size(max = 100, message = "Setting key cannot exceed 100 characters")
    private String settingKey;

    @NotBlank(message = "Setting value is required")
    @Size(max = 500, message = "Setting value cannot exceed 500 characters")
    private String settingValue;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @Size(max = 50, message = "Setting category cannot exceed 50 characters")
    private String settingCategory;

    private Boolean isActive;
}

