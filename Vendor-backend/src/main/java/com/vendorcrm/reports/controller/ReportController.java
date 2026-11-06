package com.vendorcrm.reports.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.reports.dto.*;
import com.vendorcrm.reports.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/vendors/summary")
    public ResponseEntity<ApiResponse<VendorSummaryReportResponse>> getVendorSummaryReport() {
        VendorSummaryReportResponse response = reportService.getVendorSummaryReport();
        return ResponseEntity.ok(ApiResponse.success("Vendor summary report generated", response));
    }

    @GetMapping("/vendors/status")
    public ResponseEntity<ApiResponse<VendorStatusReportResponse>> getVendorStatusReport(
            @RequestParam(required = false, defaultValue = "ACTIVE") String status) {
        VendorStatusReportResponse response = reportService.getVendorStatusReport(status);
        return ResponseEntity.ok(ApiResponse.success("Vendor status report generated", response));
    }

    @GetMapping("/purchase-orders/summary")
    public ResponseEntity<ApiResponse<PurchaseOrderReportResponse>> getPurchaseOrderReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long vendorId) {
        PurchaseOrderReportResponse response = reportService.getPurchaseOrderReport(startDate, endDate, status, vendorId);
        return ResponseEntity.ok(ApiResponse.success("Purchase order report generated", response));
    }

    @GetMapping("/purchase-orders/status")
    public ResponseEntity<ApiResponse<PurchaseOrderStatusReportResponse>> getPurchaseOrderStatusReport() {
        PurchaseOrderStatusReportResponse response = reportService.getPurchaseOrderStatusReport();
        return ResponseEntity.ok(ApiResponse.success("Purchase order status report generated", response));
    }

    @GetMapping("/contracts/summary")
    public ResponseEntity<ApiResponse<ContractSummaryReportResponse>> getContractSummaryReport() {
        ContractSummaryReportResponse response = reportService.getContractSummaryReport();
        return ResponseEntity.ok(ApiResponse.success("Contract summary report generated", response));
    }

    @GetMapping("/contracts/expiring")
    public ResponseEntity<ApiResponse<ContractExpiryReportResponse>> getContractExpiryReport(
            @RequestParam(required = false, defaultValue = "30") int days) {
        ContractExpiryReportResponse response = reportService.getContractExpiryReport(days);
        return ResponseEntity.ok(ApiResponse.success("Contract expiry report generated", response));
    }

    @GetMapping("/vendors/performance")
    public ResponseEntity<ApiResponse<VendorPerformanceReportResponse>> getVendorPerformanceReport() {
        VendorPerformanceReportResponse response = reportService.getVendorPerformanceReport();
        return ResponseEntity.ok(ApiResponse.success("Vendor performance summary generated", response));
    }

    @GetMapping("/purchase-orders/monthly")
    public ResponseEntity<ApiResponse<MonthlyPurchaseReportResponse>> getMonthlyPurchaseReport(
            @RequestParam(required = false) Integer year) {
        MonthlyPurchaseReportResponse response = reportService.getMonthlyPurchaseReport(year);
        return ResponseEntity.ok(ApiResponse.success("Monthly purchase report generated", response));
    }

    @GetMapping("/business-summary")
    public ResponseEntity<ApiResponse<BusinessSummaryReportResponse>> getBusinessSummaryReport() {
        BusinessSummaryReportResponse response = reportService.getBusinessSummaryReport();
        return ResponseEntity.ok(ApiResponse.success("Overall business summary generated", response));
    }

    @GetMapping("/export/vendors/csv")
    public ResponseEntity<byte[]> exportVendorsCsv() {
        byte[] csvData = reportService.exportVendorsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"vendors_report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping("/export/purchase-orders/csv")
    public ResponseEntity<byte[]> exportPurchaseOrdersCsv() {
        byte[] csvData = reportService.exportPurchaseOrdersCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"purchase_orders_report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping("/export/contracts/csv")
    public ResponseEntity<byte[]> exportContractsCsv() {
        byte[] csvData = reportService.exportContractsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"contracts_report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}

