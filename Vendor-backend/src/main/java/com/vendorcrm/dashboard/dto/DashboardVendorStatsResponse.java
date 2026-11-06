package com.vendorcrm.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardVendorStatsResponse {
    private long totalVendors;
    private long activeVendors;
    private long inactiveVendors;
    private long pendingApprovalVendors;
    private long blockedVendors;
    private double averageRating;
}

