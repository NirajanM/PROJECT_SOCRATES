import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import useGeofencingStore from "@/store/geofencingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Eye, MapPin, MapPinPlus } from "lucide-react";
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
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="w-full max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch enumerator data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Geofencing for {enumeratorId}
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
          <TabsList className="grid w-full grid-cols-2">
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
        <div className="mt-6">
          <Outlet />
        </div>
      </CardContent>
    </Card>
  );
}
