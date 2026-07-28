import { useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return {
    isAuthenticated,
    loading,
    setIsAuthenticated,
    setLoading,
  };
}
