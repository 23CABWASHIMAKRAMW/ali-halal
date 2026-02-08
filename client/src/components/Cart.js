import React, { useState } from 'react';

const Cart = ({ cartItems, tableNumber, clearCart }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  // Replace this with your actual Render backend URL
  const API_BASE_URL = "https://ali-halal-backend.onrender.com";

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    // 1. Validation
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsOrdering(true);

    // 2. Prepare Data (Matching the schema we built)
    const orderData = {
      phoneNumber: phoneNumber,
      tableNumber: tableNumber || "1", // Defaults to 1 if not set
      items: cartItems.map(item => ({
        itemName: item.itemName,
        price: item.price,
        quantity: item.quantity // Important for "Mango Lassi - 2" logic
      })),
      totalAmount: calculateTotal(),
      paymentMethod: "Cash",
      status: "Pending"
    };

    try {
      // 3. Send to MongoDB via Backend
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Order Saved:", result);
        alert("Order Placed Successfully! ✅");
        clearCart(); // Clear the UI cart
        setPhoneNumber(''); // Reset phone field
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Could not connect to server. Please check your internet.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', color: '#333' }}>
      <h2>Your Cart (Table {tableNumber})</h2>
      
      {cartItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #eee' }}>
          <span>{item.itemName} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Total Amount: ₹{calculateTotal()}
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number:</label>
        <input 
          type="text" 
          placeholder="Enter Mobile Number" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '15px' }}
        />
        
        <button 
          onClick={handlePlaceOrder}
          disabled={isOrdering}
          style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: isOrdering ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          {isOrdering ? "SENDING ORDER..." : "PLACE ORDER ✅"}
        </button>
      </div>
    </div>
  );
};

export default Cart;