package com.vendorcrm.notifications.service;

import com.vendorcrm.notifications.dto.NotificationRequest;
import com.vendorcrm.notifications.dto.NotificationResponse;
import com.vendorcrm.notifications.dto.NotificationUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    NotificationResponse getNotificationById(Long id, String currentUsername);

    Page<NotificationResponse> getAllNotifications(Pageable pageable);

    Page<NotificationResponse> getNotificationsByUserId(Long userId, Pageable pageable, String currentUsername);

    Page<NotificationResponse> getMyNotifications(Pageable pageable, String currentUsername);

    NotificationResponse updateNotification(Long id, NotificationUpdateRequest request, String currentUsername);

    void deleteNotification(Long id, String currentUsername);

    NotificationResponse markAsRead(Long id, String currentUsername);

    NotificationResponse markAsUnread(Long id, String currentUsername);

    void markAllAsRead(Long userId, String currentUsername);

    void deleteAllReadNotifications(Long userId, String currentUsername);

    long getUnreadCount(Long userId, String currentUsername);

    Page<NotificationResponse> filterNotifications(Long userId, String type, Boolean isRead, Pageable pageable, String currentUsername);
}

