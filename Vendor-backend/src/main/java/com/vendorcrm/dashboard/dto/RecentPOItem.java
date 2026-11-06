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
public class RecentPOItem {
    private Long id;
    private String orderNumber;
    private Long vendorId;
    private String vendorName;
    private LocalDate orderDate;
    private BigDecimal grandTotal;
    private String status;
    private LocalDateTime createdAt;
}

