package com.vendorcrm.products.service;

import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.products.dto.ProductRequest;
import com.vendorcrm.products.dto.ProductResponse;
import com.vendorcrm.products.dto.ProductStatusRequest;
import com.vendorcrm.products.entity.Product;
import com.vendorcrm.products.entity.ProductType;
import com.vendorcrm.products.repository.ProductRepository;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;

    public ProductServiceImpl(ProductRepository productRepository, VendorRepository vendorRepository) {
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product SKU already exists: " + request.getSku());
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        Product product = Product.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .category(request.getCategory())
                .unitPrice(request.getUnitPrice())
                .unitOfMeasure(request.getUnitOfMeasure())
                .vendor(vendor)
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        Product saved = productRepository.save(product);
        log.info("Created product with id: {} and SKU: {}", saved.getId(), saved.getSku());
        return ProductResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("Product SKU already exists: " + request.getSku());
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setType(request.getType());
        product.setCategory(request.getCategory());
        product.setUnitPrice(request.getUnitPrice());
        product.setUnitOfMeasure(request.getUnitOfMeasure());
        product.setVendor(vendor);
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        Product updated = productRepository.save(product);
        log.info("Updated product with id: {}", updated.getId());
        return ProductResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductResponse.fromEntity(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
        return ProductResponse.fromEntity(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return productRepository.searchProducts(query, pageable).map(ProductResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByVendor(Long vendorId) {
        return productRepository.findByVendorId(vendorId).stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByVendor(Long vendorId, Pageable pageable) {
        return productRepository.findByVendorId(vendorId, pageable).map(ProductResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByType(ProductType type) {
        return productRepository.findByType(type).stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByType(ProductType type, Pageable pageable) {
        return productRepository.findByType(type, pageable).map(ProductResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByStatus(String status) {
        return productRepository.findByStatus(status).stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse updateProductStatus(Long id, ProductStatusRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setStatus(request.getStatus());
        Product updated = productRepository.save(product);
        log.info("Updated status of product id: {} to {}", id, request.getStatus());
        return ProductResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
        log.info("Deleted product with id: {}", id);
    }
}

