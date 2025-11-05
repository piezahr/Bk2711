import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Plus, FolderOpen } from "lucide-react";

interface StartScreenProps {
  onNewProject: () => void;
  onOpenProject: (projectId: string) => void;
  recentProjects: Array<{ id: string; title: string; lastModified: Date }>;
}

export const StartScreen = ({ onNewProject, onOpenProject, recentProjects }: StartScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Buchschreiber KI
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ihre kreative Schreibumgebung mit KI-Unterstützung für automatische Textanalyse, Charakterverwaltung und intelligente Schreibhilfe
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-lg transition-all border-2 hover:border-primary cursor-pointer group" onClick={onNewProject}>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Neues Projekt</h3>
                <p className="text-muted-foreground">
                  Starten Sie ein neues Buchprojekt mit KI-Unterstützung
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all border-2 hover:border-accent cursor-pointer group">
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <FolderOpen className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Projekt öffnen</h3>
                <p className="text-muted-foreground">
                  Laden Sie ein bestehendes Projekt aus Ihren Dateien
                </p>
              </div>
            </div>
          </Card>
        </div>

        {recentProjects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Zuletzt bearbeitet</h2>
            <div className="grid gap-3">
              {recentProjects.map((project) => (
                <Card
                  key={project.id}
                  className="p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary"
                  onClick={() => onOpenProject(project.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Zuletzt bearbeitet: {new Date(project.lastModified).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
