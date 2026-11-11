package com.vendorcrm.communication.service;

import com.vendorcrm.communication.dto.CommunicationRequest;
import com.vendorcrm.communication.dto.CommunicationResponse;
import com.vendorcrm.communication.dto.CommunicationStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommunicationService {

    CommunicationResponse createCommunication(CommunicationRequest request, String createdBy);

    CommunicationResponse getCommunicationById(Long id);

    Page<CommunicationResponse> getAllCommunications(Pageable pageable);

    Page<CommunicationResponse> getCommunicationsByVendor(Long vendorId, Pageable pageable);

    List<CommunicationResponse> getCommunicationHistoryByVendor(Long vendorId);

    CommunicationResponse updateCommunication(Long id, CommunicationRequest request);

    void deleteCommunication(Long id);

    Page<CommunicationResponse> searchCommunications(String query, Pageable pageable);

    Page<CommunicationResponse> filterCommunications(Long vendorId, String type, String status, Pageable pageable);

    CommunicationResponse updateCommunicationStatus(Long id, CommunicationStatusRequest request);
}

