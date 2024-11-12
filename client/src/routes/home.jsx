import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Download, Users, ClipboardCheck } from "lucide-react";

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-b from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center gap-6 md:gap-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Welcome !
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl text-muted-foreground">
            We are here to revolutionize census data collection and management
            for a smarter future
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-sm sm:text-base">
              <Link to="/dashboard">Access Supervisor Dashboard</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-sm sm:text-base"
            >
              <a
                href="https://github.com/your-repo/socrates-numerator-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Download
                Enumerator App
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center gap-8 md:gap-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary">
            Features We Provide:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<MapPin className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
              title="Geolocation Assignments"
              description="Easily assign and manage geolocation areas for enumerators"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 md:h-10 md:w-10 text-primary" />}
              title="Enumerator Management"
              description="Efficiently create, edit, and update enumerator profiles"
            />
            <FeatureCard
              icon={
                <ClipboardCheck className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              }
              title="Data Oversight"
              description="Monitor and review census data collected by enumerators"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 md:p-6 shadow-lg flex flex-col items-center">
      <div className="mb-3 md:mb-4">{icon}</div>
      <h2 className="text-lg md:text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm md:text-base text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
