package com.vendorcrm.settings.service;

import com.vendorcrm.auth.entity.Role;
import com.vendorcrm.auth.entity.User;
import com.vendorcrm.auth.repository.RoleRepository;
import com.vendorcrm.auth.repository.UserRepository;
import com.vendorcrm.exception.BadRequestException;
import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.settings.dto.*;
import com.vendorcrm.settings.entity.AppSetting;
import com.vendorcrm.settings.repository.AppSettingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SettingsServiceImpl implements SettingsService {

    private final AppSettingRepository appSettingRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public SettingsServiceImpl(AppSettingRepository appSettingRepository,
                               UserRepository userRepository,
                               RoleRepository roleRepository) {
        this.appSettingRepository = appSettingRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppSettingResponse> getAllSettings() {
        return appSettingRepository.findAll().stream()
                .map(AppSettingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AppSettingResponse getSettingById(Long id) {
        AppSetting setting = appSettingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppSetting", "id", id));
        return AppSettingResponse.fromEntity(setting);
    }

    @Override
    @Transactional(readOnly = true)
    public AppSettingResponse getSettingByKey(String settingKey) {
        AppSetting setting = appSettingRepository.findBySettingKey(settingKey)
                .orElseThrow(() -> new ResourceNotFoundException("AppSetting", "settingKey", settingKey));
        return AppSettingResponse.fromEntity(setting);
    }

    @Override
    @Transactional
    public AppSettingResponse createSetting(AppSettingRequest request) {
        if (appSettingRepository.existsBySettingKey(request.getSettingKey())) {
            throw new DuplicateResourceException("Setting with key already exists: " + request.getSettingKey());
        }

        AppSetting setting = AppSetting.builder()
                .settingKey(request.getSettingKey().trim().toUpperCase())
                .settingValue(request.getSettingValue().trim())
                .description(request.getDescription())
                .settingCategory(request.getSettingCategory() != null ? request.getSettingCategory().toUpperCase() : "GENERAL")
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        AppSetting saved = appSettingRepository.save(setting);
        log.info("App setting created: {}", saved.getSettingKey());
        return AppSettingResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public AppSettingResponse updateSetting(Long id, AppSettingRequest request) {
        AppSetting setting = appSettingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppSetting", "id", id));

        String newKey = request.getSettingKey().trim().toUpperCase();
        if (!setting.getSettingKey().equalsIgnoreCase(newKey) && appSettingRepository.existsBySettingKey(newKey)) {
            throw new DuplicateResourceException("Setting with key already exists: " + newKey);
        }

        setting.setSettingKey(newKey);
        setting.setSettingValue(request.getSettingValue().trim());
        setting.setDescription(request.getDescription());
        if (request.getSettingCategory() != null) {
            setting.setSettingCategory(request.getSettingCategory().toUpperCase());
        }
        if (request.getIsActive() != null) {
            setting.setIsActive(request.getIsActive());
        }

        AppSetting updated = appSettingRepository.save(setting);
        log.info("App setting updated: {}", updated.getSettingKey());
        return AppSettingResponse.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteSetting(Long id) {
        AppSetting setting = appSettingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppSetting", "id", id));
        appSettingRepository.delete(setting);
        log.info("App setting deleted with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserAdminResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserAdminResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public UserAdminResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserAdminResponse.fromEntity(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(RoleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getUserRoles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return user.getRoles().stream()
                .map(RoleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserAdminResponse updateUserRoles(Long userId, UserRoleUpdateRequest request, String currentUsername) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Set<Role> updatedRoles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            String formattedRole = roleName.startsWith("ROLE_") ? roleName.toUpperCase() : "ROLE_" + roleName.toUpperCase();
            Role role = roleRepository.findByName(formattedRole)
                    .orElseThrow(() -> new BadRequestException("Invalid role specified: " + roleName));
            updatedRoles.add(role);
        }

        // Safety check: Prevent removing admin role if this user is the only admin
        boolean hasAdminRoleCurrently = targetUser.getRoles().stream()
                .anyMatch(r -> "ROLE_ADMIN".equalsIgnoreCase(r.getName()));
        boolean requestedAdminRole = updatedRoles.stream()
                .anyMatch(r -> "ROLE_ADMIN".equalsIgnoreCase(r.getName()));

        if (hasAdminRoleCurrently && !requestedAdminRole) {
            long totalAdmins = userRepository.findAll().stream()
                    .filter(u -> u.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equalsIgnoreCase(r.getName())))
                    .count();
            if (totalAdmins <= 1) {
                throw new BadRequestException("Cannot remove ROLE_ADMIN from the only system administrator");
            }
        }

        targetUser.setRoles(updatedRoles);
        User saved = userRepository.save(targetUser);
        log.info("Roles updated for user {} by {}", saved.getUsername(), currentUsername);
        return UserAdminResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public UserAdminResponse updateUserStatus(Long userId, UserStatusUpdateRequest request, String currentUsername) {
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Safety check: Cannot deactivate own account
        if (targetUser.getUsername().equalsIgnoreCase(currentUsername)) {
            throw new BadRequestException("You cannot deactivate your own account");
        }

        targetUser.setIsActive(request.getIsActive());
        User saved = userRepository.save(targetUser);
        log.info("Account status for user {} updated to active={} by {}", saved.getUsername(), saved.getIsActive(), currentUsername);
        return UserAdminResponse.fromEntity(saved);
    }
}

