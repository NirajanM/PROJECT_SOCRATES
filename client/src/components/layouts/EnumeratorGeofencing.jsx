import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MapPinIcon as MapPinPlus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EnumeratorGeofencing() {
  const { enumeratorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleModeChange = (value) => {
    navigate(`/enumerators/${enumeratorId}/geofencing/${value}`);
  };

  const isViewMode = location.pathname.endsWith("/view");

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Enumerator Geofencing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            Geofencing data for Enumerator {enumeratorId}
          </h1>
        </div>
        <p className="text-muted-foreground py-2">
          Manage and view geofencing data for this enumerator
        </p>
        <Tabs
          value={isViewMode ? "view" : "edit"}
          onValueChange={handleModeChange}
          className="w-full py-6"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="view" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Assigned Geofences
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center">
              <MapPinPlus className="mr-2 h-4 w-4" />
              Assign New Geofence
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Outlet />
      </div>
    </div>
  );
}
