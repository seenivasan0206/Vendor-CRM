package com.vendorcrm.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderStatusReportResponse {
    private long totalOrders;
    private BigDecimal overallTotalValue;
    private Map<String, StatusBreakdown> breakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusBreakdown {
        private long count;
        private BigDecimal totalValue;
        private double percentage;
    }
}

