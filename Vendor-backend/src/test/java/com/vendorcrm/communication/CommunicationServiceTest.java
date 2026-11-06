package com.vendorcrm.communication;

import com.vendorcrm.communication.dto.CommunicationRequest;
import com.vendorcrm.communication.dto.CommunicationResponse;
import com.vendorcrm.communication.dto.CommunicationStatusRequest;
import com.vendorcrm.communication.entity.Communication;
import com.vendorcrm.communication.repository.CommunicationRepository;
import com.vendorcrm.communication.service.CommunicationServiceImpl;
import com.vendorcrm.exception.ResourceNotFoundException;
import com.vendorcrm.vendors.entity.Vendor;
import com.vendorcrm.vendors.repository.VendorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommunicationServiceTest {

    @Mock
    private CommunicationRepository communicationRepository;

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private CommunicationServiceImpl communicationService;

    private Vendor vendor;
    private Communication communication;

    @BeforeEach
    void setUp() {
        vendor = Vendor.builder()
                .id(1L)
                .vendorCode("VND-001")
                .companyName("Acme Corp")
                .email("vendor@acme.com")
                .phone("1234567890")
                .status("ACTIVE")
                .build();

        communication = Communication.builder()
                .id(10L)
                .vendor(vendor)
                .subject("Quarterly Review")
                .message("Review meeting discussion")
                .communicationType("MEETING")
                .communicationDate(LocalDateTime.now())
                .communicationStatus("PENDING")
                .createdBy("admin")
                .build();
    }

    @Test
    void testCreateCommunication_Success() {
        CommunicationRequest request = CommunicationRequest.builder()
                .vendorId(1L)
                .subject("Quarterly Review")
                .message("Review meeting discussion")
                .communicationType("MEETING")
                .communicationDate(LocalDateTime.now())
                .communicationStatus("PENDING")
                .build();

        when(vendorRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(communicationRepository.save(any(Communication.class))).thenReturn(communication);

        CommunicationResponse response = communicationService.createCommunication(request, "admin");

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("VND-001", response.getVendorCode());
        assertEquals("Acme Corp", response.getCompanyName());
        assertEquals("Quarterly Review", response.getSubject());
        verify(communicationRepository, times(1)).save(any(Communication.class));
    }

    @Test
    void testCreateCommunication_VendorNotFound() {
        CommunicationRequest request = CommunicationRequest.builder()
                .vendorId(999L)
                .subject("Quarterly Review")
                .message("Review meeting discussion")
                .communicationType("MEETING")
                .communicationDate(LocalDateTime.now())
                .build();

        when(vendorRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                communicationService.createCommunication(request, "admin"));
    }

    @Test
    void testGetCommunicationById_Success() {
        when(communicationRepository.findById(10L)).thenReturn(Optional.of(communication));

        CommunicationResponse response = communicationService.getCommunicationById(10L);

        assertNotNull(response);
        assertEquals("Quarterly Review", response.getSubject());
    }

    @Test
    void testUpdateCommunicationStatus_Success() {
        CommunicationStatusRequest statusRequest = CommunicationStatusRequest.builder()
                .communicationStatus("COMPLETED")
                .remarks("Follow-up completed")
                .build();

        when(communicationRepository.findById(10L)).thenReturn(Optional.of(communication));
        when(communicationRepository.save(any(Communication.class))).thenReturn(communication);

        CommunicationResponse response = communicationService.updateCommunicationStatus(10L, statusRequest);

        assertNotNull(response);
        assertEquals("COMPLETED", response.getCommunicationStatus());
        verify(communicationRepository, times(1)).save(communication);
    }

    @Test
    void testDeleteCommunication_Success() {
        when(communicationRepository.findById(10L)).thenReturn(Optional.of(communication));
        doNothing().when(communicationRepository).delete(communication);

        communicationService.deleteCommunication(10L);

        verify(communicationRepository, times(1)).delete(communication);
    }
}

