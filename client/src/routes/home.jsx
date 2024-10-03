import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-2 h-screen w-full items-center justify-center">
        <span>Project SOCRATES</span>
        <Button asChild>
          <Link to={"/map-page"}>Map</Link>
        </Button>
      </div>
    </>
  );
}
