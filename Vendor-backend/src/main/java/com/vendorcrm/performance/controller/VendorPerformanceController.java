package com.vendorcrm.performance.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.performance.dto.PerformanceSummaryResponse;
import com.vendorcrm.performance.dto.VendorPerformanceRequest;
import com.vendorcrm.performance.dto.VendorPerformanceResponse;
import com.vendorcrm.performance.service.VendorPerformanceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/vendor-performance")
public class VendorPerformanceController {

    private final VendorPerformanceService performanceService;

    public VendorPerformanceController(VendorPerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VendorPerformanceResponse>> createReview(
            @Valid @RequestBody VendorPerformanceRequest request,
            Principal principal) {
        String reviewedBy = principal != null ? principal.getName() : "ADMIN";
        VendorPerformanceResponse response = performanceService.createReview(request, reviewedBy);
        return new ResponseEntity<>(ApiResponse.success("Performance review recorded successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VendorPerformanceResponse>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody VendorPerformanceRequest request,
            Principal principal) {
        String reviewedBy = principal != null ? principal.getName() : "ADMIN";
        VendorPerformanceResponse response = performanceService.updateReview(id, request, reviewedBy);
        return ResponseEntity.ok(ApiResponse.success("Performance review updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorPerformanceResponse>> getReviewById(@PathVariable Long id) {
        VendorPerformanceResponse response = performanceService.getReviewById(id);
        return ResponseEntity.ok(ApiResponse.success("Performance review retrieved successfully", response));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<Page<VendorPerformanceResponse>>> getReviewsByVendor(
            @PathVariable Long vendorId,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VendorPerformanceResponse> response = performanceService.getReviewsByVendor(vendorId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Vendor performance reviews retrieved successfully", response));
    }

    @GetMapping("/vendor/{vendorId}/summary")
    public ResponseEntity<ApiResponse<PerformanceSummaryResponse>> getVendorPerformanceSummary(@PathVariable Long vendorId) {
        PerformanceSummaryResponse response = performanceService.getVendorPerformanceSummary(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Vendor performance summary retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VendorPerformanceResponse>>> getAllReviews(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "reviewDate") String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VendorPerformanceResponse> response = performanceService.getAllReviews(pageable);
        return ResponseEntity.ok(ApiResponse.success("Performance reviews retrieved successfully", response));
    }

    @GetMapping("/period")
    public ResponseEntity<ApiResponse<List<VendorPerformanceResponse>>> getReviewsByPeriod(@RequestParam String reviewPeriod) {
        List<VendorPerformanceResponse> response = performanceService.getReviewsByPeriod(reviewPeriod);
        return ResponseEntity.ok(ApiResponse.success("Performance reviews retrieved for period", response));
    }

    @PostMapping("/vendor/{vendorId}/sync-rating")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Double>> syncVendorRating(@PathVariable Long vendorId) {
        Double updatedRating = performanceService.syncVendorRating(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Vendor rating synchronized successfully", updatedRating));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        performanceService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Performance review deleted successfully", null));
    }
}

