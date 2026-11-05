package com.vendorcrm.purchaseorder.repository;

import com.vendorcrm.purchaseorder.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    List<PurchaseOrder> findByVendorId(Long vendorId);

    Page<PurchaseOrder> findByVendorId(Long vendorId, Pageable pageable);

    List<PurchaseOrder> findByStatus(String status);
}

