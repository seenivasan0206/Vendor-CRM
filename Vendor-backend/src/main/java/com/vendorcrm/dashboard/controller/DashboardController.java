package com.vendorcrm.dashboard.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.dashboard.dto.*;
import com.vendorcrm.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<OverallDashboardStatsResponse>> getOverallStats() {
        OverallDashboardStatsResponse response = dashboardService.getOverallStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved successfully", response));
    }

    @GetMapping("/vendor-stats")
    public ResponseEntity<ApiResponse<DashboardVendorStatsResponse>> getVendorStats() {
        DashboardVendorStatsResponse response = dashboardService.getVendorStats();
        return ResponseEntity.ok(ApiResponse.success("Vendor statistics retrieved successfully", response));
    }

    @GetMapping("/purchase-order-stats")
    public ResponseEntity<ApiResponse<DashboardPOStatsResponse>> getPurchaseOrderStats() {
        DashboardPOStatsResponse response = dashboardService.getPurchaseOrderStats();
        return ResponseEntity.ok(ApiResponse.success("Purchase order statistics retrieved successfully", response));
    }

    @GetMapping("/contract-stats")
    public ResponseEntity<ApiResponse<DashboardContractStatsResponse>> getContractStats() {
        DashboardContractStatsResponse response = dashboardService.getContractStats();
        return ResponseEntity.ok(ApiResponse.success("Contract statistics retrieved successfully", response));
    }

    @GetMapping("/monthly-po-stats")
    public ResponseEntity<ApiResponse<DashboardMonthlyStatsResponse>> getMonthlyPOStats(
            @RequestParam(required = false) Integer year) {
        DashboardMonthlyStatsResponse response = dashboardService.getMonthlyPOStats(year);
        return ResponseEntity.ok(ApiResponse.success("Monthly purchase order statistics retrieved", response));
    }

    @GetMapping("/recent-vendors")
    public ResponseEntity<ApiResponse<List<RecentVendorItem>>> getRecentVendors(
            @RequestParam(required = false, defaultValue = "5") int limit) {
        List<RecentVendorItem> response = dashboardService.getRecentVendors(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent vendors retrieved successfully", response));
    }

    @GetMapping("/recent-purchase-orders")
    public ResponseEntity<ApiResponse<List<RecentPOItem>>> getRecentPurchaseOrders(
            @RequestParam(required = false, defaultValue = "5") int limit) {
        List<RecentPOItem> response = dashboardService.getRecentPurchaseOrders(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent purchase orders retrieved successfully", response));
    }

    @GetMapping("/recent-contracts")
    public ResponseEntity<ApiResponse<List<RecentContractItem>>> getRecentContracts(
            @RequestParam(required = false, defaultValue = "5") int limit) {
        List<RecentContractItem> response = dashboardService.getRecentContracts(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent contracts retrieved successfully", response));
    }

    @GetMapping("/pending-purchase-orders")
    public ResponseEntity<ApiResponse<List<RecentPOItem>>> getPendingPurchaseOrders(
            @RequestParam(required = false, defaultValue = "10") int limit) {
        List<RecentPOItem> response = dashboardService.getPendingPurchaseOrders(limit);
        return ResponseEntity.ok(ApiResponse.success("Pending purchase orders retrieved successfully", response));
    }

    @GetMapping("/upcoming-contract-expirations")
    public ResponseEntity<ApiResponse<List<RecentContractItem>>> getUpcomingContractExpirations(
            @RequestParam(required = false, defaultValue = "30") int days,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        List<RecentContractItem> response = dashboardService.getUpcomingContractExpirations(days, limit);
        return ResponseEntity.ok(ApiResponse.success("Upcoming contract expirations retrieved", response));
    }
}

