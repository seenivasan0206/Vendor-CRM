package com.vendorcrm.settings;

import com.vendorcrm.auth.entity.Role;
import com.vendorcrm.auth.entity.User;
import com.vendorcrm.auth.repository.RoleRepository;
import com.vendorcrm.auth.repository.UserRepository;
import com.vendorcrm.exception.BadRequestException;
import com.vendorcrm.exception.DuplicateResourceException;
import com.vendorcrm.settings.dto.AppSettingRequest;
import com.vendorcrm.settings.dto.AppSettingResponse;
import com.vendorcrm.settings.dto.UserRoleUpdateRequest;
import com.vendorcrm.settings.dto.UserStatusUpdateRequest;
import com.vendorcrm.settings.entity.AppSetting;
import com.vendorcrm.settings.repository.AppSettingRepository;
import com.vendorcrm.settings.service.SettingsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SettingsServiceTest {

    @Mock
    private AppSettingRepository appSettingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private SettingsServiceImpl settingsService;

    private AppSetting setting;
    private User adminUser;
    private Role adminRole;
    private Role managerRole;

    @BeforeEach
    void setUp() {
        setting = AppSetting.builder()
                .id(1L)
                .settingKey("COMPANY_NAME")
                .settingValue("Vendor CRM Ltd")
                .description("Default Company Name")
                .settingCategory("GENERAL")
                .isActive(true)
                .build();

        adminRole = Role.builder().id(1L).name("ROLE_ADMIN").build();
        managerRole = Role.builder().id(2L).name("ROLE_MANAGER").build();

        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);

        adminUser = User.builder()
                .id(10L)
                .username("sysadmin")
                .email("admin@crm.com")
                .fullName("System Admin")
                .isActive(true)
                .roles(roles)
                .build();
    }

    @Test
    void testCreateSetting_Success() {
        AppSettingRequest request = AppSettingRequest.builder()
                .settingKey("CURRENCY")
                .settingValue("USD")
                .settingCategory("FINANCIAL")
                .isActive(true)
                .build();

        when(appSettingRepository.existsBySettingKey("CURRENCY")).thenReturn(false);
        when(appSettingRepository.save(any(AppSetting.class))).thenReturn(setting);

        AppSettingResponse response = settingsService.createSetting(request);

        assertNotNull(response);
        verify(appSettingRepository, times(1)).save(any(AppSetting.class));
    }

    @Test
    void testCreateSetting_DuplicateKeyThrowsException() {
        AppSettingRequest request = AppSettingRequest.builder()
                .settingKey("COMPANY_NAME")
                .settingValue("Vendor CRM")
                .build();

        when(appSettingRepository.existsBySettingKey("COMPANY_NAME")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () ->
                settingsService.createSetting(request));
    }

    @Test
    void testUpdateUserStatus_SelfDeactivationBlocked() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(adminUser));

        UserStatusUpdateRequest statusReq = UserStatusUpdateRequest.builder()
                .isActive(false)
                .build();

        assertThrows(BadRequestException.class, () ->
                settingsService.updateUserStatus(10L, statusReq, "sysadmin"));
    }

    @Test
    void testUpdateUserRoles_Success() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(adminUser));
        when(roleRepository.findByName("ROLE_MANAGER")).thenReturn(Optional.of(managerRole));
        when(roleRepository.findByName("ROLE_ADMIN")).thenReturn(Optional.of(adminRole));
        when(userRepository.save(any(User.class))).thenReturn(adminUser);

        UserRoleUpdateRequest roleReq = UserRoleUpdateRequest.builder()
                .roles(Set.of("ROLE_ADMIN", "ROLE_MANAGER"))
                .build();

        var response = settingsService.updateUserRoles(10L, roleReq, "superadmin");

        assertNotNull(response);
        verify(userRepository, times(1)).save(adminUser);
    }
}

