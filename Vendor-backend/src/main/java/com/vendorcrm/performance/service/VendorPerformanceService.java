package com.vendorcrm.performance.service;

import com.vendorcrm.performance.dto.PerformanceSummaryResponse;
import com.vendorcrm.performance.dto.VendorPerformanceRequest;
import com.vendorcrm.performance.dto.VendorPerformanceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VendorPerformanceService {

    VendorPerformanceResponse createReview(VendorPerformanceRequest request, String reviewedBy);

    VendorPerformanceResponse updateReview(Long id, VendorPerformanceRequest request, String reviewedBy);

    VendorPerformanceResponse getReviewById(Long id);

    Page<VendorPerformanceResponse> getReviewsByVendor(Long vendorId, Pageable pageable);

    PerformanceSummaryResponse getVendorPerformanceSummary(Long vendorId);

    Page<VendorPerformanceResponse> getAllReviews(Pageable pageable);

    List<VendorPerformanceResponse> getReviewsByPeriod(String reviewPeriod);

    Double syncVendorRating(Long vendorId);

    void deleteReview(Long id);
}

