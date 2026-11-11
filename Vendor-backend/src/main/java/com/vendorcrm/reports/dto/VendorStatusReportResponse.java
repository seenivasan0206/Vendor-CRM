package com.vendorcrm.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorStatusReportResponse {
    private String status;
    private long count;
    private List<VendorReportItem> vendors;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VendorReportItem {
        private Long id;
        private String vendorCode;
        private String companyName;
        private String contactPerson;
        private String email;
        private String phone;
        private Double rating;
        private String status;
    }
}

