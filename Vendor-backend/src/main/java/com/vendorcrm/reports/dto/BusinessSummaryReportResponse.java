package com.vendorcrm.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSummaryReportResponse {
    // Vendor Summary
    private long totalVendors;
    private long activeVendors;
    private long inactiveVendors;
    private double averageVendorRating;

    // PO Summary
    private long totalPurchaseOrders;
    private long pendingPurchaseOrders;
    private long approvedPurchaseOrders;
    private long rejectedPurchaseOrders;
    private BigDecimal totalPOValue;

    // Contract Summary
    private long totalContracts;
    private long activeContracts;
    private long expiredContracts;
    private long expiringSoonContracts;
    private BigDecimal totalContractValue;
    private BigDecimal activeContractValue;
}

