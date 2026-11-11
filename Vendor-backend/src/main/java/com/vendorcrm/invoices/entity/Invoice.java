package com.vendorcrm.invoices.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vendorcrm.common.BaseEntity;
import com.vendorcrm.purchaseorder.entity.PurchaseOrder;
import com.vendorcrm.vendors.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", length = 50, nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Builder.Default
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "tax_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "total_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "paid_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Builder.Default
    @Column(length = 30, nullable = false)
    private String status = "DRAFT"; // DRAFT, PENDING_APPROVAL, APPROVED, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<InvoiceItem> items = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Payment> payments = new ArrayList<>();

    public void addItem(InvoiceItem item) {
        items.add(item);
        item.setInvoice(this);
    }

    public void removeItem(InvoiceItem item) {
        items.remove(item);
        item.setInvoice(null);
    }

    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setInvoice(this);
        if ("COMPLETED".equalsIgnoreCase(payment.getStatus())) {
            this.paidAmount = (this.paidAmount != null ? this.paidAmount : BigDecimal.ZERO).add(payment.getAmount());
            updatePaymentStatus();
        }
    }

    public BigDecimal getRemainingBalance() {
        BigDecimal total = this.totalAmount != null ? this.totalAmount : BigDecimal.ZERO;
        BigDecimal paid = this.paidAmount != null ? this.paidAmount : BigDecimal.ZERO;
        return total.subtract(paid);
    }

    public void updatePaymentStatus() {
        BigDecimal total = this.totalAmount != null ? this.totalAmount : BigDecimal.ZERO;
        BigDecimal paid = this.paidAmount != null ? this.paidAmount : BigDecimal.ZERO;

        if (paid.compareTo(BigDecimal.ZERO) > 0) {
            if (paid.compareTo(total) >= 0) {
                this.status = "PAID";
            } else {
                this.status = "PARTIALLY_PAID";
            }
        }
    }
}

