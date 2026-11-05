package com.vendorcrm.contracts.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractRequest {

    @NotBlank(message = "Contract number is required")
    @Size(max = 50, message = "Contract number cannot exceed 50 characters")
    private String contractNumber;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Contract value is required")
    @DecimalMin(value = "0.0", message = "Contract value cannot be negative")
    private BigDecimal contractValue;

    private String status;

    private String termsAndConditions;

    private Boolean autoRenew;

    private Integer renewalNoticeDays;
}

