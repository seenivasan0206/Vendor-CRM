package com.vendorcrm.contracts.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
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
public class ContractRenewalRequest {

    @NotNull(message = "New end date is required")
    private LocalDate newEndDate;

    @DecimalMin(value = "0.0", message = "New contract value cannot be negative")
    private BigDecimal newContractValue;

    private String notes;
}

