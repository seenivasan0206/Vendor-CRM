package com.vendorcrm.performance.dto;

import com.vendorcrm.performance.entity.VendorPerformance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorPerformanceResponse {

    private Long id;
    private Long vendorId;
    private String vendorCompanyName;
    private String vendorCode;
    private LocalDate reviewDate;
    private String reviewPeriod;
    private Double qualityScore;
    private Double deliveryScore;
    private Double pricingScore;
    private Double communicationScore;
    private Double complianceScore;
    private Double overallScore;
    private String comments;
    private String reviewedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static VendorPerformanceResponse fromEntity(VendorPerformance vp) {
        return VendorPerformanceResponse.builder()
                .id(vp.getId())
                .vendorId(vp.getVendor() != null ? vp.getVendor().getId() : null)
                .vendorCompanyName(vp.getVendor() != null ? vp.getVendor().getCompanyName() : null)
                .vendorCode(vp.getVendor() != null ? vp.getVendor().getVendorCode() : null)
                .reviewDate(vp.getReviewDate())
                .reviewPeriod(vp.getReviewPeriod())
                .qualityScore(vp.getQualityScore())
                .deliveryScore(vp.getDeliveryScore())
                .pricingScore(vp.getPricingScore())
                .communicationScore(vp.getCommunicationScore())
                .complianceScore(vp.getComplianceScore())
                .overallScore(vp.getOverallScore())
                .comments(vp.getComments())
                .reviewedBy(vp.getReviewedBy())
                .createdAt(vp.getCreatedAt())
                .updatedAt(vp.getUpdatedAt())
                .build();
    }
}

