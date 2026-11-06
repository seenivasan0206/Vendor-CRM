package com.vendorcrm.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverallDashboardStatsResponse {
    private DashboardVendorStatsResponse vendorStats;
    private DashboardPOStatsResponse purchaseOrderStats;
    private DashboardContractStatsResponse contractStats;
}

