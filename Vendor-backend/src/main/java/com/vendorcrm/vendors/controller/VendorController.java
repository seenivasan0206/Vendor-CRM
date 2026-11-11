package com.vendorcrm.vendors.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.vendors.dto.VendorRequest;
import com.vendorcrm.vendors.dto.VendorResponse;
import com.vendorcrm.vendors.dto.VendorStatusRequest;
import com.vendorcrm.vendors.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VendorResponse>> createVendor(@Valid @RequestBody VendorRequest request) {
        VendorResponse response = vendorService.createVendor(request);
        return new ResponseEntity<>(ApiResponse.success("Vendor created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request) {
        VendorResponse response = vendorService.updateVendor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vendor updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(@PathVariable Long id) {
        VendorResponse response = vendorService.getVendorById(id);
        return ResponseEntity.ok(ApiResponse.success("Vendor retrieved successfully", response));
    }

    @GetMapping("/code/{vendorCode}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorByCode(@PathVariable String vendorCode) {
        VendorResponse response = vendorService.getVendorByCode(vendorCode);
        return ResponseEntity.ok(ApiResponse.success("Vendor retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getAllVendors(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VendorResponse> response = vendorService.getAllVendors(pageable);
        return ResponseEntity.ok(ApiResponse.success("Vendors retrieved successfully", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> searchVendors(
            @RequestParam String query,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<VendorResponse> response = vendorService.searchVendors(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Vendors search results", response));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<VendorResponse>>> getVendorsByStatus(@PathVariable String status) {
        List<VendorResponse> response = vendorService.getVendorsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Vendors retrieved by status", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendorStatus(
            @PathVariable Long id,
            @Valid @RequestBody VendorStatusRequest request) {
        VendorResponse response = vendorService.updateVendorStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vendor status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok(ApiResponse.success("Vendor deleted successfully", null));
    }       
}    
    
        