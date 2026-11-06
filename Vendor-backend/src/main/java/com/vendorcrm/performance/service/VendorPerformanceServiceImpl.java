package com.vendorcrm.performance.service;

import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.performance.dto.PerformanceSummaryResponse;
import com.vendorcrm.performance.dto.VendorPerformanceRequest;
import com.vendorcrm.performance.dto.VendorPerformanceResponse;
import com.vendorcrm.performance.entity.VendorPerformance;
import com.vendorcrm.performance.repository.VendorPerformanceRepository;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class VendorPerformanceServiceImpl implements VendorPerformanceService {

    private final VendorPerformanceRepository performanceRepository;
    private final VendorRepository vendorRepository;

    public VendorPerformanceServiceImpl(
            VendorPerformanceRepository performanceRepository,
            VendorRepository vendorRepository) {
        this.performanceRepository = performanceRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    @Transactional
    public VendorPerformanceResponse createReview(VendorPerformanceRequest request, String reviewedBy) {
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        VendorPerformance review = VendorPerformance.builder()
                .vendor(vendor)
                .reviewDate(request.getReviewDate())
                .reviewPeriod(request.getReviewPeriod())
                .qualityScore(request.getQualityScore())
                .deliveryScore(request.getDeliveryScore())
                .pricingScore(request.getPricingScore())
                .communicationScore(request.getCommunicationScore())
                .complianceScore(request.getComplianceScore())
                .comments(request.getComments())
                .reviewedBy(reviewedBy != null ? reviewedBy : "SYSTEM")
                .build();

        review.calculateOverallScore();
        VendorPerformance saved = performanceRepository.save(review);

        // Update vendor's overall rating
        updateVendorAverageRating(vendor);

        log.info("Created performance review for vendor id: {} with overall score: {}", vendor.getId(), saved.getOverallScore());
        return VendorPerformanceResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public VendorPerformanceResponse updateReview(Long id, VendorPerformanceRequest request, String reviewedBy) {
        VendorPerformance review = performanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VendorPerformance", "id", id));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        review.setVendor(vendor);
        review.setReviewDate(request.getReviewDate());
        review.setReviewPeriod(request.getReviewPeriod());
        review.setQualityScore(request.getQualityScore());
        review.setDeliveryScore(request.getDeliveryScore());
        review.setPricingScore(request.getPricingScore());
        review.setCommunicationScore(request.getCommunicationScore());
        review.setComplianceScore(request.getComplianceScore());
        review.setComments(request.getComments());
        if (reviewedBy != null) {
            review.setReviewedBy(reviewedBy);
        }

        review.calculateOverallScore();
        VendorPerformance updated = performanceRepository.save(review);

        updateVendorAverageRating(vendor);

        log.info("Updated performance review id: {} for vendor id: {}", id, vendor.getId());
        return VendorPerformanceResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public VendorPerformanceResponse getReviewById(Long id) {
        VendorPerformance review = performanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VendorPerformance", "id", id));
        return VendorPerformanceResponse.fromEntity(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendorPerformanceResponse> getReviewsByVendor(Long vendorId, Pageable pageable) {
        if (!vendorRepository.existsById(vendorId)) {
            throw new ResourceNotFoundException("Vendor", "id", vendorId);
        }
        return performanceRepository.findByVendorId(vendorId, pageable)
                .map(VendorPerformanceResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public PerformanceSummaryResponse getVendorPerformanceSummary(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", vendorId));

        List<VendorPerformance> reviews = performanceRepository.findByVendorId(vendorId);

        if (reviews.isEmpty()) {
            return PerformanceSummaryResponse.builder()
                    .vendorId(vendor.getId())
                    .vendorCompanyName(vendor.getCompanyName())
                    .vendorCode(vendor.getVendorCode())
                    .totalReviews(0)
                    .averageQualityScore(0.0)
                    .averageDeliveryScore(0.0)
                    .averagePricingScore(0.0)
                    .averageCommunicationScore(0.0)
                    .averageComplianceScore(0.0)
                    .averageOverallScore(0.0)
                    .currentVendorRating(vendor.getRating() != null ? vendor.getRating() : 0.0)
                    .build();
        }

        int count = reviews.size();
        double avgQuality = round(reviews.stream().mapToDouble(VendorPerformance::getQualityScore).average().orElse(0.0));
        double avgDelivery = round(reviews.stream().mapToDouble(VendorPerformance::getDeliveryScore).average().orElse(0.0));
        double avgPricing = round(reviews.stream().mapToDouble(VendorPerformance::getPricingScore).average().orElse(0.0));
        double avgCommunication = round(reviews.stream().mapToDouble(VendorPerformance::getCommunicationScore).average().orElse(0.0));
        double avgCompliance = round(reviews.stream().mapToDouble(VendorPerformance::getComplianceScore).average().orElse(0.0));
        double avgOverall = round(reviews.stream().mapToDouble(VendorPerformance::getOverallScore).average().orElse(0.0));

        return PerformanceSummaryResponse.builder()
                .vendorId(vendor.getId())
                .vendorCompanyName(vendor.getCompanyName())
                .vendorCode(vendor.getVendorCode())
                .totalReviews(count)
                .averageQualityScore(avgQuality)
                .averageDeliveryScore(avgDelivery)
                .averagePricingScore(avgPricing)
                .averageCommunicationScore(avgCommunication)
                .averageComplianceScore(avgCompliance)
                .averageOverallScore(avgOverall)
                .currentVendorRating(vendor.getRating() != null ? vendor.getRating() : 0.0)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendorPerformanceResponse> getAllReviews(Pageable pageable) {
        return performanceRepository.findAll(pageable).map(VendorPerformanceResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendorPerformanceResponse> getReviewsByPeriod(String reviewPeriod) {
        return performanceRepository.findByReviewPeriod(reviewPeriod).stream()
                .map(VendorPerformanceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Double syncVendorRating(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", vendorId));

        return updateVendorAverageRating(vendor);
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        VendorPerformance review = performanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VendorPerformance", "id", id));

        Vendor vendor = review.getVendor();
        performanceRepository.delete(review);

        if (vendor != null) {
            updateVendorAverageRating(vendor);
        }

        log.info("Deleted performance review with id: {}", id);
    }

    private Double updateVendorAverageRating(Vendor vendor) {
        List<VendorPerformance> reviews = performanceRepository.findByVendorId(vendor.getId());
        double avgRating = 0.0;
        if (!reviews.isEmpty()) {
            double avg = reviews.stream()
                    .mapToDouble(VendorPerformance::getOverallScore)
                    .average()
                    .orElse(0.0);
            avgRating = round(avg);
        }

        vendor.setRating(avgRating);
        vendorRepository.save(vendor);
        log.info("Synchronized rating for vendor id: {} to {}", vendor.getId(), avgRating);
        return avgRating;
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}

