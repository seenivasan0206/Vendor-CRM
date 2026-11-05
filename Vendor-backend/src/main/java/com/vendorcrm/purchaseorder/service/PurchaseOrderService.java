package com.vendorcrm.purchaseorder.service;

import com.vendorcrm.purchaseorder.dto.PurchaseOrderRequest;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderResponse;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PurchaseOrderService {

    PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request);

    PurchaseOrderResponse updatePurchaseOrder(Long id, PurchaseOrderRequest request);

    PurchaseOrderResponse getPurchaseOrderById(Long id);

    PurchaseOrderResponse getPurchaseOrderByOrderNumber(String orderNumber);

    Page<PurchaseOrderResponse> getAllPurchaseOrders(Pageable pageable);

    List<PurchaseOrderResponse> getPurchaseOrdersByVendor(Long vendorId);

    List<PurchaseOrderResponse> getPurchaseOrdersByStatus(String status);

    PurchaseOrderResponse updatePurchaseOrderStatus(Long id, PurchaseOrderStatusRequest request);

    void deletePurchaseOrder(Long id);
}

