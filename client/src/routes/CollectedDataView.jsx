import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CollectedDataView() {
  const { geofenceId } = useParams();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["collectedData", geofenceId],
    queryFn: () => fetchData(`/collected-data/${geofenceId}`),
    enabled: !!geofenceId,
  });

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    }
    return "Invalid Date";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[600px] w-full" />
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
            Error fetching collected data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No collected data available.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Program ID</TableHead>
            <TableHead>GPA</TableHead>
            <TableHead>Inside Geofence</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.data.name}</TableCell>
              <TableCell>{item.data.studentID}</TableCell>
              <TableCell>{item.data.programID}</TableCell>
              <TableCell>{item.data.gpa}</TableCell>
              <TableCell>{item.isInsideGeofence ? "Yes" : "No"}</TableCell>
              <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
