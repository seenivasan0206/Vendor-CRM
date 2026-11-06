package com.vendorcrm.settings.service;

import com.vendorcrm.settings.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SettingsService {

    List<AppSettingResponse> getAllSettings();

    AppSettingResponse getSettingById(Long id);

    AppSettingResponse getSettingByKey(String settingKey);

    AppSettingResponse createSetting(AppSettingRequest request);

    AppSettingResponse updateSetting(Long id, AppSettingRequest request);

    void deleteSetting(Long id);

    Page<UserAdminResponse> getAllUsers(Pageable pageable);

    UserAdminResponse getUserById(Long userId);

    List<RoleResponse> getAllRoles();

    List<RoleResponse> getUserRoles(Long userId);

    UserAdminResponse updateUserRoles(Long userId, UserRoleUpdateRequest request, String currentUsername);

    UserAdminResponse updateUserStatus(Long userId, UserStatusUpdateRequest request, String currentUsername);
}

