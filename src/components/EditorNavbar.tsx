import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, FileSearch, Plus, Eye, Download, Home } from "lucide-react";

interface EditorNavbarProps {
  projectTitle: string;
  onAnalyze: () => void;
  onAISuggestion: () => void;
  onAddChapter: () => void;
  onToggleReadMode: () => void;
  onExport: () => void;
  onBackToStart: () => void;
  isReadMode: boolean;
}

export const EditorNavbar = ({
  projectTitle,
  onAnalyze,
  onAISuggestion,
  onAddChapter,
  onToggleReadMode,
  onExport,
  onBackToStart,
  isReadMode
}: EditorNavbarProps) => {
  return (
    <nav className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBackToStart}>
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">{projectTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isReadMode && (
            <>
              <Button variant="outline" size="sm" onClick={onAnalyze} className="gap-2">
                <FileSearch className="h-4 w-4" />
                Textanalyse
              </Button>
              <Button variant="outline" size="sm" onClick={onAISuggestion} className="gap-2">
                <Sparkles className="h-4 w-4" />
                KI-Vorschlag
              </Button>
              <Button variant="outline" size="sm" onClick={onAddChapter} className="gap-2">
                <Plus className="h-4 w-4" />
                Kapitel
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={onToggleReadMode} className="gap-2">
            <Eye className="h-4 w-4" />
            {isReadMode ? 'Bearbeiten' : 'Lesemodus'}
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </nav>
  );
};
