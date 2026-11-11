package com.vendorcrm.notifications.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.notifications.dto.NotificationRequest;
import com.vendorcrm.notifications.dto.NotificationResponse;
import com.vendorcrm.notifications.dto.NotificationUpdateRequest;
import com.vendorcrm.notifications.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @Valid @RequestBody NotificationRequest request) {
        NotificationResponse response = notificationService.createNotification(request);
        return new ResponseEntity<>(ApiResponse.success("Notification created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getAllNotifications(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NotificationResponse> response = notificationService.getAllNotifications(pageable);
        return ResponseEntity.ok(ApiResponse.success("All notifications retrieved", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NotificationResponse> response = notificationService.getMyNotifications(pageable, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("My notifications retrieved", response));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotificationsByUserId(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NotificationResponse> response = notificationService.getNotificationsByUserId(userId, pageable, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User notifications retrieved", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        NotificationResponse response = notificationService.getNotificationById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notification retrieved successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> updateNotification(
            @PathVariable Long id,
            @Valid @RequestBody NotificationUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        NotificationResponse response = notificationService.updateNotification(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notification updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteNotification(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully", null));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        NotificationResponse response = notificationService.markAsRead(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", response));
    }

    @PatchMapping("/{id}/unread")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsUnread(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        NotificationResponse response = notificationService.markAsUnread(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as unread", response));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllMyNotificationsAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllAsRead(null, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsReadForUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllAsRead(userId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User notifications marked as read", null));
    }

    @DeleteMapping("/read")
    public ResponseEntity<ApiResponse<Void>> deleteAllMyReadNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteAllReadNotifications(null, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All read notifications deleted", null));
    }

    @DeleteMapping("/user/{userId}/read")
    public ResponseEntity<ApiResponse<Void>> deleteAllReadNotificationsForUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteAllReadNotifications(userId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All read notifications deleted for user", null));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getMyUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(null, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Unread notification count retrieved", count));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCountByUserId(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(userId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User unread notification count retrieved", count));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> filterNotifications(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean isRead,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NotificationResponse> response = notificationService.filterNotifications(
                userId, type, isRead, pageable, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Filtered notifications retrieved", response));
    }
}

