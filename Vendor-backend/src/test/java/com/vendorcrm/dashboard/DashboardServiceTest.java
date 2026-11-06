package com.vendorcrm.dashboard;

import com.vendorcrm.contracts.repository.ContractRepository;
import com.vendorcrm.dashboard.dto.DashboardContractStatsResponse;
import com.vendorcrm.dashboard.dto.DashboardPOStatsResponse;
import com.vendorcrm.dashboard.dto.DashboardVendorStatsResponse;
import com.vendorcrm.dashboard.dto.OverallDashboardStatsResponse;
import com.vendorcrm.dashboard.service.DashboardServiceImpl;
import com.vendorcrm.purchaseorder.repository.PurchaseOrderRepository;
import com.vendorcrm.vendors.repository.VendorRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    @Mock
    private ContractRepository contractRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @Test
    void testGetVendorStats_HandlesEmptyAndNormal() {
        when(vendorRepository.count()).thenReturn(5L);

        TypedQuery<Long> longQuery = mock(TypedQuery.class);
        when(entityManager.createQuery(contains("SELECT COUNT(v) FROM Vendor v"), eq(Long.class))).thenReturn(longQuery);
        when(longQuery.setParameter(anyString(), any())).thenReturn(longQuery);
        when(longQuery.getSingleResult()).thenReturn(3L);

        TypedQuery<Double> doubleQuery = mock(TypedQuery.class);
        when(entityManager.createQuery(contains("SELECT AVG(v.rating) FROM Vendor v"), eq(Double.class))).thenReturn(doubleQuery);
        when(doubleQuery.getSingleResult()).thenReturn(4.25);

        DashboardVendorStatsResponse response = dashboardService.getVendorStats();

        assertNotNull(response);
        assertEquals(5L, response.getTotalVendors());
        assertEquals(4.25, response.getAverageRating());
    }

    @Test
    void testGetPurchaseOrderStats() {
        when(purchaseOrderRepository.count()).thenReturn(10L);

        TypedQuery<Long> countQuery = mock(TypedQuery.class);
        when(entityManager.createQuery(contains("SELECT COUNT(po) FROM PurchaseOrder po"), eq(Long.class))).thenReturn(countQuery);
        when(countQuery.setParameter(anyString(), any())).thenReturn(countQuery);
        when(countQuery.getSingleResult()).thenReturn(2L);

        TypedQuery<BigDecimal> sumQuery = mock(TypedQuery.class);
        when(entityManager.createQuery(contains("SELECT COALESCE(SUM(po.grandTotal), 0) FROM PurchaseOrder po"), eq(BigDecimal.class))).thenReturn(sumQuery);
        when(sumQuery.getSingleResult()).thenReturn(BigDecimal.valueOf(150000.00));

        DashboardPOStatsResponse response = dashboardService.getPurchaseOrderStats();

        assertNotNull(response);
        assertEquals(10L, response.getTotalOrders());
        assertEquals(BigDecimal.valueOf(150000.00), response.getTotalOrderValue());
    }
}

