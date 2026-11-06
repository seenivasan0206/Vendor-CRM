package com.vendorcrm.performance.repository;

import com.vendorcrm.performance.entity.VendorPerformance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorPerformanceRepository extends JpaRepository<VendorPerformance, Long> {

    List<VendorPerformance> findByVendorId(Long vendorId);

    Page<VendorPerformance> findByVendorId(Long vendorId, Pageable pageable);

    List<VendorPerformance> findByReviewPeriod(String reviewPeriod);

    List<VendorPerformance> findByVendorIdOrderByReviewDateDesc(Long vendorId);
}

