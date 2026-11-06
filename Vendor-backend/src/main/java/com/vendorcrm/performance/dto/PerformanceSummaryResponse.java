package com.vendorcrm.performance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceSummaryResponse {

    private Long vendorId;
    private String vendorCompanyName;
    private String vendorCode;
    private Integer totalReviews;
    private Double averageQualityScore;
    private Double averageDeliveryScore;
    private Double averagePricingScore;
    private Double averageCommunicationScore;
    private Double averageComplianceScore;
    private Double averageOverallScore;
    private Double currentVendorRating;
}

