package com.vendorcrm.invoices.service;

import com.vendorcrm.exception.BadRequestException;
import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.invoices.dto.InvoiceItemRequest;
import com.vendorcrm.invoices.dto.InvoiceRequest;
import com.vendorcrm.invoices.dto.InvoiceResponse;
import com.vendorcrm.invoices.dto.InvoiceStatusRequest;
import com.vendorcrm.invoices.entity.Invoice;
import com.vendorcrm.invoices.entity.InvoiceItem;
import com.vendorcrm.invoices.repository.InvoiceRepository;
import com.vendorcrm.products.entity.Product;
import com.vendorcrm.products.repository.ProductRepository;
import com.vendorcrm.purchaseorder.entity.PurchaseOrder;
import com.vendorcrm.purchaseorder.repository.PurchaseOrderRepository;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;

    public InvoiceServiceImpl(
            InvoiceRepository invoiceRepository,
            VendorRepository vendorRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            ProductRepository productRepository) {
        this.invoiceRepository = invoiceRepository;
        this.vendorRepository = vendorRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        if (invoiceRepository.existsByInvoiceNumber(request.getInvoiceNumber())) {
            throw new DuplicateResourceException("Invoice number already exists: " + request.getInvoiceNumber());
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        PurchaseOrder po = null;
        if (request.getPurchaseOrderId() != null) {
            po = purchaseOrderRepository.findById(request.getPurchaseOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", request.getPurchaseOrderId()));
        }

        Invoice invoice = Invoice.builder()
                .invoiceNumber(request.getInvoiceNumber())
                .vendor(vendor)
                .purchaseOrder(po)
                .invoiceDate(request.getInvoiceDate())
                .dueDate(request.getDueDate())
                .paymentTerms(request.getPaymentTerms())
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : "DRAFT")
                .items(new ArrayList<>())
                .payments(new ArrayList<>())
                .paidAmount(BigDecimal.ZERO)
                .build();

        calculateAndSetItems(invoice, request.getItems());

        Invoice saved = invoiceRepository.save(invoice);
        log.info("Created invoice with number: {} for vendor id: {}", saved.getInvoiceNumber(), vendor.getId());
        return InvoiceResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public InvoiceResponse updateInvoice(Long id, InvoiceRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        if ("PAID".equalsIgnoreCase(invoice.getStatus()) || "PARTIALLY_PAID".equalsIgnoreCase(invoice.getStatus())) {
            throw new BadRequestException("Cannot edit an invoice that has already received payments");
        }

        if (!invoice.getInvoiceNumber().equals(request.getInvoiceNumber()) &&
                invoiceRepository.existsByInvoiceNumber(request.getInvoiceNumber())) {
            throw new DuplicateResourceException("Invoice number already exists: " + request.getInvoiceNumber());
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        PurchaseOrder po = null;
        if (request.getPurchaseOrderId() != null) {
            po = purchaseOrderRepository.findById(request.getPurchaseOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", request.getPurchaseOrderId()));
        }

        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setVendor(vendor);
        invoice.setPurchaseOrder(po);
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setPaymentTerms(request.getPaymentTerms());
        invoice.setNotes(request.getNotes());
        if (request.getStatus() != null) {
            invoice.setStatus(request.getStatus());
        }

        invoice.getItems().clear();
        calculateAndSetItems(invoice, request.getItems());

        Invoice updated = invoiceRepository.save(invoice);
        log.info("Updated invoice with id: {}", updated.getId());
        return InvoiceResponse.fromEntity(updated);
    }

    private void calculateAndSetItems(Invoice invoice, List<InvoiceItemRequest> itemRequests) {
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (InvoiceItemRequest itemReq : itemRequests) {
            Product product = null;
            if (itemReq.getProductId() != null) {
                product = productRepository.findById(itemReq.getProductId()).orElse(null);
            }

            BigDecimal qty = BigDecimal.valueOf(itemReq.getQuantity());
            BigDecimal itemSubtotal = itemReq.getUnitPrice().multiply(qty).setScale(2, RoundingMode.HALF_UP);
            BigDecimal taxRate = itemReq.getTaxRate() != null ? itemReq.getTaxRate() : BigDecimal.ZERO;
            BigDecimal itemTax = itemSubtotal.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal itemTotal = itemSubtotal.add(itemTax);

            subtotal = subtotal.add(itemSubtotal);
            totalTax = totalTax.add(itemTax);

            InvoiceItem item = InvoiceItem.builder()
                    .product(product)
                    .description(itemReq.getDescription())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .taxRate(taxRate)
                    .totalPrice(itemTotal)
                    .build();

            invoice.addItem(item);
        }

        invoice.setSubtotal(subtotal);
        invoice.setTaxAmount(totalTax);
        invoice.setTotalAmount(subtotal.add(totalTax));
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
        return InvoiceResponse.fromEntity(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByInvoiceNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "invoiceNumber", invoiceNumber));
        return InvoiceResponse.fromEntity(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getAllInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(InvoiceResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByVendor(Long vendorId) {
        return invoiceRepository.findByVendorId(vendorId).stream()
                .map(InvoiceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByVendor(Long vendorId, Pageable pageable) {
        return invoiceRepository.findByVendorId(vendorId, pageable).map(InvoiceResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByPurchaseOrder(Long purchaseOrderId) {
        return invoiceRepository.findByPurchaseOrderId(purchaseOrderId).stream()
                .map(InvoiceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByStatus(String status) {
        return invoiceRepository.findByStatus(status).stream()
                .map(InvoiceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InvoiceResponse updateInvoiceStatus(Long id, InvoiceStatusRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        invoice.setStatus(request.getStatus());
        if (request.getReason() != null) {
            String updatedNotes = invoice.getNotes() == null ? "" : invoice.getNotes() + "\n";
            invoice.setNotes(updatedNotes + "[Status Change Reason]: " + request.getReason());
        }

        Invoice updated = invoiceRepository.save(invoice);
        log.info("Updated status of invoice id: {} to {}", id, request.getStatus());
        return InvoiceResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        if (invoice.getPayments() != null && !invoice.getPayments().isEmpty()) {
            throw new BadRequestException("Cannot delete invoice id: " + id + " because it has recorded payments");
        }

        invoiceRepository.delete(invoice);
        log.info("Deleted invoice with id: {}", id);
    }
}

