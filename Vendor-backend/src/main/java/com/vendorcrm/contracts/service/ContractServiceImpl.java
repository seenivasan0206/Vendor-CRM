package com.vendorcrm.contracts.service;

import com.vendorcrm.contracts.dto.ContractRenewalRequest;
import com.vendorcrm.contracts.dto.ContractRequest;
import com.vendorcrm.contracts.dto.ContractResponse;
import com.vendorcrm.contracts.entity.Contract;
import com.vendorcrm.contracts.repository.ContractRepository;
import com.vendorcrm.exception.BadRequestException;
import com.vendorcrm.exception.DuplicateResourceException;
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
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final VendorRepository vendorRepository;

    public ContractServiceImpl(ContractRepository contractRepository, VendorRepository vendorRepository) {
        this.contractRepository = contractRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    @Transactional
    public ContractResponse createContract(ContractRequest request) {
        if (contractRepository.existsByContractNumber(request.getContractNumber())) {
            throw new DuplicateResourceException("Contract number already exists: " + request.getContractNumber());
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Contract end date cannot be earlier than start date");
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        Contract contract = Contract.builder()
                .contractNumber(request.getContractNumber())
                .title(request.getTitle())
                .vendor(vendor)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .contractValue(request.getContractValue())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .termsAndConditions(request.getTermsAndConditions())
                .autoRenew(request.getAutoRenew() != null ? request.getAutoRenew() : false)
                .renewalNoticeDays(request.getRenewalNoticeDays() != null ? request.getRenewalNoticeDays() : 30)
                .build();

        Contract saved = contractRepository.save(contract);
        return ContractResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ContractResponse updateContract(Long id, ContractRequest request) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "id", id));

        if (!contract.getContractNumber().equals(request.getContractNumber()) &&
                contractRepository.existsByContractNumber(request.getContractNumber())) {
            throw new DuplicateResourceException("Contract number already exists: " + request.getContractNumber());
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Contract end date cannot be earlier than start date");
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        contract.setContractNumber(request.getContractNumber());
        contract.setTitle(request.getTitle());
        contract.setVendor(vendor);
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setContractValue(request.getContractValue());
        if (request.getStatus() != null) {
            contract.setStatus(request.getStatus());
        }
        contract.setTermsAndConditions(request.getTermsAndConditions());
        if (request.getAutoRenew() != null) {
            contract.setAutoRenew(request.getAutoRenew());
        }
        if (request.getRenewalNoticeDays() != null) {
            contract.setRenewalNoticeDays(request.getRenewalNoticeDays());
        }

        Contract updated = contractRepository.save(contract);
        return ContractResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public ContractResponse getContractById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "id", id));
        return ContractResponse.fromEntity(contract);
    }

    @Override
    @Transactional(readOnly = true)
    public ContractResponse getContractByContractNumber(String contractNumber) {
        Contract contract = contractRepository.findByContractNumber(contractNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "contractNumber", contractNumber));
        return ContractResponse.fromEntity(contract);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContractResponse> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable).map(ContractResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponse> getContractsByVendor(Long vendorId) {
        return contractRepository.findByVendorId(vendorId).stream()
                .map(ContractResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponse> getContractsByStatus(String status) {
        return contractRepository.findByStatus(status).stream()
                .map(ContractResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ContractResponse renewContract(Long id, ContractRenewalRequest request) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "id", id));

        if (request.getNewEndDate().isBefore(contract.getEndDate())) {
            throw new BadRequestException("New contract end date must be after the current end date");
        }

        contract.setEndDate(request.getNewEndDate());
        if (request.getNewContractValue() != null) {
            contract.setContractValue(request.getNewContractValue());
        }
        contract.setStatus("RENEWED");

        if (request.getNotes() != null) {
            String updatedTerms = contract.getTermsAndConditions() == null ? "" : contract.getTermsAndConditions() + "\n";
            contract.setTermsAndConditions(updatedTerms + "[Renewal Notes]: " + request.getNotes());
        }

        Contract updated = contractRepository.save(contract);
        return ContractResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "id", id));
        contractRepository.delete(contract);
    }
}

