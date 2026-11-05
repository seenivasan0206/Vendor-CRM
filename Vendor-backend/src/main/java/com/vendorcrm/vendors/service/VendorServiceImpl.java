package com.vendorcrm.vendors.service;

import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.vendors.dto.VendorRequest;
import com.vendorcrm.vendors.dto.VendorResponse;
import com.vendorcrm.vendors.dto.VendorStatusRequest;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;

    public VendorServiceImpl(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @Override
    @Transactional
    public VendorResponse createVendor(VendorRequest request) {
        if (vendorRepository.existsByVendorCode(request.getVendorCode())) {
            throw new DuplicateResourceException("Vendor code already exists: " + request.getVendorCode());
        }

        if (vendorRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Vendor with email already exists: " + request.getEmail());
        }

        Vendor vendor = Vendor.builder()
                .vendorCode(request.getVendorCode())
                .companyName(request.getCompanyName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .taxId(request.getTaxId())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .rating(request.getRating() != null ? request.getRating() : 0.0)
                .paymentTerms(request.getPaymentTerms())
                .notes(request.getNotes())
                .build();

        Vendor saved = vendorRepository.save(vendor);
        return VendorResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public VendorResponse updateVendor(Long id, VendorRequest request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", id));

        if (!vendor.getVendorCode().equals(request.getVendorCode()) &&
                vendorRepository.existsByVendorCode(request.getVendorCode())) {
            throw new DuplicateResourceException("Vendor code already exists: " + request.getVendorCode());
        }

        if (!vendor.getEmail().equals(request.getEmail()) &&
                vendorRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Vendor with email already exists: " + request.getEmail());
        }

        vendor.setVendorCode(request.getVendorCode());
        vendor.setCompanyName(request.getCompanyName());
        vendor.setContactPerson(request.getContactPerson());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setAddress(request.getAddress());
        vendor.setCity(request.getCity());
        vendor.setState(request.getState());
        vendor.setCountry(request.getCountry());
        vendor.setPostalCode(request.getPostalCode());
        vendor.setTaxId(request.getTaxId());
        if (request.getStatus() != null) {
            vendor.setStatus(request.getStatus());
        }
        if (request.getRating() != null) {
            vendor.setRating(request.getRating());
        }
        vendor.setPaymentTerms(request.getPaymentTerms());
        vendor.setNotes(request.getNotes());

        Vendor updated = vendorRepository.save(vendor);
        return VendorResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public VendorResponse getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", id));
        return VendorResponse.fromEntity(vendor);
    }

    @Override
    @Transactional(readOnly = true)
    public VendorResponse getVendorByCode(String vendorCode) {
        Vendor vendor = vendorRepository.findByVendorCode(vendorCode)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "vendorCode", vendorCode));
        return VendorResponse.fromEntity(vendor);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendorResponse> getAllVendors(Pageable pageable) {
        return vendorRepository.findAll(pageable).map(VendorResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VendorResponse> searchVendors(String query, Pageable pageable) {
        return vendorRepository.searchVendors(query, pageable).map(VendorResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VendorResponse> getVendorsByStatus(String status) {
        return vendorRepository.findByStatus(status).stream()
                .map(VendorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VendorResponse updateVendorStatus(Long id, VendorStatusRequest request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", id));

        vendor.setStatus(request.getStatus());
        if (request.getReason() != null) {
            String updatedNotes = vendor.getNotes() == null ? "" : vendor.getNotes() + "\n";
            vendor.setNotes(updatedNotes + "[Status Change Reason]: " + request.getReason());
        }

        Vendor updated = vendorRepository.save(vendor);
        return VendorResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteVendor(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", id));
        vendorRepository.delete(vendor);
    }
}

