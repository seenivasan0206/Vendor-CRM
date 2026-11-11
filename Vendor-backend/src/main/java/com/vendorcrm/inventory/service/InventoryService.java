package com.vendorcrm.inventory.service;

import com.vendorcrm.inventory.dto.InventoryRequest;
import com.vendorcrm.inventory.dto.InventoryResponse;
import com.vendorcrm.inventory.dto.InventoryTransactionResponse;
import com.vendorcrm.inventory.dto.StockAdjustmentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InventoryService {

    InventoryResponse createInventory(InventoryRequest request);

    InventoryResponse updateInventory(Long id, InventoryRequest request);

    InventoryResponse getInventoryById(Long id);

    InventoryResponse getInventoryByProductId(Long productId);

    Page<InventoryResponse> getAllInventory(Pageable pageable);

    List<InventoryResponse> getLowStockItems();

    InventoryResponse adjustStock(Long id, StockAdjustmentRequest request, String performedBy);

    List<InventoryTransactionResponse> getTransactionsByInventoryId(Long inventoryId);

    Page<InventoryTransactionResponse> getAllTransactions(Pageable pageable);

    void deleteInventory(Long id);
}

