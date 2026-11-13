import React from 'react';
import '../Styles/Payment.css';

function Payment() {
  return (
    <div className="pay-container">
      <div className="pay-header">
        <h2>Invoices & Payment Records</h2>
        <p>Track vendor bills and payment disbursements.</p>
      </div>

      <table className="pay-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Vendor</th>
            <th>Total Billed</th>
            <th>Paid Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="pay-inv-num">INV-2026-0001</td>
            <td>Tech Supplies Global Pvt Ltd</td>
            <td>₹2,040</td>
            <td>₹1,000</td>
            <td>
              <span className="pay-badge pay-badge-partially_paid">PARTIALLY PAID</span>
            </td>
          </tr>
          <tr>
            <td className="pay-inv-num">INV-2026-0002</td>
            <td>Global Apex Logistics</td>
            <td>₹1,41,600</td>
            <td>₹0</td>
            <td>
              <span className="pay-badge pay-badge-approved">APPROVED</span>
            </td>
          </tr>
          <tr>
            <td className="pay-inv-num">INV-2026-0003</td>
            <td>Tech Supplies Global Pvt Ltd</td>
            <td>₹56,640</td>
            <td>₹56,640</td>
            <td>
              <span className="pay-badge pay-badge-paid">PAID</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Payment;
