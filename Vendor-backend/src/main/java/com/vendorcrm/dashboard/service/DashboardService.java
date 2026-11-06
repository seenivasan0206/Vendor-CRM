package com.vendorcrm.dashboard.service;

import com.vendorcrm.dashboard.dto.*;

import java.util.List;

public interface DashboardService {

    OverallDashboardStatsResponse getOverallStats();

    DashboardVendorStatsResponse getVendorStats();

    DashboardPOStatsResponse getPurchaseOrderStats();

    DashboardContractStatsResponse getContractStats();

    DashboardMonthlyStatsResponse getMonthlyPOStats(Integer year);

    List<RecentVendorItem> getRecentVendors(int limit);

    List<RecentPOItem> getRecentPurchaseOrders(int limit);

    List<RecentContractItem> getRecentContracts(int limit);

    List<RecentPOItem> getPendingPurchaseOrders(int limit);

    List<RecentContractItem> getUpcomingContractExpirations(int days, int limit);
}

