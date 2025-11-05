import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Location } from "@/types/project";
import { MapPin } from "lucide-react";

interface LocationPanelProps {
  locations: Location[];
}

export const LocationPanel = ({ locations }: LocationPanelProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Orte & Schauplätze</h3>
        <p className="text-sm text-muted-foreground">
          Automatisch erkannte Schauplätze Ihrer Geschichte
        </p>
      </div>

      {locations.length === 0 ? (
        <Card className="p-6 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Noch keine Orte erkannt. Die KI wird automatisch Schauplätze identifizieren, während Sie schreiben.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {locations.map((location) => (
            <Card key={location.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{location.name}</h4>
                    {location.description && (
                      <p className="text-sm text-muted-foreground mt-1">{location.description}</p>
                    )}
                  </div>
                </div>

                {location.characters.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Verbundene Charaktere</p>
                    <div className="flex flex-wrap gap-1">
                      {location.characters.map((char, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
