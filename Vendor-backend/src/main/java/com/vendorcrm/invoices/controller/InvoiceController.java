package com.vendorcrm.invoices.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.invoices.dto.InvoiceRequest;
import com.vendorcrm.invoices.dto.InvoiceResponse;
import com.vendorcrm.invoices.dto.InvoiceStatusRequest;
import com.vendorcrm.invoices.service.InvoiceService;
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
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@Valid @RequestBody InvoiceRequest request) {
        InvoiceResponse response = invoiceService.createInvoice(request);
        return new ResponseEntity<>(ApiResponse.success("Invoice created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoice(
            @PathVariable Long id,
            @Valid @RequestBody InvoiceRequest request) {
        InvoiceResponse response = invoiceService.updateInvoice(id, request);
        return ResponseEntity.ok(ApiResponse.success("Invoice updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Long id) {
        InvoiceResponse response = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved successfully", response));
    }

    @GetMapping("/invoice-number/{invoiceNumber}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceByInvoiceNumber(@PathVariable String invoiceNumber) {
        InvoiceResponse response = invoiceService.getInvoiceByInvoiceNumber(invoiceNumber);
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<InvoiceResponse>>> getAllInvoices(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<InvoiceResponse> response = invoiceService.getAllInvoices(pageable);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", response));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByVendor(@PathVariable Long vendorId) {
        List<InvoiceResponse> response = invoiceService.getInvoicesByVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved by vendor", response));
    }

    @GetMapping("/purchase-order/{purchaseOrderId}")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByPurchaseOrder(@PathVariable Long purchaseOrderId) {
        List<InvoiceResponse> response = invoiceService.getInvoicesByPurchaseOrder(purchaseOrderId);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved by purchase order", response));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByStatus(@PathVariable String status) {
        List<InvoiceResponse> response = invoiceService.getInvoicesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved by status", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoiceStatus(
            @PathVariable Long id,
            @Valid @RequestBody InvoiceStatusRequest request) {
        InvoiceResponse response = invoiceService.updateInvoiceStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Invoice status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice deleted successfully", null));
    }
}

