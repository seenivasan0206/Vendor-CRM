package com.vendorcrm.vendors.service;

import com.vendorcrm.vendors.dto.VendorRequest;
import com.vendorcrm.vendors.dto.VendorResponse;
import com.vendorcrm.vendors.dto.VendorStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VendorService {

    VendorResponse createVendor(VendorRequest request);

    VendorResponse updateVendor(Long id, VendorRequest request);

    VendorResponse getVendorById(Long id);

    VendorResponse getVendorByCode(String vendorCode);

    Page<VendorResponse> getAllVendors(Pageable pageable);

    Page<VendorResponse> searchVendors(String query, Pageable pageable);

    List<VendorResponse> getVendorsByStatus(String status);

    VendorResponse updateVendorStatus(Long id, VendorStatusRequest request);

    void deleteVendor(Long id);
}

