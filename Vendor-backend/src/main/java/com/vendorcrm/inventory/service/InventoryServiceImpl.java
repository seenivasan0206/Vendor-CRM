package com.vendorcrm.inventory.service;

import com.vendorcrm.exception.BadRequestException;
import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.inventory.dto.InventoryRequest;
import com.vendorcrm.inventory.dto.InventoryResponse;
import com.vendorcrm.inventory.dto.InventoryTransactionResponse;
import com.vendorcrm.inventory.dto.StockAdjustmentRequest;
import com.vendorcrm.inventory.entity.Inventory;
import com.vendorcrm.inventory.entity.InventoryTransaction;
import com.vendorcrm.inventory.entity.TransactionType;
import com.vendorcrm.inventory.repository.InventoryRepository;
import com.vendorcrm.inventory.repository.InventoryTransactionRepository;
import com.vendorcrm.products.entity.Product;
import com.vendorcrm.products.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    public InventoryServiceImpl(
            InventoryRepository inventoryRepository,
            InventoryTransactionRepository transactionRepository,
            ProductRepository productRepository) {
        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public InventoryResponse createInventory(InventoryRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (inventoryRepository.existsByProductId(request.getProductId())) {
            throw new DuplicateResourceException("Inventory already exists for product ID: " + request.getProductId());
        }

        int initialQty = request.getQuantityOnHand() != null ? request.getQuantityOnHand() : 0;
        int reservedQty = request.getReservedQuantity() != null ? request.getReservedQuantity() : 0;
        int reorderLvl = request.getReorderLevel() != null ? request.getReorderLevel() : 10;

        Inventory inventory = Inventory.builder()
                .product(product)
                .quantityOnHand(initialQty)
                .reservedQuantity(reservedQty)
                .reorderLevel(reorderLvl)
                .maxLevel(request.getMaxLevel())
                .location(request.getLocation())
                .batchNumber(request.getBatchNumber())
                .build();

        inventory.updateStatus();
        Inventory saved = inventoryRepository.save(inventory);

        if (initialQty > 0) {
            InventoryTransaction tx = InventoryTransaction.builder()
                    .inventory(saved)
                    .type(TransactionType.STOCK_IN)
                    .quantity(initialQty)
                    .quantityBefore(0)
                    .quantityAfter(initialQty)
                    .referenceNumber("INITIAL_STOCK")
                    .notes("Initial stock entry upon inventory creation")
                    .performedBy("SYSTEM")
                    .build();
            transactionRepository.save(tx);
        }

        log.info("Initialized inventory for product ID: {} with quantity: {}", product.getId(), initialQty);
        return InventoryResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public InventoryResponse updateInventory(Long id, InventoryRequest request) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));

        if (request.getReorderLevel() != null) {
            inventory.setReorderLevel(request.getReorderLevel());
        }
        if (request.getMaxLevel() != null) {
            inventory.setMaxLevel(request.getMaxLevel());
        }
        if (request.getLocation() != null) {
            inventory.setLocation(request.getLocation());
        }
        if (request.getBatchNumber() != null) {
            inventory.setBatchNumber(request.getBatchNumber());
        }
        if (request.getReservedQuantity() != null) {
            inventory.setReservedQuantity(request.getReservedQuantity());
        }

        inventory.updateStatus();
        Inventory updated = inventoryRepository.save(inventory);
        log.info("Updated inventory settings for id: {}", updated.getId());
        return InventoryResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getInventoryById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        return InventoryResponse.fromEntity(inventory);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));
        return InventoryResponse.fromEntity(inventory);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryResponse> getAllInventory(Pageable pageable) {
        return inventoryRepository.findAll(pageable).map(InventoryResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockItems() {
        return inventoryRepository.findLowStockItems().stream()
                .map(InventoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InventoryResponse adjustStock(Long id, StockAdjustmentRequest request, String performedBy) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));

        int currentQty = inventory.getQuantityOnHand() != null ? inventory.getQuantityOnHand() : 0;
        int deltaQty = request.getQuantity();
        int newQty;

        switch (request.getType()) {
            case STOCK_IN:
            case RETURN:
                newQty = currentQty + deltaQty;
                break;
            case STOCK_OUT:
                if (currentQty < deltaQty) {
                    throw new BadRequestException("Insufficient inventory quantity: available " + currentQty + ", requested " + deltaQty);
                }
                newQty = currentQty - deltaQty;
                break;
            case ADJUSTMENT:
                newQty = deltaQty;
                break;
            default:
                throw new BadRequestException("Unsupported transaction type: " + request.getType());
        }

        inventory.setQuantityOnHand(newQty);
        inventory.updateStatus();
        Inventory saved = inventoryRepository.save(inventory);

        InventoryTransaction tx = InventoryTransaction.builder()
                .inventory(saved)
                .type(request.getType())
                .quantity(deltaQty)
                .quantityBefore(currentQty)
                .quantityAfter(newQty)
                .referenceNumber(request.getReferenceNumber())
                .notes(request.getNotes())
                .performedBy(performedBy != null ? performedBy : "ANONYMOUS")
                .build();

        transactionRepository.save(tx);
        log.info("Stock adjusted for inventory id: {} from {} to {} by {}", id, currentQty, newQty, performedBy);
        return InventoryResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getTransactionsByInventoryId(Long inventoryId) {
        if (!inventoryRepository.existsById(inventoryId)) {
            throw new ResourceNotFoundException("Inventory", "id", inventoryId);
        }
        return transactionRepository.findByInventoryIdOrderByCreatedAtDesc(inventoryId).stream()
                .map(InventoryTransactionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryTransactionResponse> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(InventoryTransactionResponse::fromEntity);
    }

    @Override
    @Transactional
    public void deleteInventory(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        inventoryRepository.delete(inventory);
        log.info("Deleted inventory record id: {}", id);
    }
}

