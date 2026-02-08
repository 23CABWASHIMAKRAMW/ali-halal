import React, { useEffect, useState } from 'react';
import ReviewForm from './ReviewForm';
import UPIPayment from './UPIPayment';

const Menu = ({ session }) => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showUPI, setShowUPI] = useState(false);

  const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : "https://ali-halal-backend.onrender.com";

 useEffect(() => {
  fetch("https://ali-halal-backend.onrender.com/api/items")
    .then(res => res.json())
    .then(data => setMenuItems(data))
    .catch(err => console.error("Menu Load Error:", err));
}, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const submitOrderToDatabase = () => {
    const orderData = {
      phoneNumber: session.phone,
      tableNumber: String(session.table),
      items: cart.map(item => ({ itemName: item.itemName, price: item.price })),
      totalAmount: Number(totalPrice),
      paymentMethod: paymentMethod
    };

    fetch(`${API_URL}/api/orders/place`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    .then(() => {
      setOrderConfirmed(true);
      setCart([]);
    })
    .catch(err => alert("Error: " + err.message));
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'Online') {
      setShowUPI(true);
    } else {
      submitOrderToDatabase();
    }
  };

  const callWaiter = () => {
    fetch(`${API_URL}/api/requests/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableNumber: session.table }) 
    }).then(() => alert("🔔 Waiter notified for Table " + session.table));
  };

  if (orderConfirmed) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fdf2e9', minHeight: '100vh' }}>
        <h1 style={{ color: '#C8102E' }}>SHUKRAN!</h1>
        <p>Order received. Please wait at your table.</p>
        <div style={{ maxWidth: '400px', margin: '20px auto' }}><ReviewForm /></div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '150px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#C8102E', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>ALI HALAL</h1>
        <p>TABLE {session.table}</p>
        <button onClick={callWaiter} style={{ backgroundColor: '#F4A300', border: 'none', padding: '10px', borderRadius: '20px', fontWeight: 'bold' }}>🔔 CALL WAITER</button>
      </header>

      {showUPI && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ width: '90%', maxWidth: '350px' }}>
            <UPIPayment 
              amount={totalPrice} 
              tableNumber={session.table} 
              onPaymentDone={() => {
                setShowUPI(false);
                submitOrderToDatabase();
              }} 
            />
            <button onClick={() => setShowUPI(false)} style={{ color: 'white', background: 'none', border: 'none', marginTop: '15px', width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ padding: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading delicious menu...</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No items found in database.</p>
        ) : (
          items.map(item => (
            <div key={item._id} style={{ background: 'white', padding: '15px', marginBottom: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div>
                  <h3 style={{ margin: 0, color: '#1A2332' }}>{item.itemName}</h3>
                  <p style={{ color: '#777', margin: '5px 0' }}>₹{item.price}</p>
                  {item.description && <p style={{ fontSize: '0.8rem', color: '#999' }}>{item.description}</p>}
              </div>
              <button onClick={() => setCart([...cart, item])} style={{ backgroundColor: '#1A2332', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer' }}>ADD +</button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: 'white', padding: '20px', boxShadow: '0 -5px 15px rgba(0,0,0,0.1)', borderTop: '2px solid #C8102E', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: '10px' }}>
               <strong>Payment: </strong>
               <input type="radio" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} /> Cash 
               <input type="radio" style={{marginLeft: '15px'}} checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} /> Online
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: ₹{totalPrice}</span>
            <button onClick={handlePlaceOrder} style={{ backgroundColor: '#C8102E', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>PLACE ORDER →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;