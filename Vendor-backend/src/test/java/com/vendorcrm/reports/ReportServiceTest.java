package com.vendorcrm.reports;

import com.vendorcrm.contracts.repository.ContractRepository;
import com.vendorcrm.purchaseorder.repository.PurchaseOrderRepository;
import com.vendorcrm.reports.service.ReportServiceImpl;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    @Mock
    private ContractRepository contractRepository;

    @InjectMocks
    private ReportServiceImpl reportService;

    @Test
    void testExportVendorsCsv_ProducesValidCsv() {
        Vendor vendor1 = Vendor.builder()
                .id(1L)
                .vendorCode("VND-001")
                .companyName("Acme Solutions, Inc.")
                .contactPerson("Alice")
                .email("alice@acme.com")
                .phone("12345")
                .country("USA")
                .status("ACTIVE")
                .rating(4.5)
                .build();

        when(vendorRepository.findAll()).thenReturn(List.of(vendor1));

        byte[] csv = reportService.exportVendorsCsv();

        assertNotNull(csv);
        String csvString = new String(csv);
        assertTrue(csvString.contains("ID,Vendor Code,Company Name"));
        assertTrue(csvString.contains("\"Acme Solutions, Inc.\""));
        assertTrue(csvString.contains("VND-001"));
    }
}

