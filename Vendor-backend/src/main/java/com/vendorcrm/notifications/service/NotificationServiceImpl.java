package com.vendorcrm.notifications.service;

import com.vendorcrm.auth.entity.Role;
import com.vendorcrm.auth.entity.User;
import com.vendorcrm.auth.repository.UserRepository;
import com.vendorcrm.exception.BadRequestException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.notifications.dto.NotificationRequest;
import com.vendorcrm.notifications.dto.NotificationResponse;
import com.vendorcrm.notifications.dto.NotificationUpdateRequest;
import com.vendorcrm.notifications.entity.Notification;
import com.vendorcrm.notifications.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        Notification notification = Notification.builder()
                .user(user)
                .title(request.getTitle())
                .message(request.getMessage())
                .notificationType(request.getNotificationType())
                .isRead(false)
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created with ID {} for user ID {}", saved.getId(), user.getId());
        return NotificationResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long id, String currentUsername) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        validateOwnershipOrAdmin(notification.getUser(), currentUsername);
        return NotificationResponse.fromEntity(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getAllNotifications(Pageable pageable) {
        return notificationRepository.findAll(pageable).map(NotificationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsByUserId(Long userId, Pageable pageable, String currentUsername) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        validateOwnershipOrAdmin(targetUser, currentUsername);
        return notificationRepository.findByUserId(userId, pageable).map(NotificationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getMyNotifications(Pageable pageable, String currentUsername) {
        User currentUser = getCurrentUser(currentUsername);
        return notificationRepository.findByUserId(currentUser.getId(), pageable).map(NotificationResponse::fromEntity);
    }

    @Override
    @Transactional
    public NotificationResponse updateNotification(Long id, NotificationUpdateRequest request, String currentUsername) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        validateOwnershipOrAdmin(notification.getUser(), currentUsername);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            notification.setTitle(request.getTitle());
        }
        if (request.getMessage() != null && !request.getMessage().isBlank()) {
            notification.setMessage(request.getMessage());
        }
        if (request.getNotificationType() != null && !request.getNotificationType().isBlank()) {
            notification.setNotificationType(request.getNotificationType());
        }
        if (request.getIsRead() != null) {
            notification.setIsRead(request.getIsRead());
        }

        Notification updated = notificationRepository.save(notification);
        log.info("Notification updated with ID {}", updated.getId());
        return NotificationResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteNotification(Long id, String currentUsername) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        validateOwnershipOrAdmin(notification.getUser(), currentUsername);
        notificationRepository.delete(notification);
        log.info("Notification deleted with ID {}", id);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long id, String currentUsername) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        validateOwnershipOrAdmin(notification.getUser(), currentUsername);

        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public NotificationResponse markAsUnread(Long id, String currentUsername) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        validateOwnershipOrAdmin(notification.getUser(), currentUsername);

        notification.setIsRead(false);
        Notification updated = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId, String currentUsername) {
        User targetUser = resolveTargetUser(userId, currentUsername);
        validateOwnershipOrAdmin(targetUser, currentUsername);
        notificationRepository.markAllAsRead(targetUser.getId());
        log.info("Marked all notifications as read for user ID {}", targetUser.getId());
    }

    @Override
    @Transactional
    public void deleteAllReadNotifications(Long userId, String currentUsername) {
        User targetUser = resolveTargetUser(userId, currentUsername);
        validateOwnershipOrAdmin(targetUser, currentUsername);
        notificationRepository.deleteAllReadByUserId(targetUser.getId());
        log.info("Deleted all read notifications for user ID {}", targetUser.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId, String currentUsername) {
        User targetUser = resolveTargetUser(userId, currentUsername);
        validateOwnershipOrAdmin(targetUser, currentUsername);
        return notificationRepository.countByUserIdAndIsReadFalse(targetUser.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> filterNotifications(Long userId, String type, Boolean isRead, Pageable pageable, String currentUsername) {
        Long resolvedUserId;
        if (userId != null) {
            User targetUser = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            validateOwnershipOrAdmin(targetUser, currentUsername);
            resolvedUserId = userId;
        } else {
            // Default to current user's notifications if non-admin
            User currentUser = getCurrentUser(currentUsername);
            if (!isAdminOrManager(currentUser)) {
                resolvedUserId = currentUser.getId();
            } else {
                resolvedUserId = null;
            }
        }

        return notificationRepository.filterNotifications(resolvedUserId, type, isRead, pageable)
                .map(NotificationResponse::fromEntity);
    }

    private User resolveTargetUser(Long userId, String currentUsername) {
        if (userId != null) {
            return userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        }
        return getCurrentUser(currentUsername);
    }

    private User getCurrentUser(String currentUsername) {
        if (currentUsername == null || currentUsername.isBlank()) {
            throw new BadRequestException("Current user not authenticated");
        }
        return userRepository.findByUsername(currentUsername)
                .or(() -> userRepository.findByEmail(currentUsername))
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUsername));
    }

    private void validateOwnershipOrAdmin(User targetUser, String currentUsername) {
        User currentUser = getCurrentUser(currentUsername);
        if (isAdminOrManager(currentUser)) {
            return;
        }
        if (!currentUser.getId().equals(targetUser.getId())) {
            throw new AccessDeniedException("You do not have permission to access another user's notifications");
        }
    }

    private boolean isAdminOrManager(User user) {
        if (user.getRoles() == null) {
            return false;
        }
        for (Role r : user.getRoles()) {
            if ("ROLE_ADMIN".equalsIgnoreCase(r.getName()) || "ROLE_MANAGER".equalsIgnoreCase(r.getName())) {
                return true;
            }
        }
        return false;
    }
}
