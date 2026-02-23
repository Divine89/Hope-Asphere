import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { API_BASE_URL } from "@home-asphere/shared/constants";
import { AuthUser, AuthToken } from "@home-asphere/shared/types";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      return data.data;
    },
    enabled: !!token,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    },
    onSuccess: (data) => {
      setToken(data.data.token);
      localStorage.setItem("token", data.data.token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (formData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: "guest" | "host";
    }) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    },
    onSuccess: (data) => {
      setToken(data.data.token);
      localStorage.setItem("token", data.data.token);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return {
    user: user as AuthUser | null,
    token,
    isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
