import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Listing, InsertListing } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type ListingsFilters = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
};

export function useListings(filters?: ListingsFilters) {
  return useQuery({
    queryKey: [api.listings.list.path, filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters?.city) searchParams.set("city", filters.city);
      if (filters?.minPrice) searchParams.set("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice) searchParams.set("maxPrice", filters.maxPrice.toString());
      
      const queryString = searchParams.toString();
      const url = `${api.listings.list.path}${queryString ? `?${queryString}` : ""}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch listings");
      
      const data = await res.json();
      return api.listings.list.responses[200].parse(data);
    },
  });
}

export function useListing(id: number) {
  return useQuery({
    queryKey: [api.listings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.listings.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch listing");
      
      const data = await res.json();
      return api.listings.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertListing) => {
      const res = await fetch(api.listings.create.path, {
        method: api.listings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create listing");
      }
      
      return api.listings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      toast({
        title: "Success",
        description: "Your listing has been created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
