package com.vendorcrm.inventory.dto;

import com.vendorcrm.inventory.entity.TransactionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAdjustmentRequest {

    @NotNull(message = "Transaction type is required (STOCK_IN, STOCK_OUT, ADJUSTMENT, RETURN)")
    private TransactionType type;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    private String referenceNumber;

    private String notes;
}

