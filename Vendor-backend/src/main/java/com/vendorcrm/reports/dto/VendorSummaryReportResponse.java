package com.vendorcrm.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorSummaryReportResponse {
    private long totalVendors;
    private long activeVendors;
    private long inactiveVendors;
    private long pendingApprovalVendors;
    private long blockedVendors;
    private double averageRating;
    private Map<String, Long> vendorsByCountry;
}

