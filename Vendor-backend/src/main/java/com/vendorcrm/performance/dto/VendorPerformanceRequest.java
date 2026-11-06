package com.vendorcrm.performance.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorPerformanceRequest {

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotNull(message = "Review date is required")
    private LocalDate reviewDate;

    @NotBlank(message = "Review period is required (e.g. Q1 2026, 2026-M03, Annual 2025)")
    @Size(max = 50, message = "Review period cannot exceed 50 characters")
    private String reviewPeriod;

    @NotNull(message = "Quality score is required")
    @DecimalMin(value = "1.0", message = "Quality score must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Quality score cannot exceed 5.0")
    private Double qualityScore;

    @NotNull(message = "Delivery score is required")
    @DecimalMin(value = "1.0", message = "Delivery score must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Delivery score cannot exceed 5.0")
    private Double deliveryScore;

    @NotNull(message = "Pricing score is required")
    @DecimalMin(value = "1.0", message = "Pricing score must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Pricing score cannot exceed 5.0")
    private Double pricingScore;

    @NotNull(message = "Communication score is required")
    @DecimalMin(value = "1.0", message = "Communication score must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Communication score cannot exceed 5.0")
    private Double communicationScore;

    @NotNull(message = "Compliance score is required")
    @DecimalMin(value = "1.0", message = "Compliance score must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Compliance score cannot exceed 5.0")
    private Double complianceScore;

    private String comments;
}

