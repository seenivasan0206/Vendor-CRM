package com.vendorcrm.notifications.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class NotificationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Notification type is required")
    @Pattern(regexp = "^(GENERAL|PURCHASE_ORDER|CONTRACT|VENDOR|SYSTEM|REMINDER)$",
            message = "Notification type must be GENERAL, PURCHASE_ORDER, CONTRACT, VENDOR, SYSTEM, or REMINDER")
    private String notificationType;

    private Long referenceId;

    private String referenceType;
}

