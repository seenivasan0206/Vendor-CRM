package com.vendorcrm.contracts.dto;

import com.vendorcrm.contracts.entity.Contract;
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
public class ContractResponse {

    private Long id;
    private String contractNumber;
    private String title;
    private Long vendorId;
    private String vendorCompanyName;
    private String vendorCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal contractValue;
    private String status;
    private String termsAndConditions;
    private Boolean autoRenew;
    private Integer renewalNoticeDays;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ContractResponse fromEntity(Contract contract) {
        return ContractResponse.builder()
                .id(contract.getId())
                .contractNumber(contract.getContractNumber())
                .title(contract.getTitle())
                .vendorId(contract.getVendor() != null ? contract.getVendor().getId() : null)
                .vendorCompanyName(contract.getVendor() != null ? contract.getVendor().getCompanyName() : null)
                .vendorCode(contract.getVendor() != null ? contract.getVendor().getVendorCode() : null)
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .contractValue(contract.getContractValue())
                .status(contract.getStatus())
                .termsAndConditions(contract.getTermsAndConditions())
                .autoRenew(contract.getAutoRenew())
                .renewalNoticeDays(contract.getRenewalNoticeDays())
                .createdAt(contract.getCreatedAt())
                .updatedAt(contract.getUpdatedAt())
                .build();
    }
}

