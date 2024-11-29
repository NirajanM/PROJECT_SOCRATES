import { useState, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { center, ZOOM_LEVEL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@/utils/api";
import useGeofencingStore from "@/store/geofencingStore";
import { Save } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export default function EditGeofencing() {
  const { enumeratorId } = useParams();
  const navigate = useNavigate();
  const { setGeofencing } = useGeofencingStore();
  const {
    user: { uid },
  } = useAuthStore();
  const queryClient = useQueryClient();

  const [mapLayers, setMapLayers] = useState([]);
  const [geofencingName, setGeofencingName] = useState("");
  const [error, setError] = useState("");
  const mapRef = useRef();

  const updateGeofencingMutation = useMutation({
    mutationFn: (geofencingData) =>
      postData(`/geofencing/${enumeratorId}/${uid}`, geofencingData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["geofencing", enumeratorId]);
      setGeofencing(data);
      setError("");
      setGeofencingName("");
      setMapLayers([]);
      console.log("Geofencing data saved successfully.");
      navigate(`/enumerators/${enumeratorId}/geofencing/view`);
    },
    onError: (error) => {
      setError(`Error saving geofencing data: ${error.message}`);
    },
  });

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
    if (!geofencingName.trim()) {
      setError("Please enter a name for the geofencing area.");
      return;
    }

    if (mapLayers.length === 0) {
      setError("Please draw at least one geofencing area on the map.");
      return;
    }

    const geofencingData = {
      name: geofencingName,
      area: mapLayers[0].latLngs.map((coord) => ({
        lat: coord.lat,
        lng: coord.lng,
      })),
    };

    updateGeofencingMutation.mutate(geofencingData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end space-x-4">
        <div className="flex-grow">
          <Label htmlFor="geofencing-name" className="text-lg font-semibold">
            Geofencing Name
          </Label>
          <Input
            id="geofencing-name"
            value={geofencingName}
            onChange={(e) => setGeofencingName(e.target.value)}
            placeholder="Enter geofencing area name"
            className="mt-1"
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={
            mapLayers.length === 0 ||
            !geofencingName.trim() ||
            updateGeofencingMutation.isLoading
          }
          className="flex-shrink-0"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateGeofencingMutation.isLoading ? "Saving..." : "Save Geofencing"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="h-[750px] w-full border rounded-lg overflow-hidden">
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

      {/* {mapLayers.length > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Drawn Geofencing Areas</h3>
          <pre className="text-sm overflow-auto max-h-40">
            {JSON.stringify(mapLayers, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
}
