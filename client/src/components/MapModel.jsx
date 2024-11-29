import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { center, ZOOM_LEVEL } from "@/lib/constants";

export function MapModal({ isOpen, onClose, geofence }) {
  if (!geofence) return null;

  const polygonCenter = geofence.area.reduce(
    (acc, coord) => [
      acc[0] + coord.lat / geofence.area.length,
      acc[1] + coord.lng / geofence.area.length,
    ],
    [0, 0]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{geofence.name} - Map View</DialogTitle>
        </DialogHeader>
        <div className="h-[500px] w-full">
          <MapContainer
            center={polygonCenter}
            zoom={ZOOM_LEVEL}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polygon positions={geofence.area} />
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
