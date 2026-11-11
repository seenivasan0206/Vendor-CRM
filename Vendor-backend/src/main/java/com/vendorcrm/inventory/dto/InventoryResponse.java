package com.vendorcrm.inventory.dto;

import com.vendorcrm.inventory.entity.Inventory;
import com.vendorcrm.products.entity.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {

    private Long id;
    private Long productId;
    private String productSku;
    private String productName;
    private ProductType productType;
    private String productCategory;
    private Integer quantityOnHand;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer reorderLevel;
    private Integer maxLevel;
    private String location;
    private String batchNumber;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static InventoryResponse fromEntity(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct() != null ? inventory.getProduct().getId() : null)
                .productSku(inventory.getProduct() != null ? inventory.getProduct().getSku() : null)
                .productName(inventory.getProduct() != null ? inventory.getProduct().getName() : null)
                .productType(inventory.getProduct() != null ? inventory.getProduct().getType() : null)
                .productCategory(inventory.getProduct() != null ? inventory.getProduct().getCategory() : null)
                .quantityOnHand(inventory.getQuantityOnHand())
                .reservedQuantity(inventory.getReservedQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .reorderLevel(inventory.getReorderLevel())
                .maxLevel(inventory.getMaxLevel())
                .location(inventory.getLocation())
                .batchNumber(inventory.getBatchNumber())
                .status(inventory.getStatus())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }
}

