import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Get the authentication token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// API request function with authentication
export const apiRequest = async (
  method: string,
  endpoint: string,
  body?: unknown
) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  // Add auth token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  
  if (!response.ok) {
    // Check if unauthorized and remove token
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    
    // Parse error message
    let errorMessage = "Something went wrong";
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      // If error is not JSON, use status text
      errorMessage = response.statusText;
    }
    
    throw new Error(errorMessage);
  }
  
  return response;
};

// Get query function creator
export const getQueryFn = ({
  on401 = "throw",
}: {
  on401?: "throw" | "returnNull";
} = {}) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const endpoint = queryKey[0];
    
    try {
      const res = await apiRequest("GET", endpoint);
      
      // For empty responses (like 204 No Content)
      if (res.status === 204) {
        return null;
      }
      
      return await res.json();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Unauthorized") &&
        on401 === "returnNull"
      ) {
        return null;
      }
      throw error;
    }
  };
};
