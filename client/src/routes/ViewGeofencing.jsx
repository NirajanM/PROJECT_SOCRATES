import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { center, ZOOM_LEVEL } from "@/lib/constants";
import useGeofencingStore from "@/store/geofencingStore";

export default function ViewGeofencing() {
  const { geofencing } = useGeofencingStore();

  if (!geofencing) {
    return <div>No geofencing data available.</div>;
  }

  return (
    <div className="h-[70vh] w-full">
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
        {geofencing.map((polygon, index) => (
          <Polygon key={index} positions={polygon} />
        ))}
      </MapContainer>
    </div>
  );
}
