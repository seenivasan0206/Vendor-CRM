package com.vendorcrm.notifications.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationUpdateRequest {

    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    private String message;

    @Pattern(regexp = "^(GENERAL|PURCHASE_ORDER|CONTRACT|VENDOR|SYSTEM|REMINDER)$",
            message = "Notification type must be GENERAL, PURCHASE_ORDER, CONTRACT, VENDOR, SYSTEM, or REMINDER")
    private String notificationType;

    private Boolean isRead;
}

