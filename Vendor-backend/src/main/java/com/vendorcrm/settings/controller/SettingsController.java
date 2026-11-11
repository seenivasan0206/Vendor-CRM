package com.vendorcrm.settings.controller;

import com.vendorcrm.common.ApiResponse;
import com.vendorcrm.common.Constants;
import com.vendorcrm.settings.dto.*;
import com.vendorcrm.settings.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<AppSettingResponse>>> getAllSettings() {
        List<AppSettingResponse> response = settingsService.getAllSettings();
        return ResponseEntity.ok(ApiResponse.success("Application settings retrieved", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<AppSettingResponse>> getSettingById(@PathVariable Long id) {
        AppSettingResponse response = settingsService.getSettingById(id);
        return ResponseEntity.ok(ApiResponse.success("Setting retrieved successfully", response));
    }

    @GetMapping("/key/{settingKey}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<AppSettingResponse>> getSettingByKey(@PathVariable String settingKey) {
        AppSettingResponse response = settingsService.getSettingByKey(settingKey);
        return ResponseEntity.ok(ApiResponse.success("Setting retrieved successfully", response));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppSettingResponse>> createSetting(
            @Valid @RequestBody AppSettingRequest request) {
        AppSettingResponse response = settingsService.createSetting(request);
        return new ResponseEntity<>(ApiResponse.success("Setting created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppSettingResponse>> updateSetting(
            @PathVariable Long id,
            @Valid @RequestBody AppSettingRequest request) {
        AppSettingResponse response = settingsService.updateSetting(id, request);
        return ResponseEntity.ok(ApiResponse.success("Setting updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSetting(@PathVariable Long id) {
        settingsService.deleteSetting(id);
        return ResponseEntity.ok(ApiResponse.success("Setting deleted successfully", null));
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Page<UserAdminResponse>>> getAllUsers(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserAdminResponse> response = settingsService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", response));
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<UserAdminResponse>> getUserById(@PathVariable Long userId) {
        UserAdminResponse response = settingsService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User details retrieved", response));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> response = settingsService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully", response));
    }

    @GetMapping("/users/{userId}/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getUserRoles(@PathVariable Long userId) {
        List<RoleResponse> response = settingsService.getUserRoles(userId);
        return ResponseEntity.ok(ApiResponse.success("User roles retrieved successfully", response));
    }

    @PutMapping("/users/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserAdminResponse>> updateUserRoles(
            @PathVariable Long userId,
            @Valid @RequestBody UserRoleUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserAdminResponse response = settingsService.updateUserRoles(userId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User roles updated successfully", response));
    }

    @PatchMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserAdminResponse>> updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody UserStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserAdminResponse response = settingsService.updateUserStatus(userId, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User account status updated successfully", response));
    }
}

