package com.vendorcrm.reports.service;

import com.vendorcrm.contracts.entity.Contract;
import com.vendorcrm.contracts.repository.ContractRepository;
import com.vendorcrm.purchaseorder.entity.PurchaseOrder;
import com.vendorcrm.purchaseorder.repository.PurchaseOrderRepository;
import com.vendorcrm.reports.dto.*;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final EntityManager entityManager;
    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ContractRepository contractRepository;

    public ReportServiceImpl(EntityManager entityManager,
                             VendorRepository vendorRepository,
                             PurchaseOrderRepository purchaseOrderRepository,
                             ContractRepository contractRepository) {
        this.entityManager = entityManager;
        this.vendorRepository = vendorRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.contractRepository = contractRepository;
    }

    @Override
    public VendorSummaryReportResponse getVendorSummaryReport() {
        long total = vendorRepository.count();
        long active = countVendorsByStatus("ACTIVE");
        long inactive = countVendorsByStatus("INACTIVE");
        long pending = countVendorsByStatus("PENDING_APPROVAL");
        long blocked = countVendorsByStatus("BLOCKED");

        Double avgRating = entityManager.createQuery("SELECT AVG(v.rating) FROM Vendor v WHERE v.rating IS NOT NULL AND v.rating > 0", Double.class)
                .getSingleResult();
        double roundedAvg = avgRating != null ? BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP).doubleValue() : 0.0;

        List<Object[]> countryStats = entityManager.createQuery("SELECT v.country, COUNT(v) FROM Vendor v WHERE v.country IS NOT NULL GROUP BY v.country", Object[].class)
                .getResultList();
        Map<String, Long> vendorsByCountry = new HashMap<>();
        for (Object[] row : countryStats) {
            String country = (String) row[0];
            Long count = (Long) row[1];
            if (country != null) {
                vendorsByCountry.put(country, count);
            }
        }

        return VendorSummaryReportResponse.builder()
                .totalVendors(total)
                .activeVendors(active)
                .inactiveVendors(inactive)
                .pendingApprovalVendors(pending)
                .blockedVendors(blocked)
                .averageRating(roundedAvg)
                .vendorsByCountry(vendorsByCountry)
                .build();
    }

    private long countVendorsByStatus(String status) {
        Long count = entityManager.createQuery("SELECT COUNT(v) FROM Vendor v WHERE UPPER(v.status) = :status", Long.class)
                .setParameter("status", status.toUpperCase())
                .getSingleResult();
        return count != null ? count : 0L;
    }

    @Override
    public VendorStatusReportResponse getVendorStatusReport(String status) {
        String filterStatus = (status == null || status.isBlank()) ? "ACTIVE" : status.toUpperCase();
        List<Vendor> vendors = entityManager.createQuery("SELECT v FROM Vendor v WHERE UPPER(v.status) = :status ORDER BY v.companyName ASC", Vendor.class)
                .setParameter("status", filterStatus)
                .getResultList();

        List<VendorStatusReportResponse.VendorReportItem> items = vendors.stream()
                .map(v -> VendorStatusReportResponse.VendorReportItem.builder()
                        .id(v.getId())
                        .vendorCode(v.getVendorCode())
                        .companyName(v.getCompanyName())
                        .contactPerson(v.getContactPerson())
                        .email(v.getEmail())
                        .phone(v.getPhone())
                        .rating(v.getRating())
                        .status(v.getStatus())
                        .build())
                .collect(Collectors.toList());

        return VendorStatusReportResponse.builder()
                .status(filterStatus)
                .count(items.size())
                .vendors(items)
                .build();
    }

    @Override
    public PurchaseOrderReportResponse getPurchaseOrderReport(LocalDate startDate, LocalDate endDate, String status, Long vendorId) {
        StringBuilder jpql = new StringBuilder("SELECT po FROM PurchaseOrder po WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (startDate != null) {
            jpql.append("AND po.orderDate >= :startDate ");
            params.put("startDate", startDate);
        }
        if (endDate != null) {
            jpql.append("AND po.orderDate <= :endDate ");
            params.put("endDate", endDate);
        }
        if (status != null && !status.isBlank()) {
            jpql.append("AND UPPER(po.status) = :status ");
            params.put("status", status.toUpperCase());
        }
        if (vendorId != null) {
            jpql.append("AND po.vendor.id = :vendorId ");
            params.put("vendorId", vendorId);
        }
        jpql.append("ORDER BY po.orderDate DESC");

        TypedQuery<PurchaseOrder> query = entityManager.createQuery(jpql.toString(), PurchaseOrder.class);
        params.forEach(query::setParameter);

        List<PurchaseOrder> orders = query.getResultList();

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal grandTotal = BigDecimal.ZERO;

        List<PurchaseOrderReportResponse.PurchaseOrderReportItem> items = new ArrayList<>();
        for (PurchaseOrder po : orders) {
            totalAmount = totalAmount.add(po.getTotalAmount() != null ? po.getTotalAmount() : BigDecimal.ZERO);
            totalTax = totalTax.add(po.getTaxAmount() != null ? po.getTaxAmount() : BigDecimal.ZERO);
            grandTotal = grandTotal.add(po.getGrandTotal() != null ? po.getGrandTotal() : BigDecimal.ZERO);

            items.add(PurchaseOrderReportResponse.PurchaseOrderReportItem.builder()
                    .id(po.getId())
                    .orderNumber(po.getOrderNumber())
                    .vendorId(po.getVendor() != null ? po.getVendor().getId() : null)
                    .vendorName(po.getVendor() != null ? po.getVendor().getCompanyName() : "N/A")
                    .orderDate(po.getOrderDate())
                    .expectedDeliveryDate(po.getExpectedDeliveryDate())
                    .totalAmount(po.getTotalAmount())
                    .taxAmount(po.getTaxAmount())
                    .grandTotal(po.getGrandTotal())
                    .status(po.getStatus())
                    .totalItems(po.getItems() != null ? po.getItems().size() : 0)
                    .build());
        }

        return PurchaseOrderReportResponse.builder()
                .totalOrders(items.size())
                .totalAmount(totalAmount)
                .totalTax(totalTax)
                .grandTotal(grandTotal)
                .orders(items)
                .build();
    }

    @Override
    public PurchaseOrderStatusReportResponse getPurchaseOrderStatusReport() {
        long totalOrders = purchaseOrderRepository.count();

        BigDecimal overallTotal = entityManager.createQuery(
                "SELECT COALESCE(SUM(po.grandTotal), 0) FROM PurchaseOrder po", BigDecimal.class)
                .getSingleResult();

        List<Object[]> statusRows = entityManager.createQuery(
                "SELECT po.status, COUNT(po), COALESCE(SUM(po.grandTotal), 0) FROM PurchaseOrder po GROUP BY po.status", Object[].class)
                .getResultList();

        Map<String, PurchaseOrderStatusReportResponse.StatusBreakdown> breakdown = new LinkedHashMap<>();

        for (Object[] row : statusRows) {
            String st = (String) row[0];
            Long count = (Long) row[1];
            BigDecimal val = (BigDecimal) row[2];

            double percentage = totalOrders > 0 ?
                    BigDecimal.valueOf(count * 100.0 / totalOrders).setScale(2, RoundingMode.HALF_UP).doubleValue() : 0.0;

            breakdown.put(st, PurchaseOrderStatusReportResponse.StatusBreakdown.builder()
                    .count(count != null ? count : 0L)
                    .totalValue(val != null ? val : BigDecimal.ZERO)
                    .percentage(percentage)
                    .build());
        }

        return PurchaseOrderStatusReportResponse.builder()
                .totalOrders(totalOrders)
                .overallTotalValue(overallTotal != null ? overallTotal : BigDecimal.ZERO)
                .breakdown(breakdown)
                .build();
    }

    @Override
    public ContractSummaryReportResponse getContractSummaryReport() {
        long total = contractRepository.count();

        List<Object[]> statusRows = entityManager.createQuery(
                "SELECT c.status, COUNT(c) FROM Contract c GROUP BY c.status", Object[].class)
                .getResultList();

        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] r : statusRows) {
            statusMap.put((String) r[0], (Long) r[1]);
        }

        BigDecimal totalVal = entityManager.createQuery(
                "SELECT COALESCE(SUM(c.contractValue), 0) FROM Contract c", BigDecimal.class)
                .getSingleResult();

        BigDecimal activeVal = entityManager.createQuery(
                "SELECT COALESCE(SUM(c.contractValue), 0) FROM Contract c WHERE UPPER(c.status) = 'ACTIVE'", BigDecimal.class)
                .getSingleResult();

        Long autoRenew = entityManager.createQuery(
                "SELECT COUNT(c) FROM Contract c WHERE c.autoRenew = true", Long.class)
                .getSingleResult();

        return ContractSummaryReportResponse.builder()
                .totalContracts(total)
                .activeContracts(statusMap.getOrDefault("ACTIVE", 0L))
                .expiredContracts(statusMap.getOrDefault("EXPIRED", 0L))
                .terminatedContracts(statusMap.getOrDefault("TERMINATED", 0L))
                .draftContracts(statusMap.getOrDefault("DRAFT", 0L))
                .renewedContracts(statusMap.getOrDefault("RENEWED", 0L))
                .autoRenewContracts(autoRenew != null ? autoRenew : 0L)
                .totalContractValue(totalVal != null ? totalVal : BigDecimal.ZERO)
                .activeContractValue(activeVal != null ? activeVal : BigDecimal.ZERO)
                .contractsByStatus(statusMap)
                .build();
    }

    @Override
    public ContractExpiryReportResponse getContractExpiryReport(int days) {
        int threshold = days > 0 ? days : 30;
        LocalDate today = LocalDate.now();
        LocalDate targetDate = today.plusDays(threshold);

        List<Contract> contracts = entityManager.createQuery(
                "SELECT c FROM Contract c WHERE c.endDate BETWEEN :today AND :targetDate AND UPPER(c.status) = 'ACTIVE' ORDER BY c.endDate ASC", Contract.class)
                .setParameter("today", today)
                .setParameter("targetDate", targetDate)
                .getResultList();

        BigDecimal expiringTotal = BigDecimal.ZERO;
        List<ContractExpiryReportResponse.ExpiringContractItem> items = new ArrayList<>();

        for (Contract c : contracts) {
            BigDecimal val = c.getContractValue() != null ? c.getContractValue() : BigDecimal.ZERO;
            expiringTotal = expiringTotal.add(val);
            long daysRemaining = ChronoUnit.DAYS.between(today, c.getEndDate());

            items.add(ContractExpiryReportResponse.ExpiringContractItem.builder()
                    .contractId(c.getId())
                    .contractNumber(c.getContractNumber())
                    .title(c.getTitle())
                    .vendorId(c.getVendor() != null ? c.getVendor().getId() : null)
                    .vendorName(c.getVendor() != null ? c.getVendor().getCompanyName() : "N/A")
                    .startDate(c.getStartDate())
                    .endDate(c.getEndDate())
                    .contractValue(val)
                    .daysRemaining(daysRemaining)
                    .autoRenew(c.getAutoRenew())
                    .status(c.getStatus())
                    .build());
        }

        return ContractExpiryReportResponse.builder()
                .daysThreshold(threshold)
                .expiringCount(items.size())
                .expiringTotalValue(expiringTotal)
                .expiringContracts(items)
                .build();
    }

    @Override
    public VendorPerformanceReportResponse getVendorPerformanceReport() {
        List<Vendor> vendors = vendorRepository.findAll();

        Double avgSystemRating = entityManager.createQuery(
                "SELECT AVG(v.rating) FROM Vendor v WHERE v.rating > 0", Double.class)
                .getSingleResult();
        double avg = avgSystemRating != null ? BigDecimal.valueOf(avgSystemRating).setScale(2, RoundingMode.HALF_UP).doubleValue() : 0.0;

        List<Object[]> poAggByVendor = entityManager.createQuery(
                "SELECT po.vendor.id, COUNT(po), COALESCE(SUM(po.grandTotal), 0) FROM PurchaseOrder po GROUP BY po.vendor.id", Object[].class)
                .getResultList();
        Map<Long, Object[]> poMap = new HashMap<>();
        for (Object[] r : poAggByVendor) {
            poMap.put((Long) r[0], r);
        }

        List<Object[]> contractAggByVendor = entityManager.createQuery(
                "SELECT c.vendor.id, COUNT(c), COALESCE(SUM(c.contractValue), 0) FROM Contract c WHERE UPPER(c.status) = 'ACTIVE' GROUP BY c.vendor.id", Object[].class)
                .getResultList();
        Map<Long, Object[]> contractMap = new HashMap<>();
        for (Object[] r : contractAggByVendor) {
            contractMap.put((Long) r[0], r);
        }

        List<VendorPerformanceReportResponse.VendorPerformanceItem> items = new ArrayList<>();
        for (Vendor v : vendors) {
            Object[] poData = poMap.get(v.getId());
            long poCount = poData != null ? (Long) poData[1] : 0L;
            BigDecimal spend = poData != null ? (BigDecimal) poData[2] : BigDecimal.ZERO;

            Object[] cData = contractMap.get(v.getId());
            long activeContracts = cData != null ? (Long) cData[1] : 0L;
            BigDecimal contractVal = cData != null ? (BigDecimal) cData[2] : BigDecimal.ZERO;

            items.add(VendorPerformanceReportResponse.VendorPerformanceItem.builder()
                    .vendorId(v.getId())
                    .vendorCode(v.getVendorCode())
                    .companyName(v.getCompanyName())
                    .status(v.getStatus())
                    .rating(v.getRating() != null ? v.getRating() : 0.0)
                    .totalPurchaseOrders(poCount)
                    .totalSpend(spend)
                    .activeContracts(activeContracts)
                    .totalContractValue(contractVal)
                    .build());
        }

        // Sort by total spend descending
        items.sort((a, b) -> b.getTotalSpend().compareTo(a.getTotalSpend()));

        return VendorPerformanceReportResponse.builder()
                .totalVendorsEvaluated(vendors.size())
                .averageSystemRating(avg)
                .vendorPerformances(items)
                .build();
    }

    @Override
    public MonthlyPurchaseReportResponse getMonthlyPurchaseReport(Integer year) {
        int targetYear = year != null ? year : LocalDate.now().getYear();

        List<Object[]> rows = entityManager.createQuery(
                "SELECT FUNCTION('MONTH', po.orderDate), COUNT(po), COALESCE(SUM(po.grandTotal), 0) " +
                        "FROM PurchaseOrder po " +
                        "WHERE FUNCTION('YEAR', po.orderDate) = :year " +
                        "GROUP BY FUNCTION('MONTH', po.orderDate) " +
                        "ORDER BY FUNCTION('MONTH', po.orderDate) ASC", Object[].class)
                .setParameter("year", targetYear)
                .getResultList();

        Map<Integer, Object[]> monthData = new HashMap<>();
        for (Object[] r : rows) {
            Integer m = ((Number) r[0]).intValue();
            monthData.put(m, r);
        }

        List<MonthlyPurchaseReportResponse.MonthlyStatItem> monthlyBreakdown = new ArrayList<>();
        long totalOrders = 0;
        BigDecimal totalSpend = BigDecimal.ZERO;

        for (int m = 1; m <= 12; m++) {
            String monthName = Month.of(m).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            long count = 0;
            BigDecimal val = BigDecimal.ZERO;

            if (monthData.containsKey(m)) {
                Object[] data = monthData.get(m);
                count = (Long) data[1];
                val = (BigDecimal) data[2];
            }

            totalOrders += count;
            totalSpend = totalSpend.add(val);

            monthlyBreakdown.add(MonthlyPurchaseReportResponse.MonthlyStatItem.builder()
                    .month(m)
                    .monthName(monthName)
                    .orderCount(count)
                    .totalAmount(val)
                    .build());
        }

        return MonthlyPurchaseReportResponse.builder()
                .year(targetYear)
                .totalOrdersForYear(totalOrders)
                .totalSpendForYear(totalSpend)
                .monthlyBreakdown(monthlyBreakdown)
                .build();
    }

    @Override
    public BusinessSummaryReportResponse getBusinessSummaryReport() {
        long totalVendors = vendorRepository.count();
        long activeVendors = countVendorsByStatus("ACTIVE");
        long inactiveVendors = countVendorsByStatus("INACTIVE");

        Double avgRating = entityManager.createQuery("SELECT AVG(v.rating) FROM Vendor v WHERE v.rating > 0", Double.class)
                .getSingleResult();

        long totalPOs = purchaseOrderRepository.count();
        Long pendingPOs = entityManager.createQuery("SELECT COUNT(po) FROM PurchaseOrder po WHERE UPPER(po.status) = 'PENDING_APPROVAL'", Long.class)
                .getSingleResult();
        Long approvedPOs = entityManager.createQuery("SELECT COUNT(po) FROM PurchaseOrder po WHERE UPPER(po.status) = 'APPROVED'", Long.class)
                .getSingleResult();
        Long rejectedPOs = entityManager.createQuery("SELECT COUNT(po) FROM PurchaseOrder po WHERE UPPER(po.status) IN ('CANCELLED', 'REJECTED')", Long.class)
                .getSingleResult();

        BigDecimal totalPOVal = entityManager.createQuery("SELECT COALESCE(SUM(po.grandTotal), 0) FROM PurchaseOrder po", BigDecimal.class)
                .getSingleResult();

        long totalContracts = contractRepository.count();
        Long activeContracts = entityManager.createQuery("SELECT COUNT(c) FROM Contract c WHERE UPPER(c.status) = 'ACTIVE'", Long.class)
                .getSingleResult();
        Long expiredContracts = entityManager.createQuery("SELECT COUNT(c) FROM Contract c WHERE UPPER(c.status) = 'EXPIRED'", Long.class)
                .getSingleResult();

        LocalDate today = LocalDate.now();
        Long expiringSoon = entityManager.createQuery("SELECT COUNT(c) FROM Contract c WHERE c.endDate BETWEEN :today AND :targetDate AND UPPER(c.status) = 'ACTIVE'", Long.class)
                .setParameter("today", today)
                .setParameter("targetDate", today.plusDays(30))
                .getSingleResult();

        BigDecimal totalContractVal = entityManager.createQuery("SELECT COALESCE(SUM(c.contractValue), 0) FROM Contract c", BigDecimal.class)
                .getSingleResult();
        BigDecimal activeContractVal = entityManager.createQuery("SELECT COALESCE(SUM(c.contractValue), 0) FROM Contract c WHERE UPPER(c.status) = 'ACTIVE'", BigDecimal.class)
                .getSingleResult();

        return BusinessSummaryReportResponse.builder()
                .totalVendors(totalVendors)
                .activeVendors(activeVendors)
                .inactiveVendors(inactiveVendors)
                .averageVendorRating(avgRating != null ? BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP).doubleValue() : 0.0)
                .totalPurchaseOrders(totalPOs)
                .pendingPurchaseOrders(pendingPOs != null ? pendingPOs : 0L)
                .approvedPurchaseOrders(approvedPOs != null ? approvedPOs : 0L)
                .rejectedPurchaseOrders(rejectedPOs != null ? rejectedPOs : 0L)
                .totalPOValue(totalPOVal != null ? totalPOVal : BigDecimal.ZERO)
                .totalContracts(totalContracts)
                .activeContracts(activeContracts != null ? activeContracts : 0L)
                .expiredContracts(expiredContracts != null ? expiredContracts : 0L)
                .expiringSoonContracts(expiringSoon != null ? expiringSoon : 0L)
                .totalContractValue(totalContractVal != null ? totalContractVal : BigDecimal.ZERO)
                .activeContractValue(activeContractVal != null ? activeContractVal : BigDecimal.ZERO)
                .build();
    }

    @Override
    public byte[] exportVendorsCsv() {
        List<Vendor> vendors = vendorRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Vendor Code,Company Name,Contact Person,Email,Phone,Country,Status,Rating\n");

        for (Vendor v : vendors) {
            sb.append(escapeCsv(v.getId())).append(",")
                    .append(escapeCsv(v.getVendorCode())).append(",")
                    .append(escapeCsv(v.getCompanyName())).append(",")
                    .append(escapeCsv(v.getContactPerson())).append(",")
                    .append(escapeCsv(v.getEmail())).append(",")
                    .append(escapeCsv(v.getPhone())).append(",")
                    .append(escapeCsv(v.getCountry())).append(",")
                    .append(escapeCsv(v.getStatus())).append(",")
                    .append(v.getRating() != null ? v.getRating() : 0.0).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] exportPurchaseOrdersCsv() {
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Order Number,Vendor Name,Order Date,Expected Delivery Date,Total Amount,Tax Amount,Grand Total,Status\n");

        for (PurchaseOrder po : orders) {
            sb.append(escapeCsv(po.getId())).append(",")
                    .append(escapeCsv(po.getOrderNumber())).append(",")
                    .append(escapeCsv(po.getVendor() != null ? po.getVendor().getCompanyName() : "N/A")).append(",")
                    .append(escapeCsv(po.getOrderDate())).append(",")
                    .append(escapeCsv(po.getExpectedDeliveryDate())).append(",")
                    .append(po.getTotalAmount()).append(",")
                    .append(po.getTaxAmount()).append(",")
                    .append(po.getGrandTotal()).append(",")
                    .append(escapeCsv(po.getStatus())).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public byte[] exportContractsCsv() {
        List<Contract> contracts = contractRepository.findAll();
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Contract Number,Title,Vendor Name,Start Date,End Date,Contract Value,Status,Auto Renew\n");

        for (Contract c : contracts) {
            sb.append(escapeCsv(c.getId())).append(",")
                    .append(escapeCsv(c.getContractNumber())).append(",")
                    .append(escapeCsv(c.getTitle())).append(",")
                    .append(escapeCsv(c.getVendor() != null ? c.getVendor().getCompanyName() : "N/A")).append(",")
                    .append(escapeCsv(c.getStartDate())).append(",")
                    .append(escapeCsv(c.getEndDate())).append(",")
                    .append(c.getContractValue()).append(",")
                    .append(escapeCsv(c.getStatus())).append(",")
                    .append(c.getAutoRenew()).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(Object value) {
        if (value == null) {
            return "";
        }
        String str = value.toString();
        if (str.contains(",") || str.contains("\"") || str.contains("\n")) {
            str = str.replace("\"", "\"\"");
            return "\"" + str + "\"";
        }
        return str;
    }
}
