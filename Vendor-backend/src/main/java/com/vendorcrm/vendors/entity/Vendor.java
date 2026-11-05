package com.vendorcrm.vendors.entity;

import com.vendorcrm.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vendor_code", length = 50, nullable = false, unique = true)
    private String vendorCode;

    @Column(name = "company_name", length = 150, nullable = false)
    private String companyName;

    @Column(name = "contact_person", length = 100, nullable = false)
    private String contactPerson;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(length = 25, nullable = false)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Builder.Default
    @Column(length = 30, nullable = false)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, PENDING_APPROVAL, BLOCKED

    @Builder.Default
    private Double rating = 0.0;

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(columnDefinition = "TEXT")
    private String notes;
}

