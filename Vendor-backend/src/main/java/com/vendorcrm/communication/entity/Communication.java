package com.vendorcrm.communication.entity;

import com.vendorcrm.common.BaseEntity;
import com.vendorcrm.vendors.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_communications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Communication extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(length = 200, nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "communication_type", length = 30, nullable = false)
    private String communicationType; // EMAIL, PHONE, MEETING, MESSAGE

    @Column(name = "communication_date", nullable = false)
    private LocalDateTime communicationDate;

    @Builder.Default
    @Column(name = "communication_status", length = 30, nullable = false)
    private String communicationStatus = "PENDING"; // PENDING, COMPLETED, CANCELLED

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(columnDefinition = "TEXT")
    private String remarks;
}

