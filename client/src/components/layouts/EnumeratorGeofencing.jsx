import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import useGeofencingStore from "@/store/geofencingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Eye,
  MapPin,
  MapPinIcon as MapPinPlus,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EnumeratorGeofencing() {
  const { enumeratorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setGeofencing } = useGeofencingStore();

  const isViewMode = location.pathname.endsWith("/view");

  const { isLoading, isError, error } = useQuery({
    queryKey: ["geofencing", enumeratorId],
    queryFn: () => fetchData(`/geofencing/${enumeratorId}`),
    enabled: !!enumeratorId,
    onSuccess: (data) => {
      setGeofencing(data);
    },
  });

  const handleModeChange = (value) => {
    navigate(`/enumerators/${enumeratorId}/geofencing/${value}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[600px] w-full" />
          </CardContent>
        </Card>
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
            Failed to fetch enumerator data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Geofencing for Enumerator {enumeratorId}
            </CardTitle>
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Manage and view geofencing data for this enumerator
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={isViewMode ? "view" : "edit"}
            onValueChange={handleModeChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="view" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View Mode
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center">
                <MapPinPlus className="mr-2 h-4 w-4" />
                Assign New Geofence
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
