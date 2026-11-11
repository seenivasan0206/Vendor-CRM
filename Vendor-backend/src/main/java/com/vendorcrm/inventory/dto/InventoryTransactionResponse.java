package com.vendorcrm.inventory.dto;

import com.vendorcrm.inventory.entity.InventoryTransaction;
import com.vendorcrm.inventory.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionResponse {

    private Long id;
    private Long inventoryId;
    private Long productId;
    private String productSku;
    private String productName;
    private TransactionType type;
    private Integer quantity;
    private Integer quantityBefore;
    private Integer quantityAfter;
    private String referenceNumber;
    private String notes;
    private String performedBy;
    private LocalDateTime createdAt;

    public static InventoryTransactionResponse fromEntity(InventoryTransaction tx) {
        return InventoryTransactionResponse.builder()
                .id(tx.getId())
                .inventoryId(tx.getInventory() != null ? tx.getInventory().getId() : null)
                .productId(tx.getInventory() != null && tx.getInventory().getProduct() != null ? tx.getInventory().getProduct().getId() : null)
                .productSku(tx.getInventory() != null && tx.getInventory().getProduct() != null ? tx.getInventory().getProduct().getSku() : null)
                .productName(tx.getInventory() != null && tx.getInventory().getProduct() != null ? tx.getInventory().getProduct().getName() : null)
                .type(tx.getType())
                .quantity(tx.getQuantity())
                .quantityBefore(tx.getQuantityBefore())
                .quantityAfter(tx.getQuantityAfter())
                .referenceNumber(tx.getReferenceNumber())
                .notes(tx.getNotes())
                .performedBy(tx.getPerformedBy())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}

