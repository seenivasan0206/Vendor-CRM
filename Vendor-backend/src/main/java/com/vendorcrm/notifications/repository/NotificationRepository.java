package com.vendorcrm.notifications.repository;

import com.vendorcrm.notifications.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserId(Long userId, Pageable pageable);

    Page<Notification> findByUserIdAndIsRead(Long userId, Boolean isRead, Pageable pageable);

    long countByUserIdAndIsReadFalse(Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsRead(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.id = :userId AND n.isRead = true")
    void deleteAllReadByUserId(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE " +
            "(:userId IS NULL OR n.user.id = :userId) AND " +
            "(:notificationType IS NULL OR n.notificationType = :notificationType) AND " +
            "(:isRead IS NULL OR n.isRead = :isRead)")
    Page<Notification> filterNotifications(
            @Param("userId") Long userId,
            @Param("notificationType") String notificationType,
            @Param("isRead") Boolean isRead,
            Pageable pageable);
}

