package com.vendorcrm.contracts.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.contracts.dto.ContractRenewalRequest;
import com.vendorcrm.contracts.dto.ContractRequest;
import com.vendorcrm.contracts.dto.ContractResponse;
import com.vendorcrm.contracts.service.ContractService;
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
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ContractResponse>> createContract(@Valid @RequestBody ContractRequest request) {
        ContractResponse response = contractService.createContract(request);
        return new ResponseEntity<>(ApiResponse.success("Contract created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ContractResponse>> updateContract(
            @PathVariable Long id,
            @Valid @RequestBody ContractRequest request) {
        ContractResponse response = contractService.updateContract(id, request);
        return ResponseEntity.ok(ApiResponse.success("Contract updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContractResponse>> getContractById(@PathVariable Long id) {
        ContractResponse response = contractService.getContractById(id);
        return ResponseEntity.ok(ApiResponse.success("Contract retrieved successfully", response));
    }

    @GetMapping("/contract-number/{contractNumber}")
    public ResponseEntity<ApiResponse<ContractResponse>> getContractByContractNumber(@PathVariable String contractNumber) {
        ContractResponse response = contractService.getContractByContractNumber(contractNumber);
        return ResponseEntity.ok(ApiResponse.success("Contract retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ContractResponse>>> getAllContracts(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ContractResponse> response = contractService.getAllContracts(pageable);
        return ResponseEntity.ok(ApiResponse.success("Contracts retrieved successfully", response));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<ContractResponse>>> getContractsByVendor(@PathVariable Long vendorId) {
        List<ContractResponse> response = contractService.getContractsByVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Contracts retrieved by vendor", response));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ContractResponse>>> getContractsByStatus(@PathVariable String status) {
        List<ContractResponse> response = contractService.getContractsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Contracts retrieved by status", response));
    }

    @PostMapping("/{id}/renew")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ContractResponse>> renewContract(
            @PathVariable Long id,
            @Valid @RequestBody ContractRenewalRequest request) {
        ContractResponse response = contractService.renewContract(id, request);
        return ResponseEntity.ok(ApiResponse.success("Contract renewed successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteContract(@PathVariable Long id) {
        contractService.deleteContract(id);
        return ResponseEntity.ok(ApiResponse.success("Contract deleted successfully", null));
    }
}

