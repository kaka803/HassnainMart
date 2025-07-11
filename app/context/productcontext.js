'use client';
import { createContext, useContext, useEffect, useState } from 'react';


const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // optional
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/getproducts'); // <-- Update this route if needed
        const data = await res.json();
        if(data.products){

            setProducts(data?.products || []);
            
            
        }
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts, loading, error, count, setCount }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook
export const useProductContext = () => useContext(ProductContext);
