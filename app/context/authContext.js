'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const authContext = createContext();

export const AuthProvider = ({ children }) => {


    const [user, setuser] = useState(null)
  const [authLoading, setauthLoading] = useState(false)
  const router = useRouter()
  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    setauthLoading(true)
      const res = await fetch("/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    

  const data =  await res.json();
  
  if(data.error){
    alert('first login to access this page')
    router.push('/login')
  }
  setuser(data.user)
  setauthLoading(false)
    }

  
  

  return (
    <authContext.Provider value={{fetchUser, user, setuser, authLoading}}>
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => useContext(authContext);