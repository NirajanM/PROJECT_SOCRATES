import { useState, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { center, ZOOM_LEVEL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import useGeofencingStore from "@/store/geofencingStore";
import { useParams } from "react-router-dom";

export default function EditGeofencing() {
  const { enumeratorId } = useParams();
  const { geofencing, updateEnumeratorGeofencing } = useGeofencingStore;
  const [mapLayers, setMapLayers] = useState(geofencing || []);
  const mapRef = useRef();

  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latLngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const handleEdited = (e) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).forEach(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id ? { ...l, latLngs: editing.latlngs[0] } : l
        )
      );
    });
  };

  const handleDeleted = (e) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).forEach(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

  const handleSave = async () => {
    try {
      // Update geofencing data in Zustand and API
      await updateEnumeratorGeofencing(enumeratorId, mapLayers);
      console.log("Geofencing data saved successfully.");
    } catch (error) {
      console.error("Error saving geofencing data:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[70vh] w-full">
        <MapContainer
          center={center}
          zoom={ZOOM_LEVEL}
          scrollWheelZoom={true}
          ref={mapRef}
          className="h-full w-full"
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                circle: false,
                circlemarker: false,
                polyline: false,
                rectangle: false,
              }}
            />
          </FeatureGroup>

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
      <pre className="text-left">{JSON.stringify(mapLayers, null, 2)}</pre>
    </div>
  );
}
