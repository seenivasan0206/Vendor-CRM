package com.vendorcrm.dashboard.dto;

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
public class DashboardMonthlyStatsResponse {
    private int year;
    private List<MonthlyDataPoint> points;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyDataPoint {
        private int month;
        private String monthName;
        private long orderCount;
        private BigDecimal totalValue;
    }
}

