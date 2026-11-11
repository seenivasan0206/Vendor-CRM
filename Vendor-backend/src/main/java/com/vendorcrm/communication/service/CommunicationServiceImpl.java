package com.vendorcrm.communication.service;

import com.vendorcrm.communication.dto.CommunicationRequest;
import com.vendorcrm.communication.dto.CommunicationResponse;
import com.vendorcrm.communication.dto.CommunicationStatusRequest;
import com.vendorcrm.communication.entity.Communication;
import com.vendorcrm.communication.repository.CommunicationRepository;
import com.vendorcrm.exception.ResourceNotFoundException;
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
public class CommunicationServiceImpl implements CommunicationService {

    private final CommunicationRepository communicationRepository;
    private final VendorRepository vendorRepository;

    public CommunicationServiceImpl(CommunicationRepository communicationRepository, VendorRepository vendorRepository) {
        this.communicationRepository = communicationRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    @Transactional
    public CommunicationResponse createCommunication(CommunicationRequest request, String createdBy) {
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        String status = request.getCommunicationStatus() != null ? request.getCommunicationStatus() : "PENDING";

        Communication communication = Communication.builder()
                .vendor(vendor)
                .subject(request.getSubject())
                .message(request.getMessage())
                .communicationType(request.getCommunicationType())
                .communicationDate(request.getCommunicationDate())
                .communicationStatus(status)
                .createdBy(createdBy)
                .remarks(request.getRemarks())
                .build();

        Communication saved = communicationRepository.save(communication);
        log.info("Communication record created with ID {} for vendor {}", saved.getId(), vendor.getVendorCode());
        return CommunicationResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CommunicationResponse getCommunicationById(Long id) {
        Communication communication = communicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Communication", "id", id));
        return CommunicationResponse.fromEntity(communication);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommunicationResponse> getAllCommunications(Pageable pageable) {
        return communicationRepository.findAll(pageable).map(CommunicationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommunicationResponse> getCommunicationsByVendor(Long vendorId, Pageable pageable) {
        if (!vendorRepository.existsById(vendorId)) {
            throw new ResourceNotFoundException("Vendor", "id", vendorId);
        }
        return communicationRepository.findByVendorId(vendorId, pageable).map(CommunicationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommunicationResponse> getCommunicationHistoryByVendor(Long vendorId) {
        if (!vendorRepository.existsById(vendorId)) {
            throw new ResourceNotFoundException("Vendor", "id", vendorId);
        }
        return communicationRepository.findByVendorIdOrderByCommunicationDateDesc(vendorId).stream()
                .map(CommunicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommunicationResponse updateCommunication(Long id, CommunicationRequest request) {
        Communication communication = communicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Communication", "id", id));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        communication.setVendor(vendor);
        communication.setSubject(request.getSubject());
        communication.setMessage(request.getMessage());
        communication.setCommunicationType(request.getCommunicationType());
        communication.setCommunicationDate(request.getCommunicationDate());
        if (request.getCommunicationStatus() != null) {
            communication.setCommunicationStatus(request.getCommunicationStatus());
        }
        communication.setRemarks(request.getRemarks());

        Communication updated = communicationRepository.save(communication);
        log.info("Communication record updated with ID {}", updated.getId());
        return CommunicationResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteCommunication(Long id) {
        Communication communication = communicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Communication", "id", id));
        communicationRepository.delete(communication);
        log.info("Communication record deleted with ID {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommunicationResponse> searchCommunications(String query, Pageable pageable) {
        return communicationRepository.searchCommunications(query, pageable).map(CommunicationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommunicationResponse> filterCommunications(Long vendorId, String type, String status, Pageable pageable) {
        return communicationRepository.filterCommunications(vendorId, type, status, pageable).map(CommunicationResponse::fromEntity);
    }

    @Override
    @Transactional
    public CommunicationResponse updateCommunicationStatus(Long id, CommunicationStatusRequest request) {
        Communication communication = communicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Communication", "id", id));

        communication.setCommunicationStatus(request.getCommunicationStatus());
        if (request.getRemarks() != null && !request.getRemarks().isBlank()) {
            String currentRemarks = communication.getRemarks() == null ? "" : communication.getRemarks() + "\n";
            communication.setRemarks(currentRemarks + "[Status Update]: " + request.getRemarks());
        }

        Communication updated = communicationRepository.save(communication);
        log.info("Communication status updated for ID {} to {}", updated.getId(), updated.getCommunicationStatus());
        return CommunicationResponse.fromEntity(updated);
    }
}

