import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@home-asphere/shared/constants";

export function useListings(filters?: { city?: string; minPrice?: number; maxPrice?: number }) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.city) params.append("city", filters.city);
      if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
      if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));

      const res = await fetch(`${API_BASE_URL}/listings/search?${params}`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      return data.data.listings;
    },
  });
}
