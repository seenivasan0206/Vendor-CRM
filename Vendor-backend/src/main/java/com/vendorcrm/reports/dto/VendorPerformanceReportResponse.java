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
public class VendorPerformanceReportResponse {
    private long totalVendorsEvaluated;
    private double averageSystemRating;
    private List<VendorPerformanceItem> vendorPerformances;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VendorPerformanceItem {
        private Long vendorId;
        private String vendorCode;
        private String companyName;
        private String status;
        private Double rating;
        private long totalPurchaseOrders;
        private BigDecimal totalSpend;
        private long activeContracts;
        private BigDecimal totalContractValue;
    }
}

