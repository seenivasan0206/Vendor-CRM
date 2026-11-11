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
public class ContractSummaryReportResponse {
    private long totalContracts;
    private long activeContracts;
    private long expiredContracts;
    private long terminatedContracts;
    private long draftContracts;
    private long renewedContracts;
    private long autoRenewContracts;
    private BigDecimal totalContractValue;
    private BigDecimal activeContractValue;
    private Map<String, Long> contractsByStatus;
}

