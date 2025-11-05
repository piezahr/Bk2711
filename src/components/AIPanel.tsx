import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb } from "lucide-react";

export const AIPanel = () => {
  const suggestions = [
    {
      id: '1',
      title: 'Dialogvorschlag',
      description: 'Fügen Sie einen Dialog zwischen den Hauptcharakteren hinzu, um die Spannung zu erhöhen.',
      type: 'dialog'
    },
    {
      id: '2',
      title: 'Szenenidee',
      description: 'Eine Rückblende könnte die Motivation der Hauptfigur verdeutlichen.',
      type: 'scene'
    },
    {
      id: '3',
      title: 'Plotentwicklung',
      description: 'Erwägen Sie einen unerwarteten Wendepunkt in diesem Kapitel.',
      type: 'plot'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">KI-Vorschläge</h3>
        <p className="text-sm text-muted-foreground">
          Kreative Ideen und Verbesserungsvorschläge
        </p>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-ai-highlight flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                Anwenden
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-ai-highlight/5 border-ai-highlight/20">
        <div className="flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-ai-highlight flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Tipp</p>
            <p className="text-muted-foreground">
              Markieren Sie Text im Editor und nutzen Sie "Mit KI bearbeiten" für kontextbezogene Vorschläge.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
