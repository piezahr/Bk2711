import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Character } from "@/types/project";
import { User } from "lucide-react";

interface CharacterPanelProps {
  characters: Character[];
}

export const CharacterPanel = ({ characters }: CharacterPanelProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'main': return 'default';
      case 'supporting': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'main': return 'Hauptfigur';
      case 'supporting': return 'Nebenfigur';
      default: return 'Randfigur';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Charaktere</h3>
        <p className="text-sm text-muted-foreground">
          Automatisch erkannte und verwaltete Charaktere
        </p>
      </div>

      {characters.length === 0 ? (
        <Card className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Noch keine Charaktere erkannt. Beginnen Sie mit dem Schreiben, und die KI wird automatisch Charaktere identifizieren.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {characters.map((character) => (
            <Card key={character.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-base">{character.name}</h4>
                    {character.age && (
                      <p className="text-sm text-muted-foreground">{character.age}</p>
                    )}
                  </div>
                  <Badge variant={getRoleBadgeVariant(character.role)}>
                    {getRoleLabel(character.role)}
                  </Badge>
                </div>

                {character.appearance && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Aussehen</p>
                    <p className="text-sm">{character.appearance}</p>
                  </div>
                )}

                {character.personality && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Persönlichkeit</p>
                    <p className="text-sm">{character.personality}</p>
                  </div>
                )}

                {character.locations.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Orte</p>
                    <div className="flex flex-wrap gap-1">
                      {character.locations.map((loc, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  {character.mentions} Erwähnungen
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
