package com.vendorcrm.auth.service;

import com.vendorcrm.auth.dto.ChangePasswordRequest;
import com.vendorcrm.auth.dto.LoginRequest;
import com.vendorcrm.auth.dto.LoginResponse;
import com.vendorcrm.auth.dto.RegisterRequest;
import com.vendorcrm.auth.entity.User;
import com.vendorcrm.common.ApiResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    ApiResponse<String> register(RegisterRequest request);

    ApiResponse<String> changePassword(String currentUsername, ChangePasswordRequest request);

    User getCurrentUser();
}

