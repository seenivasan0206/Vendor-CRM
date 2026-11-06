package com.vendorcrm.settings.dto;

import com.vendorcrm.auth.entity.Role;
import com.vendorcrm.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Boolean isActive;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserAdminResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }

        Set<String> roleNames = user.getRoles() != null ?
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()) : Set.of();

        return UserAdminResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .isActive(user.getIsActive())
                .roles(roleNames)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

