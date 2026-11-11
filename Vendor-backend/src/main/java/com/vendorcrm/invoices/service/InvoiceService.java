package com.vendorcrm.invoices.service;

import com.vendorcrm.invoices.dto.InvoiceRequest;
import com.vendorcrm.invoices.dto.InvoiceResponse;
import com.vendorcrm.invoices.dto.InvoiceStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InvoiceService {

    InvoiceResponse createInvoice(InvoiceRequest request);

    InvoiceResponse updateInvoice(Long id, InvoiceRequest request);

    InvoiceResponse getInvoiceById(Long id);

    InvoiceResponse getInvoiceByInvoiceNumber(String invoiceNumber);

    Page<InvoiceResponse> getAllInvoices(Pageable pageable);

    List<InvoiceResponse> getInvoicesByVendor(Long vendorId);

    Page<InvoiceResponse> getInvoicesByVendor(Long vendorId, Pageable pageable);

    List<InvoiceResponse> getInvoicesByPurchaseOrder(Long purchaseOrderId);

    List<InvoiceResponse> getInvoicesByStatus(String status);

    InvoiceResponse updateInvoiceStatus(Long id, InvoiceStatusRequest request);

    void deleteInvoice(Long id);
}

