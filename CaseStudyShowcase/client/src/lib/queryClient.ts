import { QueryClient, QueryFunction, QueryKey } from "@tanstack/react-query";
import { apiClient } from "./api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Use our Firebase-authenticated API client
  let result;
  
  switch (method.toUpperCase()) {
    case 'POST':
      result = await apiClient.post(url, data);
      break;
    case 'PATCH':
      result = await apiClient.patch(url, data);
      break;
    case 'DELETE':
      result = await apiClient.delete(url);
      break;
    default:
      result = await apiClient.get(url);
  }
  
  // Return a Response-like object for compatibility
  return new Response(JSON.stringify(result), { status: 200 });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <TData>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<TData> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }: { queryKey: QueryKey }) => {
    try {
      const url = queryKey.join("/") as string;
      return await apiClient.get<TData>(url);
    } catch (error: any) {
      if (unauthorizedBehavior === "returnNull" && error.message?.includes('401')) {
        return null as TData;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
