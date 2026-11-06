package com.vendorcrm.dashboard.service;

import com.vendorcrm.contracts.entity.Contract;
import com.vendorcrm.contracts.repository.ContractRepository;
import com.vendorcrm.dashboard.dto.*;
import com.vendorcrm.purchaseorder.entity.PurchaseOrder;
import com.vendorcrm.purchaseorder.repository.PurchaseOrderRepository;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final EntityManager entityManager;
    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ContractRepository contractRepository;

    public DashboardServiceImpl(EntityManager entityManager,
                                VendorRepository vendorRepository,
                                PurchaseOrderRepository purchaseOrderRepository,
                                ContractRepository contractRepository) {
        this.entityManager = entityManager;
        this.vendorRepository = vendorRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.contractRepository = contractRepository;
    }

    @Override
    public OverallDashboardStatsResponse getOverallStats() {
        return OverallDashboardStatsResponse.builder()
                .vendorStats(getVendorStats())
                .purchaseOrderStats(getPurchaseOrderStats())
                .contractStats(getContractStats())
                .build();
    }

    @Override
    public DashboardVendorStatsResponse getVendorStats() {
        long total = vendorRepository.count();
        long active = countVendorsByStatus("ACTIVE");
        long inactive = countVendorsByStatus("INACTIVE");
        long pending = countVendorsByStatus("PENDING_APPROVAL");
        long blocked = countVendorsByStatus("BLOCKED");

        Double avgRating = entityManager.createQuery("SELECT AVG(v.rating) FROM Vendor v WHERE v.rating > 0", Double.class)
                .getSingleResult();
        double rating = avgRating != null ? BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP).doubleValue() : 0.0;

        return DashboardVendorStatsResponse.builder()
                .totalVendors(total)
                .activeVendors(active)
                .inactiveVendors(inactive)
                .pendingApprovalVendors(pending)
                .blockedVendors(blocked)
                .averageRating(rating)
                .build();
    }

    private long countVendorsByStatus(String status) {
        Long count = entityManager.createQuery("SELECT COUNT(v) FROM Vendor v WHERE UPPER(v.status) = :status", Long.class)
                .setParameter("status", status.toUpperCase())
                .getSingleResult();
        return count != null ? count : 0L;
    }

    @Override
    public DashboardPOStatsResponse getPurchaseOrderStats() {
        long total = purchaseOrderRepository.count();
        long pending = countPOsByStatus("PENDING_APPROVAL");
        long approved = countPOsByStatus("APPROVED");
        long issued = countPOsByStatus("ISSUED");
        long delivered = countPOsByStatus("DELIVERED");
        long cancelled = countPOsByStatus("CANCELLED");

        BigDecimal totalVal = entityManager.createQuery("SELECT COALESCE(SUM(po.grandTotal), 0) FROM PurchaseOrder po", BigDecimal.class)
                .getSingleResult();

        return DashboardPOStatsResponse.builder()
                .totalOrders(total)
                .pendingOrders(pending)
                .approvedOrders(approved)
                .issuedOrders(issued)
                .deliveredOrders(delivered)
                .cancelledOrders(cancelled)
                .totalOrderValue(totalVal != null ? totalVal : BigDecimal.ZERO)
                .build();
    }

    private long countPOsByStatus(String status) {
        Long count = entityManager.createQuery("SELECT COUNT(po) FROM PurchaseOrder po WHERE UPPER(po.status) = :status", Long.class)
                .setParameter("status", status.toUpperCase())
                .getSingleResult();
        return count != null ? count : 0L;
    }

    @Override
    public DashboardContractStatsResponse getContractStats() {
        long total = contractRepository.count();
        long active = countContractsByStatus("ACTIVE");
        long expired = countContractsByStatus("EXPIRED");
        long terminated = countContractsByStatus("TERMINATED");
        long draft = countContractsByStatus("DRAFT");

        LocalDate today = LocalDate.now();
        Long expiringSoon = entityManager.createQuery(
                "SELECT COUNT(c) FROM Contract c WHERE c.endDate BETWEEN :today AND :targetDate AND UPPER(c.status) = 'ACTIVE'", Long.class)
                .setParameter("today", today)
                .setParameter("targetDate", today.plusDays(30))
                .getSingleResult();

        BigDecimal totalVal = entityManager.createQuery("SELECT COALESCE(SUM(c.contractValue), 0) FROM Contract c", BigDecimal.class)
                .getSingleResult();

        BigDecimal activeVal = entityManager.createQuery("SELECT COALESCE(SUM(c.contractValue), 0) FROM Contract c WHERE UPPER(c.status) = 'ACTIVE'", BigDecimal.class)
                .getSingleResult();

        return DashboardContractStatsResponse.builder()
                .totalContracts(total)
                .activeContracts(active)
                .expiredContracts(expired)
                .terminatedContracts(terminated)
                .draftContracts(draft)
                .expiringSoon(expiringSoon != null ? expiringSoon : 0L)
                .totalContractValue(totalVal != null ? totalVal : BigDecimal.ZERO)
                .activeContractValue(activeVal != null ? activeVal : BigDecimal.ZERO)
                .build();
    }

    private long countContractsByStatus(String status) {
        Long count = entityManager.createQuery("SELECT COUNT(c) FROM Contract c WHERE UPPER(c.status) = :status", Long.class)
                .setParameter("status", status.toUpperCase())
                .getSingleResult();
        return count != null ? count : 0L;
    }

    @Override
    public DashboardMonthlyStatsResponse getMonthlyPOStats(Integer year) {
        int targetYear = year != null ? year : LocalDate.now().getYear();

        List<Object[]> rows = entityManager.createQuery(
                "SELECT FUNCTION('MONTH', po.orderDate), COUNT(po), COALESCE(SUM(po.grandTotal), 0) " +
                        "FROM PurchaseOrder po " +
                        "WHERE FUNCTION('YEAR', po.orderDate) = :year " +
                        "GROUP BY FUNCTION('MONTH', po.orderDate) " +
                        "ORDER BY FUNCTION('MONTH', po.orderDate) ASC", Object[].class)
                .setParameter("year", targetYear)
                .getResultList();

        Map<Integer, Object[]> monthMap = new HashMap<>();
        for (Object[] r : rows) {
            Integer m = ((Number) r[0]).intValue();
            monthMap.put(m, r);
        }

        List<DashboardMonthlyStatsResponse.MonthlyDataPoint> points = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            String monthName = Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            long count = 0;
            BigDecimal val = BigDecimal.ZERO;

            if (monthMap.containsKey(m)) {
                Object[] data = monthMap.get(m);
                count = (Long) data[1];
                val = (BigDecimal) data[2];
            }

            points.add(DashboardMonthlyStatsResponse.MonthlyDataPoint.builder()
                    .month(m)
                    .monthName(monthName)
                    .orderCount(count)
                    .totalValue(val)
                    .build());
        }

        return DashboardMonthlyStatsResponse.builder()
                .year(targetYear)
                .points(points)
                .build();
    }

    @Override
    public List<RecentVendorItem> getRecentVendors(int limit) {
        int max = limit > 0 ? limit : 5;
        List<Vendor> vendors = entityManager.createQuery("SELECT v FROM Vendor v ORDER BY v.createdAt DESC", Vendor.class)
                .setMaxResults(max)
                .getResultList();

        return vendors.stream().map(v -> RecentVendorItem.builder()
                .id(v.getId())
                .vendorCode(v.getVendorCode())
                .companyName(v.getCompanyName())
                .contactPerson(v.getContactPerson())
                .email(v.getEmail())
                .phone(v.getPhone())
                .status(v.getStatus())
                .rating(v.getRating())
                .createdAt(v.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    public List<RecentPOItem> getRecentPurchaseOrders(int limit) {
        int max = limit > 0 ? limit : 5;
        List<PurchaseOrder> orders = entityManager.createQuery("SELECT po FROM PurchaseOrder po ORDER BY po.createdAt DESC", PurchaseOrder.class)
                .setMaxResults(max)
                .getResultList();

        return orders.stream().map(po -> RecentPOItem.builder()
                .id(po.getId())
                .orderNumber(po.getOrderNumber())
                .vendorId(po.getVendor() != null ? po.getVendor().getId() : null)
                .vendorName(po.getVendor() != null ? po.getVendor().getCompanyName() : "N/A")
                .orderDate(po.getOrderDate())
                .grandTotal(po.getGrandTotal())
                .status(po.getStatus())
                .createdAt(po.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    public List<RecentContractItem> getRecentContracts(int limit) {
        int max = limit > 0 ? limit : 5;
        List<Contract> contracts = entityManager.createQuery("SELECT c FROM Contract c ORDER BY c.createdAt DESC", Contract.class)
                .setMaxResults(max)
                .getResultList();

        return contracts.stream().map(c -> RecentContractItem.builder()
                .id(c.getId())
                .contractNumber(c.getContractNumber())
                .title(c.getTitle())
                .vendorId(c.getVendor() != null ? c.getVendor().getId() : null)
                .vendorName(c.getVendor() != null ? c.getVendor().getCompanyName() : "N/A")
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .contractValue(c.getContractValue())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    public List<RecentPOItem> getPendingPurchaseOrders(int limit) {
        int max = limit > 0 ? limit : 10;
        List<PurchaseOrder> orders = entityManager.createQuery(
                "SELECT po FROM PurchaseOrder po WHERE UPPER(po.status) = 'PENDING_APPROVAL' ORDER BY po.orderDate ASC", PurchaseOrder.class)
                .setMaxResults(max)
                .getResultList();

        return orders.stream().map(po -> RecentPOItem.builder()
                .id(po.getId())
                .orderNumber(po.getOrderNumber())
                .vendorId(po.getVendor() != null ? po.getVendor().getId() : null)
                .vendorName(po.getVendor() != null ? po.getVendor().getCompanyName() : "N/A")
                .orderDate(po.getOrderDate())
                .grandTotal(po.getGrandTotal())
                .status(po.getStatus())
                .createdAt(po.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    public List<RecentContractItem> getUpcomingContractExpirations(int days, int limit) {
        int threshold = days > 0 ? days : 30;
        int max = limit > 0 ? limit : 10;
        LocalDate today = LocalDate.now();
        LocalDate target = today.plusDays(threshold);

        List<Contract> contracts = entityManager.createQuery(
                "SELECT c FROM Contract c WHERE c.endDate BETWEEN :today AND :target AND UPPER(c.status) = 'ACTIVE' ORDER BY c.endDate ASC", Contract.class)
                .setParameter("today", today)
                .setParameter("target", target)
                .setMaxResults(max)
                .getResultList();

        return contracts.stream().map(c -> RecentContractItem.builder()
                .id(c.getId())
                .contractNumber(c.getContractNumber())
                .title(c.getTitle())
                .vendorId(c.getVendor() != null ? c.getVendor().getId() : null)
                .vendorName(c.getVendor() != null ? c.getVendor().getCompanyName() : "N/A")
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .contractValue(c.getContractValue())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
