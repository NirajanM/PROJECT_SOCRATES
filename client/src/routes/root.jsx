import LayoutWithSidebar from "@/components/layouts/sidebar";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <LayoutWithSidebar>
      <Outlet />{" "}
      {/* This will render child routes like HomePage, MapPage, etc. */}
    </LayoutWithSidebar>
  );
}
