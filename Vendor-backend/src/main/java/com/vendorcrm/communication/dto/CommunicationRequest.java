package com.vendorcrm.communication.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationRequest {

    @NotNull(message = "Vendor ID is required")
    private Long vendorId;

    @NotBlank(message = "Subject is required")
    @Size(max = 200, message = "Subject cannot exceed 200 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Communication type is required")
    @Pattern(regexp = "^(EMAIL|PHONE|MEETING|MESSAGE)$", message = "Communication type must be EMAIL, PHONE, MEETING, or MESSAGE")
    private String communicationType;

    @NotNull(message = "Communication date is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime communicationDate;

    @Pattern(regexp = "^(PENDING|COMPLETED|CANCELLED)$", message = "Status must be PENDING, COMPLETED, or CANCELLED")
    private String communicationStatus;

    private String remarks;
}

