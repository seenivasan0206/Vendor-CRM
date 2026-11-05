package com.vendorcrm.contracts.service;

import com.vendorcrm.contracts.dto.ContractRenewalRequest;
import com.vendorcrm.contracts.dto.ContractRequest;
import com.vendorcrm.contracts.dto.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ContractService {

    ContractResponse createContract(ContractRequest request);

    ContractResponse updateContract(Long id, ContractRequest request);

    ContractResponse getContractById(Long id);

    ContractResponse getContractByContractNumber(String contractNumber);

    Page<ContractResponse> getAllContracts(Pageable pageable);

    List<ContractResponse> getContractsByVendor(Long vendorId);

    List<ContractResponse> getContractsByStatus(String status);

    ContractResponse renewContract(Long id, ContractRenewalRequest request);

    void deleteContract(Long id);
}

