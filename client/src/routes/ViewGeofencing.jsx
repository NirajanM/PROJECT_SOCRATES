import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle } from "lucide-react";
import { MapModal } from "@/components/MapModel";

export default function ViewGeofencing() {
  const { enumeratorId } = useParams();
  const [selectedGeofence, setSelectedGeofence] = useState(null);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["geofencing", enumeratorId],
    queryFn: () => fetchData(`/geofencing/${enumeratorId}`),
    enabled: !!enumeratorId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error fetching geofencing data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No geofencing data available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <Accordion type="single" collapsible className="w-full">
        {data.map((geofence, index) => (
          <AccordionItem value={`item-${index}`} key={geofence.id}>
            <AccordionTrigger className="text-lg font-semibold">
              {geofence.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {geofence.id}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(
                    geofence.createdAt._seconds * 1000
                  ).toLocaleString()}
                </p>
                <div>
                  <strong>Area Coordinates:</strong>
                  <ul className="list-disc list-inside pl-4">
                    {geofence.area.map((coord, idx) => (
                      <li key={idx}>
                        Lat: {coord._latitude.toFixed(6)}, Lng:{" "}
                        {coord._longitude.toFixed(6)}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => setSelectedGeofence(geofence)}
                  className="mt-2"
                >
                  View on Map
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <MapModal
        isOpen={!!selectedGeofence}
        onClose={() => setSelectedGeofence(null)}
        geofence={selectedGeofence}
      />
    </div>
  );
}