package com.vendorcrm.invoices.dto;

import com.vendorcrm.invoices.entity.Invoice;
import com.vendorcrm.invoices.entity.InvoiceItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {

    private Long id;
    private String invoiceNumber;
    private Long vendorId;
    private String vendorCompanyName;
    private String vendorCode;
    private Long purchaseOrderId;
    private String purchaseOrderNumber;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal remainingBalance;
    private String status;
    private String paymentTerms;
    private String notes;
    private List<ItemResponse> items;
    private List<PaymentResponse> payments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemResponse {
        private Long id;
        private Long productId;
        private String productSku;
        private String productName;
        private String description;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal taxRate;
        private BigDecimal totalPrice;

        public static ItemResponse fromEntity(InvoiceItem item) {
            return ItemResponse.builder()
                    .id(item.getId())
                    .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                    .productSku(item.getProduct() != null ? item.getProduct().getSku() : null)
                    .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                    .description(item.getDescription())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .taxRate(item.getTaxRate())
                    .totalPrice(item.getTotalPrice())
                    .build();
        }
    }

    public static InvoiceResponse fromEntity(Invoice invoice) {
        List<ItemResponse> items = invoice.getItems() != null
                ? invoice.getItems().stream().map(ItemResponse::fromEntity).collect(Collectors.toList())
                : Collections.emptyList();

        List<PaymentResponse> payments = invoice.getPayments() != null
                ? invoice.getPayments().stream().map(PaymentResponse::fromEntity).collect(Collectors.toList())
                : Collections.emptyList();

        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .vendorId(invoice.getVendor() != null ? invoice.getVendor().getId() : null)
                .vendorCompanyName(invoice.getVendor() != null ? invoice.getVendor().getCompanyName() : null)
                .vendorCode(invoice.getVendor() != null ? invoice.getVendor().getVendorCode() : null)
                .purchaseOrderId(invoice.getPurchaseOrder() != null ? invoice.getPurchaseOrder().getId() : null)
                .purchaseOrderNumber(invoice.getPurchaseOrder() != null ? invoice.getPurchaseOrder().getOrderNumber() : null)
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .subtotal(invoice.getSubtotal())
                .taxAmount(invoice.getTaxAmount())
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .remainingBalance(invoice.getRemainingBalance())
                .status(invoice.getStatus())
                .paymentTerms(invoice.getPaymentTerms())
                .notes(invoice.getNotes())
                .items(items)
                .payments(payments)
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .build();
    }
}

