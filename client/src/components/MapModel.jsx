import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import { fetchData } from "@/utils/api";
import "leaflet/dist/leaflet.css";
import { center, ZOOM_LEVEL } from "@/lib/constants";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon for Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Default size for Leaflet marker
  iconAnchor: [12, 41], // Point of the icon that should correspond to the marker's location
  popupAnchor: [1, -34], // Point where the popup should open relative to the iconAnchor
});

L.Marker.prototype.options.icon = DefaultIcon;

export function MapModal({ isOpen, onClose, geofence }) {
  const [showMarkers, setShowMarkers] = useState(true);

  const { data: collectedData } = useQuery({
    queryKey: ["collectedData", geofence?.id],
    queryFn: () => fetchData(`/collected-data/${geofence?.id}`),
    enabled: !!isOpen && !!geofence?.id,
  });

  if (!isOpen || !geofence) return null;

  const areaCoordinates = geofence.area.map((point) => [
    point._latitude,
    point._longitude,
  ]);

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    }
    return "Invalid Date";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{geofence.name || "Geofence"} - Map View</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="show-markers"
            checked={showMarkers}
            onCheckedChange={setShowMarkers}
          />
          <label
            htmlFor="show-markers"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show Collected Data Markers
          </label>
        </div>
        <div className="h-[500px] w-full">
          <MapContainer
            center={center}
            zoom={ZOOM_LEVEL}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polygon positions={areaCoordinates} />
            {showMarkers &&
              collectedData &&
              collectedData.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.location.latitude, item.location.longitude]}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{item.data.name}</h3>
                      <p>Student ID: {item.data.studentID}</p>
                      <p>Program ID: {item.data.programID}</p>
                      <p>GPA: {item.data.gpa}</p>
                      <p>
                        Inside Geofence: {item.isInsideGeofence ? "Yes" : "No"}
                      </p>
                      <p>Timestamp: {formatTimestamp(item.timestamp)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
