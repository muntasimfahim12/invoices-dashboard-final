/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("vault_token");
      const email = localStorage.getItem("user_email");
      const role = localStorage.getItem("user_role");
      const name = localStorage.getItem("user_name");

      // রিফ্রেশ দিলে এই অংশটি সেশন রিকভার করবে
      if (token && email) {
        setUser({ email, role, name, token });
        
        // লগইন করা থাকলে লগইন পেজে যেতে দিবে না
        if (pathname === "/login") {
          router.replace(role === "admin" ? "/admin" : "/client/overview");
        }
      } 
      // টোকেন না থাকলে লগইন পেজে পাঠিয়ে দিবে
      else if (pathname !== "/login") {
        router.replace("/login");
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-white">
           <div className="w-10 h-10 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);