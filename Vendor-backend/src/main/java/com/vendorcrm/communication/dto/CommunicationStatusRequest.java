package com.vendorcrm.communication.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationStatusRequest {

    @NotBlank(message = "Communication status is required")
    @Pattern(regexp = "^(PENDING|COMPLETED|CANCELLED)$", message = "Status must be PENDING, COMPLETED, or CANCELLED")
    private String communicationStatus;

    private String remarks;
}

