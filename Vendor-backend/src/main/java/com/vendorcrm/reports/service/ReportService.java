package com.vendorcrm.reports.service;

import com.vendorcrm.reports.dto.*;

import java.time.LocalDate;

public interface ReportService {

    VendorSummaryReportResponse getVendorSummaryReport();

    VendorStatusReportResponse getVendorStatusReport(String status);

    PurchaseOrderReportResponse getPurchaseOrderReport(LocalDate startDate, LocalDate endDate, String status, Long vendorId);

    PurchaseOrderStatusReportResponse getPurchaseOrderStatusReport();

    ContractSummaryReportResponse getContractSummaryReport();

    ContractExpiryReportResponse getContractExpiryReport(int days);

    VendorPerformanceReportResponse getVendorPerformanceReport();

    MonthlyPurchaseReportResponse getMonthlyPurchaseReport(Integer year);

    BusinessSummaryReportResponse getBusinessSummaryReport();

    byte[] exportVendorsCsv();

    byte[] exportPurchaseOrdersCsv();

    byte[] exportContractsCsv();
}

