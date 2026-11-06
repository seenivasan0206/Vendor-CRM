package com.vendorcrm.settings.repository;

import com.vendorcrm.settings.entity.AppSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppSettingRepository extends JpaRepository<AppSetting, Long> {

    Optional<AppSetting> findBySettingKey(String settingKey);

    boolean existsBySettingKey(String settingKey);

    List<AppSetting> findBySettingCategory(String settingCategory);

    List<AppSetting> findByIsActiveTrue();
}

