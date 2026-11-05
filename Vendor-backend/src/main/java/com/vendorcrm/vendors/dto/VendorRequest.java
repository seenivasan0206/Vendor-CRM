package com.vendorcrm.vendors.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorRequest {

    @NotBlank(message = "Vendor code is required")
    @Size(max = 50, message = "Vendor code cannot exceed 50 characters")
    private String vendorCode;

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name cannot exceed 150 characters")
    private String companyName;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person cannot exceed 100 characters")
    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(max = 25, message = "Phone cannot exceed 25 characters")
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
}

