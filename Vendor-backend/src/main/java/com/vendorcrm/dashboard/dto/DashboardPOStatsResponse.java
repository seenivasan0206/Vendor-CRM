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
public class DashboardPOStatsResponse {
    private long totalOrders;
    private long pendingOrders;
    private long approvedOrders;
    private long issuedOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private BigDecimal totalOrderValue;
}

