import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import { center, ZOOM_LEVEL } from "@/lib/constants";
import { useRef, useState } from "react";

export default function MapPage() {
  const [mapLayer, setMapLayer] = useState([]);
  const mapRef = useRef();
  const handleCreated = (e) => {
    const { layerType, layer } = e;
    console.log(layer.getLatLngs()[0]);
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setMapLayer((layers) => [
        ...layers,
        { id: _leaflet_id, latLngs: layer.getLatLngs()[0] },
      ]);
    }
  };
  // const handleEdited = (e) => {
  //   console.log(e);
  // };
  // const handleDeleted = (e) => {
  //   console.log(e);
  // };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <div className="h-[70vh] w-[70vw]">
        <MapContainer
          center={center}
          zoom={ZOOM_LEVEL}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              // onEdited={handleEdited}
              // onDeleted={handleDeleted}
              draw={{
                circle: false,
                circlemarker: false,
                polyline: false,
                rectangle: false,
              }}
            />
          </FeatureGroup>

          {/* important for map to work, donot delete */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* important for map to work, donot delete */}
        </MapContainer>
        <pre className="text-left">{JSON.stringify(mapLayer, 0, 2)}</pre>
      </div>
    </div>
  );
}
