package com.vendorcrm.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentVendorItem {
    private Long id;
    private String vendorCode;
    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private String status;
    private Double rating;
    private LocalDateTime createdAt;
}

