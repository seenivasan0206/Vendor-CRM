package com.vendorcrm.settings.dto;

import com.vendorcrm.auth.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {

    private Long id;
    private String name;
    private String description;

    public static RoleResponse fromEntity(Role role) {
        if (role == null) {
            return null;
        }
        String desc;
        switch (role.getName()) {
            case "ROLE_ADMIN":
                desc = "Full administrative access to all modules and configurations";
                break;
            case "ROLE_MANAGER":
                desc = "Managerial access to vendors, purchase orders, contracts, and analytics";
                break;
            case "ROLE_STAFF":
                desc = "Staff access for creating communications and processing orders";
                break;
            case "ROLE_VENDOR":
                desc = "Vendor portal access for assigned vendor interactions";
                break;
            default:
                desc = "Standard system role";
        }

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(desc)
                .build();
    }
}

