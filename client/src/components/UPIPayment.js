import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const UPIPayment = ({ amount, tableNumber, onPaymentDone }) => {
  // Replace this with your actual UPI ID (e.g., 9876543210@paytm or ali@okaxis)
  const upiId = "washim6780@okicici"; 
  const businessName = "Ali Halal Restaurant";

  // This creates the standard UPI link that apps like GPay/PhonePe recognize
  const upiLink = `upi://pay?pa=${upiId}&pn=${businessName}&am=${amount}&cu=INR&tn=Table${tableNumber}Order`;

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '15px', color: '#333' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Scan to Pay with UPI</h3>
      <p style={{ color: '#C8102E', fontWeight: 'bold', fontSize: '1.2rem' }}>Total: ₹{amount}</p>
      
      <div style={{ backgroundColor: 'white', padding: '15px', display: 'inline-block', borderRadius: '10px', border: '2px solid #f4f4f4' }}>
        <QRCodeSVG value={upiLink} size={200} />
      </div>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" width="50" />
      </div>

      <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
        After paying via GPay/PhonePe/Paytm,<br/> click the button below to notify the kitchen.
      </p>

      <button 
        onClick={onPaymentDone}
        style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
      >
        I HAVE PAID ✅
      </button>
    </div>
  );
};

export default UPIPayment;