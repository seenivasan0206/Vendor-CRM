package com.vendorcrm.communication.dto;

import com.vendorcrm.communication.entity.Communication;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunicationResponse {

    private Long id;
    private Long vendorId;
    private String vendorCode;
    private String companyName;
    private String subject;
    private String message;
    private String communicationType;
    private LocalDateTime communicationDate;
    private String communicationStatus;
    private String createdBy;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommunicationResponse fromEntity(Communication entity) {
        if (entity == null) {
            return null;
        }

        Long vId = null;
        String vCode = null;
        String cName = null;

        if (entity.getVendor() != null) {
            vId = entity.getVendor().getId();
            vCode = entity.getVendor().getVendorCode();
            cName = entity.getVendor().getCompanyName();
        }

        return CommunicationResponse.builder()
                .id(entity.getId())
                .vendorId(vId)
                .vendorCode(vCode)
                .companyName(cName)
                .subject(entity.getSubject())
                .message(entity.getMessage())
                .communicationType(entity.getCommunicationType())
                .communicationDate(entity.getCommunicationDate())
                .communicationStatus(entity.getCommunicationStatus())
                .createdBy(entity.getCreatedBy())
                .remarks(entity.getRemarks())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

