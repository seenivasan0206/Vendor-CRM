package com.vendorcrm.contracts.entity;

import com.vendorcrm.common.BaseEntity;
import com.vendorcrm.vendors.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_number", length = 50, nullable = false, unique = true)
    private String contractNumber;

    @Column(length = 150, nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Builder.Default
    @Column(name = "contract_value", precision = 14, scale = 2, nullable = false)
    private BigDecimal contractValue = BigDecimal.ZERO;

    @Builder.Default
    @Column(length = 30, nullable = false)
    private String status = "ACTIVE"; // DRAFT, ACTIVE, EXPIRED, TERMINATED, RENEWED

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Builder.Default
    @Column(name = "auto_renew")
    private Boolean autoRenew = false;

    @Builder.Default
    @Column(name = "renewal_notice_days")
    private Integer renewalNoticeDays = 30;
}

