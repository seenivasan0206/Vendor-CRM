package com.vendorcrm.purchaseorder.dto;

import com.vendorcrm.purchaseorder.entity.PurchaseOrder;
import com.vendorcrm.purchaseorder.entity.PurchaseOrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderResponse {

    private Long id;
    private String orderNumber;
    private Long vendorId;
    private String vendorCompanyName;
    private String vendorCode;
    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal grandTotal;
    private String status;
    private String shippingAddress;
    private String notes;
    private List<ItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemResponse {
        private Long id;
        private String itemDescription;
        private String sku;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal taxRate;
        private BigDecimal totalPrice;

        public static ItemResponse fromEntity(PurchaseOrderItem item) {
            return ItemResponse.builder()
                    .id(item.getId())
                    .itemDescription(item.getItemDescription())
                    .sku(item.getSku())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .taxRate(item.getTaxRate())
                    .totalPrice(item.getTotalPrice())
                    .build();
        }
    }

    public static PurchaseOrderResponse fromEntity(PurchaseOrder po) {
        List<ItemResponse> items = po.getItems() != null
                ? po.getItems().stream().map(ItemResponse::fromEntity).collect(Collectors.toList())
                : Collections.emptyList();

        return PurchaseOrderResponse.builder()
                .id(po.getId())
                .orderNumber(po.getOrderNumber())
                .vendorId(po.getVendor() != null ? po.getVendor().getId() : null)
                .vendorCompanyName(po.getVendor() != null ? po.getVendor().getCompanyName() : null)
                .vendorCode(po.getVendor() != null ? po.getVendor().getVendorCode() : null)
                .orderDate(po.getOrderDate())
                .expectedDeliveryDate(po.getExpectedDeliveryDate())
                .totalAmount(po.getTotalAmount())
                .taxAmount(po.getTaxAmount())
                .grandTotal(po.getGrandTotal())
                .status(po.getStatus())
                .shippingAddress(po.getShippingAddress())
                .notes(po.getNotes())
                .items(items)
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt())
                .build();
    }
}

