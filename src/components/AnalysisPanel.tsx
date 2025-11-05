import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalysisIssue } from "@/types/project";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";

interface AnalysisPanelProps {
  issues: AnalysisIssue[];
  onIssueClick: (issue: AnalysisIssue) => void;
  onDeleteIssue: (issueId: string) => void;
}

export const AnalysisPanel = ({ issues, onIssueClick, onDeleteIssue }: AnalysisPanelProps) => {
  const getIssueIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Info className="h-4 w-4 text-accent" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      default: return 'Niedrig';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contradiction': return 'Widerspruch';
      case 'logic': return 'Logikfehler';
      case 'style': return 'Stilbruch';
      case 'character': return 'Charakter';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Textanalyse</h3>
        <p className="text-sm text-muted-foreground">
          KI-erkannte Probleme und Hinweise
        </p>
      </div>

      {issues.length === 0 ? (
        <Card className="p-6 text-center">
          <Info className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Keine Probleme gefunden. Klicken Sie auf "Textanalyse" in der Navigation, um Ihren Text zu analysieren.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <Card 
              key={issue.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => onIssueClick(issue)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteIssue(issue.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="space-y-2 pr-6">
                <div className="flex items-start gap-2">
                  {getIssueIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(issue.type)}
                      </Badge>
                      <Badge variant={getSeverityBadgeVariant(issue.severity)} className="text-xs">
                        {getSeverityLabel(issue.severity)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Vorschlag: {issue.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
