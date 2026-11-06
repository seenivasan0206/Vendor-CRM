package com.vendorcrm.products.dto;

import com.vendorcrm.products.entity.Product;
import com.vendorcrm.products.entity.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String sku;
    private String name;
    private String description;
    private ProductType type;
    private String category;
    private BigDecimal unitPrice;
    private String unitOfMeasure;
    private Long vendorId;
    private String vendorCompanyName;
    private String vendorCode;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductResponse fromEntity(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .sku(product.getSku())
                .name(product.getName())
                .description(product.getDescription())
                .type(product.getType())
                .category(product.getCategory())
                .unitPrice(product.getUnitPrice())
                .unitOfMeasure(product.getUnitOfMeasure())
                .vendorId(product.getVendor() != null ? product.getVendor().getId() : null)
                .vendorCompanyName(product.getVendor() != null ? product.getVendor().getCompanyName() : null)
                .vendorCode(product.getVendor() != null ? product.getVendor().getVendorCode() : null)
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}

