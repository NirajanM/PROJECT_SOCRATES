import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchData } from "@/utils/api";
import useAuthStore from "@/store/authStore";
import { center, ZOOM_LEVEL } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const createMapPinIcon = (color = "#1d4ed8") => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `;

  return new L.DivIcon({
    html: svgIcon,
    className: "custom-map-pin",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

export default function LiveLocationsMap() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["liveLocations"],
    queryFn: () => fetchData(`/live-locations/${user?.uid}`),
    enabled: !!user?.uid,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        Error: {error.message}
      </div>
    );
  }

  const isEmptyData = !data || data.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => {
                navigate("/");
              }}
              className="cursor-pointer"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => {
                navigate("/dashboard");
              }}
              className="cursor-pointer"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Live Locations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Live Enumerator Locations</h1>
        <Button onClick={handleRefresh} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh Locations
        </Button>
      </div>
      {isEmptyData && (
        <Alert className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Enumerators</AlertTitle>
          <AlertDescription>
            There are currently no active enumerators with location data
            available.
          </AlertDescription>
        </Alert>
      )}
      <div className="bg-white rounded-lg shadow-md my-8">
        <div className="h-[calc(100vh-12rem)] w-full">
          <MapContainer
            center={center}
            zoom={ZOOM_LEVEL}
            className="h-full w-full rounded-md"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!isEmptyData &&
              data.map((enumerator) => (
                <Marker
                  key={enumerator.enumeratorID}
                  position={[enumerator.latitude, enumerator.longitude]}
                  icon={createMapPinIcon()}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">
                        Enumerator Details
                      </h3>
                      <p>
                        <span className="font-semibold">ID:</span>{" "}
                        {enumerator.enumeratorID}
                      </p>
                      <p>
                        <span className="font-semibold">Latitude:</span>{" "}
                        {enumerator.latitude.toFixed(6)}
                      </p>
                      <p>
                        <span className="font-semibold">Longitude:</span>{" "}
                        {enumerator.longitude.toFixed(6)}
                      </p>
                      <p>
                        <span className="font-semibold">Speed:</span>{" "}
                        {enumerator.speed.toFixed(2)} m/s
                      </p>
                      <p>
                        <span className="font-semibold">Heading:</span>{" "}
                        {enumerator.heading.toFixed(2)}°
                      </p>
                      <p>
                        <span className="font-semibold">Accuracy:</span>{" "}
                        {enumerator.accuracy.toFixed(2)} m
                      </p>
                      <p>
                        <span className="font-semibold">Last Updated:</span>{" "}
                        {new Date(enumerator.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
