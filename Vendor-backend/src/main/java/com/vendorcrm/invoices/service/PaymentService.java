package com.vendorcrm.invoices.service;

import com.vendorcrm.invoices.dto.PaymentRequest;
import com.vendorcrm.invoices.dto.PaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PaymentService {

    PaymentResponse createPayment(PaymentRequest request, String recordedBy);

    PaymentResponse getPaymentById(Long id);

    PaymentResponse getPaymentByReference(String paymentReference);

    List<PaymentResponse> getPaymentsByInvoiceId(Long invoiceId);

    List<PaymentResponse> getPaymentsByVendorId(Long vendorId);

    Page<PaymentResponse> getAllPayments(Pageable pageable);

    PaymentResponse updatePaymentStatus(Long id, String status);

    void deletePayment(Long id);
}

