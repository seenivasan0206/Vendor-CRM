package com.vendorcrm.invoices.service;

import com.vendorcrm.exception.BadRequestException;
import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.invoices.dto.PaymentRequest;
import com.vendorcrm.invoices.dto.PaymentResponse;
import com.vendorcrm.invoices.entity.Invoice;
import com.vendorcrm.invoices.entity.Payment;
import com.vendorcrm.invoices.repository.InvoiceRepository;
import com.vendorcrm.invoices.repository.PaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository, InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request, String recordedBy) {
        if (paymentRepository.existsByPaymentReference(request.getPaymentReference())) {
            throw new DuplicateResourceException("Payment reference already exists: " + request.getPaymentReference());
        }

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", request.getInvoiceId()));

        if ("CANCELLED".equalsIgnoreCase(invoice.getStatus())) {
            throw new BadRequestException("Cannot apply payment to a cancelled invoice");
        }

        BigDecimal remainingBalance = invoice.getRemainingBalance();
        if (request.getAmount().compareTo(remainingBalance) > 0) {
            throw new BadRequestException(String.format("Payment amount (%.2f) exceeds invoice remaining balance (%.2f)",
                    request.getAmount(), remainingBalance));
        }

        Payment payment = Payment.builder()
                .paymentReference(request.getPaymentReference())
                .invoice(invoice)
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate())
                .paymentMethod(request.getPaymentMethod())
                .transactionReference(request.getTransactionReference())
                .status(request.getStatus() != null ? request.getStatus() : "COMPLETED")
                .notes(request.getNotes())
                .recordedBy(recordedBy != null ? recordedBy : "SYSTEM")
                .build();

        Payment saved = paymentRepository.save(payment);
        invoice.addPayment(saved);
        invoiceRepository.save(invoice);

        log.info("Recorded payment {} of amount {} for invoice {}", saved.getPaymentReference(), saved.getAmount(), invoice.getInvoiceNumber());
        return PaymentResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return PaymentResponse.fromEntity(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByReference(String paymentReference) {
        Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "paymentReference", paymentReference));
        return PaymentResponse.fromEntity(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByVendorId(Long vendorId) {
        return paymentRepository.findByInvoiceVendorId(vendorId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(PaymentResponse::fromEntity);
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        payment.setStatus(status);
        Payment updated = paymentRepository.save(payment);

        // Recalculate invoice paid amount
        Invoice invoice = payment.getInvoice();
        if (invoice != null) {
            BigDecimal totalPaid = paymentRepository.findByInvoiceId(invoice.getId()).stream()
                    .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                    .map(Payment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            invoice.setPaidAmount(totalPaid);
            invoice.updatePaymentStatus();
            invoiceRepository.save(invoice);
        }

        log.info("Updated status of payment id: {} to {}", id, status);
        return PaymentResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        Invoice invoice = payment.getInvoice();
        paymentRepository.delete(payment);

        if (invoice != null) {
            BigDecimal totalPaid = paymentRepository.findByInvoiceId(invoice.getId()).stream()
                    .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                    .map(Payment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            invoice.setPaidAmount(totalPaid);
            invoice.updatePaymentStatus();
            invoiceRepository.save(invoice);
        }

        log.info("Deleted payment id: {}", id);
    }
}

