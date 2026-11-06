package com.vendorcrm.communication.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.communication.dto.CommunicationRequest;
import com.vendorcrm.communication.dto.CommunicationResponse;
import com.vendorcrm.communication.dto.CommunicationStatusRequest;
import com.vendorcrm.communication.service.CommunicationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communications")
public class CommunicationController {

    private final CommunicationService communicationService;

    public CommunicationController(CommunicationService communicationService) {
        this.communicationService = communicationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<CommunicationResponse>> createCommunication(
            @Valid @RequestBody CommunicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "system";
        CommunicationResponse response = communicationService.createCommunication(request, username);
        return new ResponseEntity<>(ApiResponse.success("Communication created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommunicationResponse>> getCommunicationById(@PathVariable Long id) {
        CommunicationResponse response = communicationService.getCommunicationById(id);
        return ResponseEntity.ok(ApiResponse.success("Communication retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommunicationResponse>>> getAllCommunications(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CommunicationResponse> response = communicationService.getAllCommunications(pageable);
        return ResponseEntity.ok(ApiResponse.success("Communications retrieved successfully", response));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<Page<CommunicationResponse>>> getCommunicationsByVendor(
            @PathVariable Long vendorId,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CommunicationResponse> response = communicationService.getCommunicationsByVendor(vendorId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Communications retrieved by vendor", response));
    }

    @GetMapping("/vendor/{vendorId}/history")
    public ResponseEntity<ApiResponse<List<CommunicationResponse>>> getCommunicationHistoryByVendor(@PathVariable Long vendorId) {
        List<CommunicationResponse> response = communicationService.getCommunicationHistoryByVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Vendor communication history retrieved", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<CommunicationResponse>> updateCommunication(
            @PathVariable Long id,
            @Valid @RequestBody CommunicationRequest request) {
        CommunicationResponse response = communicationService.updateCommunication(id, request);
        return ResponseEntity.ok(ApiResponse.success("Communication updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteCommunication(@PathVariable Long id) {
        communicationService.deleteCommunication(id);
        return ResponseEntity.ok(ApiResponse.success("Communication deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<CommunicationResponse>>> searchCommunications(
            @RequestParam String query,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CommunicationResponse> response = communicationService.searchCommunications(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Communication search results", response));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Page<CommunicationResponse>>> filterCommunications(
            @RequestParam(required = false) Long vendorId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CommunicationResponse> response = communicationService.filterCommunications(vendorId, type, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Filtered communications retrieved", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<CommunicationResponse>> updateCommunicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody CommunicationStatusRequest request) {
        CommunicationResponse response = communicationService.updateCommunicationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Communication status updated successfully", response));
    }
}

