package com.vendorcrm.notifications;

import com.vendorcrm.auth.entity.Role;
import com.vendorcrm.auth.entity.User;
import com.vendorcrm.auth.repository.UserRepository;
import com.vendorcrm.notifications.dto.NotificationRequest;
import com.vendorcrm.notifications.dto.NotificationResponse;
import com.vendorcrm.notifications.entity.Notification;
import com.vendorcrm.notifications.repository.NotificationRepository;
import com.vendorcrm.notifications.service.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User user1;
    private User user2;
    private User adminUser;
    private Notification notification1;

    @BeforeEach
    void setUp() {
        Role staffRole = Role.builder().id(1L).name("ROLE_STAFF").build();
        Role adminRole = Role.builder().id(2L).name("ROLE_ADMIN").build();

        user1 = User.builder()
                .id(1L)
                .username("john")
                .email("john@test.com")
                .roles(Set.of(staffRole))
                .build();

        user2 = User.builder()
                .id(2L)
                .username("jane")
                .email("jane@test.com")
                .roles(Set.of(staffRole))
                .build();

        adminUser = User.builder()
                .id(99L)
                .username("admin")
                .email("admin@test.com")
                .roles(Set.of(adminRole))
                .build();

        notification1 = Notification.builder()
                .id(100L)
                .user(user1)
                .title("New PO Assigned")
                .message("You have a new purchase order pending.")
                .notificationType("PURCHASE_ORDER")
                .isRead(false)
                .build();
    }

    @Test
    void testCreateNotification_Success() {
        NotificationRequest request = NotificationRequest.builder()
                .userId(1L)
                .title("New PO Assigned")
                .message("You have a new purchase order pending.")
                .notificationType("PURCHASE_ORDER")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification1);

        NotificationResponse response = notificationService.createNotification(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("john", response.getUsername());
        assertFalse(response.getIsRead());
    }

    @Test
    void testGetNotificationById_OwnerAccess_Success() {
        when(notificationRepository.findById(100L)).thenReturn(Optional.of(notification1));
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user1));

        NotificationResponse response = notificationService.getNotificationById(100L, "john");

        assertNotNull(response);
        assertEquals("New PO Assigned", response.getTitle());
    }

    @Test
    void testGetNotificationById_UnauthorizedUser_ThrowsAccessDenied() {
        when(notificationRepository.findById(100L)).thenReturn(Optional.of(notification1));
        when(userRepository.findByUsername("jane")).thenReturn(Optional.of(user2));

        assertThrows(AccessDeniedException.class, () ->
                notificationService.getNotificationById(100L, "jane"));
    }

    @Test
    void testGetNotificationById_AdminAccess_Success() {
        when(notificationRepository.findById(100L)).thenReturn(Optional.of(notification1));
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));

        NotificationResponse response = notificationService.getNotificationById(100L, "admin");

        assertNotNull(response);
        assertEquals("New PO Assigned", response.getTitle());
    }

    @Test
    void testMarkAsRead_Success() {
        when(notificationRepository.findById(100L)).thenReturn(Optional.of(notification1));
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user1));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification1);

        NotificationResponse response = notificationService.markAsRead(100L, "john");

        assertNotNull(response);
        assertTrue(notification1.getIsRead());
    }
}

