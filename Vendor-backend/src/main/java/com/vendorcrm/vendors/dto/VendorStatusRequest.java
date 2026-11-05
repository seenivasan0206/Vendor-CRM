package com.vendorcrm.vendors.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String reason;
}

