import React, { useState } from 'react';

const Cart = ({ cartItems, tableNumber, clearCart }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const API_BASE_URL = "https://ali-halal-backend.onrender.com";

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (cartItems.length === 0) return;

    setIsOrdering(true);

    const orderData = {
      phoneNumber,
      tableNumber: tableNumber || "1",
      items: cartItems.map(item => ({
        itemName: item.itemName || item.name, // Support both naming conventions
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: calculateTotal(),
      paymentMethod: "Cash"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Order Placed! ✅");
        clearCart();
        setPhoneNumber('');
      } else {
        alert("Failed to send order. Try again.");
      }
    } catch (error) {
      alert("Server error. Check internet.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
      <h3>Table {tableNumber}</h3>
      {cartItems.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{item.itemName || item.name} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}
      <h4>Total: ₹{calculateTotal()}</h4>
      <input 
        type="text" placeholder="Phone Number" 
        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />
      <button onClick={handlePlaceOrder} disabled={isOrdering} style={{ width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
        {isOrdering ? "Sending..." : "PLACE ORDER ✅"}
      </button>
    </div>
  );
};

export default Cart;