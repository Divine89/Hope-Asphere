import { Card } from "@/components/ui/card";

export default function ListingDetails() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-4">Listing Details</h1>
        <p className="text-gray-600">Loading listing details...</p>
      </Card>
    </div>
  );
}
