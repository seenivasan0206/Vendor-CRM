package com.vendorcrm.vendors.repository;

import com.vendorcrm.vendors.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByVendorCode(String vendorCode);

    boolean existsByVendorCode(String vendorCode);

    boolean existsByEmail(String email);

    List<Vendor> findByStatus(String status);

    @Query("SELECT v FROM Vendor v WHERE " +
            "LOWER(v.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.vendorCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.contactPerson) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Vendor> searchVendors(@Param("query") String query, Pageable pageable);
}

