package com.vendorcrm.invoices.repository;

import com.vendorcrm.invoices.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    boolean existsByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByVendorId(Long vendorId);

    Page<Invoice> findByVendorId(Long vendorId, Pageable pageable);

    List<Invoice> findByPurchaseOrderId(Long purchaseOrderId);

    List<Invoice> findByStatus(String status);

    Page<Invoice> findByStatus(String status, Pageable pageable);
}

