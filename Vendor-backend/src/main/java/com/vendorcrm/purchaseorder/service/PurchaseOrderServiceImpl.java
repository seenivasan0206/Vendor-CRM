package com.vendorcrm.purchaseorder.service;

import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderItemRequest;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderRequest;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderResponse;
import com.vendorcrm.purchaseorder.dto.PurchaseOrderStatusRequest;
import com.vendorcrm.purchaseorder.entity.PurchaseOrder;
import com.vendorcrm.purchaseorder.entity.PurchaseOrderItem;
import com.vendorcrm.purchaseorder.repository.PurchaseOrderRepository;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final VendorRepository vendorRepository;

    public PurchaseOrderServiceImpl(PurchaseOrderRepository purchaseOrderRepository, VendorRepository vendorRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    @Transactional
    public PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request) {
        if (purchaseOrderRepository.existsByOrderNumber(request.getOrderNumber())) {
            throw new DuplicateResourceException("Purchase order number already exists: " + request.getOrderNumber());
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        PurchaseOrder po = PurchaseOrder.builder()
                .orderNumber(request.getOrderNumber())
                .vendor(vendor)
                .orderDate(request.getOrderDate())
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .shippingAddress(request.getShippingAddress())
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : "PENDING_APPROVAL")
                .items(new ArrayList<>())
                .build();

        calculateAndSetItems(po, request.getItems());

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        return PurchaseOrderResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public PurchaseOrderResponse updatePurchaseOrder(Long id, PurchaseOrderRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));

        if (!po.getOrderNumber().equals(request.getOrderNumber()) &&
                purchaseOrderRepository.existsByOrderNumber(request.getOrderNumber())) {
            throw new DuplicateResourceException("Purchase order number already exists: " + request.getOrderNumber());
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        po.setOrderNumber(request.getOrderNumber());
        po.setVendor(vendor);
        po.setOrderDate(request.getOrderDate());
        po.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        po.setShippingAddress(request.getShippingAddress());
        po.setNotes(request.getNotes());
        if (request.getStatus() != null) {
            po.setStatus(request.getStatus());
        }

        po.getItems().clear();
        calculateAndSetItems(po, request.getItems());

        PurchaseOrder updated = purchaseOrderRepository.save(po);
        return PurchaseOrderResponse.fromEntity(updated);
    }

    private void calculateAndSetItems(PurchaseOrder po, List<PurchaseOrderItemRequest> itemRequests) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (PurchaseOrderItemRequest itemReq : itemRequests) {
            BigDecimal qty = BigDecimal.valueOf(itemReq.getQuantity());
            BigDecimal itemTotal = itemReq.getUnitPrice().multiply(qty).setScale(2, RoundingMode.HALF_UP);
            BigDecimal taxRate = itemReq.getTaxRate() != null ? itemReq.getTaxRate() : BigDecimal.ZERO;
            BigDecimal itemTax = itemTotal.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            totalAmount = totalAmount.add(itemTotal);
            totalTax = totalTax.add(itemTax);

            PurchaseOrderItem item = PurchaseOrderItem.builder()
                    .itemDescription(itemReq.getItemDescription())
                    .sku(itemReq.getSku())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .taxRate(taxRate)
                    .totalPrice(itemTotal.add(itemTax))
                    .build();

            po.addItem(item);
        }

        po.setTotalAmount(totalAmount);
        po.setTaxAmount(totalTax);
        po.setGrandTotal(totalAmount.add(totalTax));
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));
        return PurchaseOrderResponse.fromEntity(po);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderByOrderNumber(String orderNumber) {
        PurchaseOrder po = purchaseOrderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "orderNumber", orderNumber));
        return PurchaseOrderResponse.fromEntity(po);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PurchaseOrderResponse> getAllPurchaseOrders(Pageable pageable) {
        return purchaseOrderRepository.findAll(pageable).map(PurchaseOrderResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getPurchaseOrdersByVendor(Long vendorId) {
        return purchaseOrderRepository.findByVendorId(vendorId).stream()
                .map(PurchaseOrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getPurchaseOrdersByStatus(String status) {
        return purchaseOrderRepository.findByStatus(status).stream()
                .map(PurchaseOrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PurchaseOrderResponse updatePurchaseOrderStatus(Long id, PurchaseOrderStatusRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));

        po.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            String updatedNotes = po.getNotes() == null ? "" : po.getNotes() + "\n";
            po.setNotes(updatedNotes + "[Status Change Notes]: " + request.getNotes());
        }

        PurchaseOrder updated = purchaseOrderRepository.save(po);
        return PurchaseOrderResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deletePurchaseOrder(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));
        purchaseOrderRepository.delete(po);
    }
}

