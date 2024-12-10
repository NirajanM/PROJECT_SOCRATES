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

  const getCurrentMode = () => {
    if (location.pathname.endsWith("/view")) return "view";
    if (location.pathname.endsWith("/edit")) return "edit";
    if (location.pathname.includes("/collected-data")) return "collected-data";
    return "view"; // Default to view if no match
  };

  const isCollectedDataRoute = getCurrentMode() === "collected-data";

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
              className="cursor-pointer"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => {
                navigate(`/enumerators/${enumeratorId}/geofencing/view`);
              }}
            >
              Enumerator Geofencing
            </BreadcrumbLink>
          </BreadcrumbItem>
          {isCollectedDataRoute && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Collected Data</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            {isCollectedDataRoute ? "Collected Data" : "Geofencing data"} for
            Enumerator {enumeratorId}
          </h1>
        </div>
        <p className="text-muted-foreground py-2">
          {isCollectedDataRoute
            ? "View collected data for this enumerator"
            : "Manage and view geofencing data for this enumerator"}
        </p>
        {!isCollectedDataRoute && (
          <Tabs
            value={getCurrentMode()}
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
        )}
        <Outlet />
      </div>
    </div>
  );
}
