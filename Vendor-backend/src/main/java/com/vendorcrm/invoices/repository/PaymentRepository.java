package com.vendorcrm.invoices.repository;

import com.vendorcrm.invoices.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentReference(String paymentReference);

    boolean existsByPaymentReference(String paymentReference);

    List<Payment> findByInvoiceId(Long invoiceId);

    List<Payment> findByInvoiceVendorId(Long vendorId);

    Page<Payment> findByInvoiceVendorId(Long vendorId, Pageable pageable);

    List<Payment> findByStatus(String status);
}

