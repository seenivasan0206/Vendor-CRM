package com.vendorcrm.performance.entity;

import com.vendorcrm.common.BaseEntity;
import com.vendorcrm.vendors.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Entity
@Table(name = "vendor_performance_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorPerformance extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "review_date", nullable = false)
    private LocalDate reviewDate;

    @Column(name = "review_period", length = 50, nullable = false)
    private String reviewPeriod;

    @Column(name = "quality_score", nullable = false)
    private Double qualityScore; // 1.0 - 5.0

    @Column(name = "delivery_score", nullable = false)
    private Double deliveryScore; // 1.0 - 5.0

    @Column(name = "pricing_score", nullable = false)
    private Double pricingScore; // 1.0 - 5.0

    @Column(name = "communication_score", nullable = false)
    private Double communicationScore; // 1.0 - 5.0

    @Column(name = "compliance_score", nullable = false)
    private Double complianceScore; // 1.0 - 5.0

    @Column(name = "overall_score", nullable = false)
    private Double overallScore; // Calculated average

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    public void calculateOverallScore() {
        double sum = (qualityScore != null ? qualityScore : 0.0)
                + (deliveryScore != null ? deliveryScore : 0.0)
                + (pricingScore != null ? pricingScore : 0.0)
                + (communicationScore != null ? communicationScore : 0.0)
                + (complianceScore != null ? complianceScore : 0.0);
        double avg = sum / 5.0;
        this.overallScore = BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}

