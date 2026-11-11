package com.vendorcrm.inventory.entity;

import com.vendorcrm.common.BaseEntity;
import com.vendorcrm.products.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Builder.Default
    @Column(name = "quantity_on_hand", nullable = false)
    private Integer quantityOnHand = 0;

    @Builder.Default
    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity = 0;

    @Builder.Default
    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel = 10;

    @Column(name = "max_level")
    private Integer maxLevel;

    @Column(length = 100)
    private String location;

    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Builder.Default
    @Column(length = 30, nullable = false)
    private String status = "IN_STOCK"; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK

    public Integer getAvailableQuantity() {
        return (quantityOnHand != null ? quantityOnHand : 0) - (reservedQuantity != null ? reservedQuantity : 0);
    }

    public void updateStatus() {
        int qty = this.quantityOnHand != null ? this.quantityOnHand : 0;
        int threshold = this.reorderLevel != null ? this.reorderLevel : 0;
        if (qty <= 0) {
            this.status = "OUT_OF_STOCK";
        } else if (qty <= threshold) {
            this.status = "LOW_STOCK";
        } else {
            this.status = "IN_STOCK";
        }
    }
}

