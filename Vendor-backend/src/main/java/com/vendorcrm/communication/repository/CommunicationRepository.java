package com.vendorcrm.communication.repository;

import com.vendorcrm.communication.entity.Communication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunicationRepository extends JpaRepository<Communication, Long> {

    Page<Communication> findByVendorId(Long vendorId, Pageable pageable);

    List<Communication> findByVendorIdOrderByCommunicationDateDesc(Long vendorId);

    Page<Communication> findByCommunicationType(String communicationType, Pageable pageable);

    Page<Communication> findByCommunicationStatus(String communicationStatus, Pageable pageable);

    @Query("SELECT c FROM Communication c WHERE " +
            "LOWER(c.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.message) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.vendor.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.vendor.vendorCode) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Communication> searchCommunications(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM Communication c WHERE " +
            "(:vendorId IS NULL OR c.vendor.id = :vendorId) AND " +
            "(:communicationType IS NULL OR c.communicationType = :communicationType) AND " +
            "(:communicationStatus IS NULL OR c.communicationStatus = :communicationStatus)")
    Page<Communication> filterCommunications(
            @Param("vendorId") Long vendorId,
            @Param("communicationType") String communicationType,
            @Param("communicationStatus") String communicationStatus,
            Pageable pageable);
}

