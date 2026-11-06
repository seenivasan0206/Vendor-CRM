package com.vendorcrm.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentContractItem {
    private Long id;
    private String contractNumber;
    private String title;
    private Long vendorId;
    private String vendorName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal contractValue;
    private String status;
    private LocalDateTime createdAt;
}

