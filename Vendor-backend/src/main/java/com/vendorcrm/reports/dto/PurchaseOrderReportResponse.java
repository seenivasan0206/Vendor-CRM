package com.vendorcrm.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderReportResponse {
    private long totalOrders;
    private BigDecimal totalAmount;
    private BigDecimal totalTax;
    private BigDecimal grandTotal;
    private List<PurchaseOrderReportItem> orders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseOrderReportItem {
        private Long id;
        private String orderNumber;
        private Long vendorId;
        private String vendorName;
        private LocalDate orderDate;
        private LocalDate expectedDeliveryDate;
        private BigDecimal totalAmount;
        private BigDecimal taxAmount;
        private BigDecimal grandTotal;
        private String status;
        private int totalItems;
    }
}

