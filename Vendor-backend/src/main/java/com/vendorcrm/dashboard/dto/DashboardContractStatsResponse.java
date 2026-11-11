package com.vendorcrm.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardContractStatsResponse {
    private long totalContracts;
    private long activeContracts;
    private long expiredContracts;
    private long terminatedContracts;
    private long draftContracts;
    private long expiringSoon;
    private BigDecimal totalContractValue;
    private BigDecimal activeContractValue;
}

