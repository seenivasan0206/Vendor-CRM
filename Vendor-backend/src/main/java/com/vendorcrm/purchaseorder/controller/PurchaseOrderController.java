package com.vendorcrm.purchaseorder.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderRequest;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderResponse;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderStatusRequest;
import com.vendorcrm.purchaseorder.service.PurchaseOrderService;
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
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrderRequest request) {
        PurchaseOrderResponse response = purchaseOrderService.createPurchaseOrder(request);
        return new ResponseEntity<>(ApiResponse.success("Purchase order created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> updatePurchaseOrder(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseOrderRequest request) {
        PurchaseOrderResponse response = purchaseOrderService.updatePurchaseOrder(id, request);
        return ResponseEntity.ok(ApiResponse.success("Purchase order updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> getPurchaseOrderById(@PathVariable Long id) {
        PurchaseOrderResponse response = purchaseOrderService.getPurchaseOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Purchase order retrieved successfully", response));
    }

    @GetMapping("/order-number/{orderNumber}")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> getPurchaseOrderByOrderNumber(@PathVariable String orderNumber) {
        PurchaseOrderResponse response = purchaseOrderService.getPurchaseOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Purchase order retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PurchaseOrderResponse>>> getAllPurchaseOrders(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<PurchaseOrderResponse> response = purchaseOrderService.getAllPurchaseOrders(pageable);
        return ResponseEntity.ok(ApiResponse.success("Purchase orders retrieved successfully", response));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponse>>> getPurchaseOrdersByVendor(@PathVariable Long vendorId) {
        List<PurchaseOrderResponse> response = purchaseOrderService.getPurchaseOrdersByVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Purchase orders retrieved by vendor", response));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponse>>> getPurchaseOrdersByStatus(@PathVariable String status) {
        List<PurchaseOrderResponse> response = purchaseOrderService.getPurchaseOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Purchase orders retrieved by status", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PurchaseOrderResponse>> updatePurchaseOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseOrderStatusRequest request) {
        PurchaseOrderResponse response = purchaseOrderService.updatePurchaseOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Purchase order status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Purchase order deleted successfully", null));
    }
}

