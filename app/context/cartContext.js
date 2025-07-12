'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './authContext';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setcart] = useState([])
    const [loading, setloading] = useState(false)
    const {user} = useAuthContext()
  const fetchCart = async (email) => {
  try {
    setloading(true)
    const res = await fetch("/api/getCart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email
    }),
  });

  const data = await res.json()
  if(data){
    
    
    setcart(data.cart)
    setloading(false)
  }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

useEffect(() => {
  console.log('user ',user?.email);
  
    fetchCart(user?.email);

  }, [user])




const updateCartQuantity = async (userEmail, productId, newQuantity) => {
  try {
    const res = await fetch('/api/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail,
        productId,
        quantity: newQuantity
      }),
    });

    const data = await res.json();

    if (data.success) {
      fetchCart(userEmail); 
    } else {
      console.error("Update failed:", data.message);
    }
  } catch (error) {
    console.error("Error updating cart:", error);
  }
};



  
  

  return (
    <CartContext.Provider value={{fetchCart, cart, updateCartQuantity, loading}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);