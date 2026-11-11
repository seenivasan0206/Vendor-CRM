package com.vendorcrm.invoices.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.vendorcrm.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_reference", length = 50, nullable = false, unique = true)
    private String paymentReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    @JsonBackReference
    private Invoice invoice;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "payment_method", length = 50, nullable = false)
    private String paymentMethod; // BANK_TRANSFER, CHECK, CREDIT_CARD, ACH, CASH

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Builder.Default
    @Column(length = 30, nullable = false)
    private String status = "COMPLETED"; // COMPLETED, PENDING, FAILED, REFUNDED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "recorded_by", length = 100)
    private String recordedBy;
}

