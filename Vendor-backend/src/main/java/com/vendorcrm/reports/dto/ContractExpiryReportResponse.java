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
public class ContractExpiryReportResponse {
    private int daysThreshold;
    private long expiringCount;
    private BigDecimal expiringTotalValue;
    private List<ExpiringContractItem> expiringContracts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpiringContractItem {
        private Long contractId;
        private String contractNumber;
        private String title;
        private Long vendorId;
        private String vendorName;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal contractValue;
        private long daysRemaining;
        private Boolean autoRenew;
        private String status;
    }
}

