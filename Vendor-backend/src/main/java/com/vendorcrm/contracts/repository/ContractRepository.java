package com.vendorcrm.contracts.repository;

import com.vendorcrm.contracts.entity.Contract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    Optional<Contract> findByContractNumber(String contractNumber);

    boolean existsByContractNumber(String contractNumber);

    List<Contract> findByVendorId(Long vendorId);

    Page<Contract> findByVendorId(Long vendorId, Pageable pageable);

    List<Contract> findByStatus(String status);
}

