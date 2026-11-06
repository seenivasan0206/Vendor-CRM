package com.vendorcrm.products.service;

import com.vendorcrm.products.dto.ProductRequest;
import com.vendorcrm.products.dto.ProductResponse;
import com.vendorcrm.products.dto.ProductStatusRequest;
import com.vendorcrm.products.entity.ProductType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    ProductResponse getProductById(Long id);

    ProductResponse getProductBySku(String sku);

    Page<ProductResponse> getAllProducts(Pageable pageable);

    Page<ProductResponse> searchProducts(String query, Pageable pageable);

    List<ProductResponse> getProductsByVendor(Long vendorId);

    Page<ProductResponse> getProductsByVendor(Long vendorId, Pageable pageable);

    List<ProductResponse> getProductsByType(ProductType type);

    Page<ProductResponse> getProductsByType(ProductType type, Pageable pageable);

    List<ProductResponse> getProductsByStatus(String status);

    ProductResponse updateProductStatus(Long id, ProductStatusRequest request);

    void deleteProduct(Long id);
}

