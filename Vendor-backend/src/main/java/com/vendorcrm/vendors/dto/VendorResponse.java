package com.vendorcrm.vendors.dto;

import com.vendorcrm.vendors.entity.Vendor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {

    private Long id;
    private String vendorCode;
    private String companyName;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String taxId;
    private String status;
    private Double rating;
    private String paymentTerms;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static VendorResponse fromEntity(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .vendorCode(vendor.getVendorCode())
                .companyName(vendor.getCompanyName())
                .contactPerson(vendor.getContactPerson())
                .email(vendor.getEmail())
                .phone(vendor.getPhone())
                .address(vendor.getAddress())
                .city(vendor.getCity())
                .state(vendor.getState())
                .country(vendor.getCountry())
                .postalCode(vendor.getPostalCode())
                .taxId(vendor.getTaxId())
                .status(vendor.getStatus())
                .rating(vendor.getRating())
                .paymentTerms(vendor.getPaymentTerms())
                .notes(vendor.getNotes())
                .createdAt(vendor.getCreatedAt())
                .updatedAt(vendor.getUpdatedAt())
                .build();
    }
}

