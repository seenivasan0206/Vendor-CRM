package com.vendorcrm.notifications.dto;

import com.vendorcrm.notifications.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long userId;
    private String username;
    private String userEmail;
    private String title;
    private String message;
    private String notificationType;
    private Boolean isRead;
    private Long referenceId;
    private String referenceType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NotificationResponse fromEntity(Notification entity) {
        if (entity == null) {
            return null;
        }

        Long uId = null;
        String uName = null;
        String uEmail = null;

        if (entity.getUser() != null) {
            uId = entity.getUser().getId();
            uName = entity.getUser().getUsername();
            uEmail = entity.getUser().getEmail();
        }

        return NotificationResponse.builder()
                .id(entity.getId())
                .userId(uId)
                .username(uName)
                .userEmail(uEmail)
                .title(entity.getTitle())
                .message(entity.getMessage())
                .notificationType(entity.getNotificationType())
                .isRead(entity.getIsRead())
                .referenceId(entity.getReferenceId())
                .referenceType(entity.getReferenceType())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

