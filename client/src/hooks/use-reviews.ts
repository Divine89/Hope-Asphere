import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertReview } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useReviews(listingId: number) {
  return useQuery({
    queryKey: [api.reviews.listByListing.path, listingId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.listByListing.path, { listingId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      
      const data = await res.json();
      return api.reviews.listByListing.responses[200].parse(data);
    },
    enabled: !!listingId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ listingId, data }: { listingId: number, data: Omit<InsertReview, "listingId" | "guestId"> }) => {
      const url = buildUrl(api.reviews.create.path, { listingId });
      const res = await fetch(url, {
        method: api.reviews.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit review");
      }
      
      return api.reviews.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.listByListing.path, variables.listingId] });
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your experience!",
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
