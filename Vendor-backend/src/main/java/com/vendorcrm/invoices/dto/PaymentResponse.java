package com.vendorcrm.invoices.dto;

import com.vendorcrm.invoices.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private String paymentReference;
    private Long invoiceId;
    private String invoiceNumber;
    private Long vendorId;
    private String vendorCompanyName;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String transactionReference;
    private String status;
    private String notes;
    private String recordedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PaymentResponse fromEntity(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentReference(payment.getPaymentReference())
                .invoiceId(payment.getInvoice() != null ? payment.getInvoice().getId() : null)
                .invoiceNumber(payment.getInvoice() != null ? payment.getInvoice().getInvoiceNumber() : null)
                .vendorId(payment.getInvoice() != null && payment.getInvoice().getVendor() != null ? payment.getInvoice().getVendor().getId() : null)
                .vendorCompanyName(payment.getInvoice() != null && payment.getInvoice().getVendor() != null ? payment.getInvoice().getVendor().getCompanyName() : null)
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .transactionReference(payment.getTransactionReference())
                .status(payment.getStatus())
                .notes(payment.getNotes())
                .recordedBy(payment.getRecordedBy())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}

