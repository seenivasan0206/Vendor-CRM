package com.vendorcrm.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyPurchaseReportResponse {
    private int year;
    private long totalOrdersForYear;
    private BigDecimal totalSpendForYear;
    private List<MonthlyStatItem> monthlyBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyStatItem {
        private int month;
        private String monthName;
        private long orderCount;
        private BigDecimal totalAmount;
    }
}

