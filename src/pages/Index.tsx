import { useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { EditorNavbar } from "@/components/EditorNavbar";
import { TextEditor } from "@/components/TextEditor";
import { Sidebar } from "@/components/Sidebar";
import { ReadingMode } from "@/components/ReadingMode";
import { Project, Chapter, Character, Location, AnalysisIssue } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState<string>('');
  const [isReadMode, setIsReadMode] = useState(false);

  // Mock recent projects
  const recentProjects = [
    {
      id: '1',
      title: 'Die vergessene Stadt',
      lastModified: new Date('2025-01-10')
    }
  ];

  // Mock characters
  const mockCharacters: Character[] = [
    {
      id: '1',
      name: 'Emma Schneider',
      age: '28 Jahre',
      appearance: 'Mittellang braunes Haar, grüne Augen, 1,72m groß',
      personality: 'Mutig, neugierig, manchmal impulsiv',
      role: 'main',
      relationships: [],
      locations: ['Berlin', 'Das alte Archiv'],
      mentions: 15
    },
    {
      id: '2',
      name: 'Dr. Heinrich Weber',
      age: '55 Jahre',
      appearance: 'Graues Haar, Brille, akademische Erscheinung',
      personality: 'Weise, zurückhaltend, geheimnisvoll',
      role: 'supporting',
      relationships: [],
      locations: ['Das alte Archiv'],
      mentions: 8
    }
  ];

  // Mock locations
  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'Das alte Archiv',
      description: 'Ein verstaubtes Gebäude am Stadtrand mit jahrhundertealten Dokumenten',
      characters: ['Emma Schneider', 'Dr. Heinrich Weber']
    },
    {
      id: '2',
      name: 'Berlin',
      description: 'Die pulsierende Hauptstadt',
      characters: ['Emma Schneider']
    }
  ];

  // Mock analysis issues
  const mockIssues: AnalysisIssue[] = [
    {
      id: '1',
      type: 'character',
      severity: 'medium',
      position: 150,
      length: 20,
      message: 'Charakter "Emma" hatte zuvor grüne Augen, hier werden braune Augen erwähnt',
      suggestion: 'Augenfarbe konsistent halten oder Änderung im Text erklären'
    },
    {
      id: '2',
      type: 'logic',
      severity: 'high',
      position: 450,
      length: 35,
      message: 'Dr. Weber wurde zuvor als verstorben erwähnt, taucht hier aber wieder auf',
      suggestion: 'Zeitlinie überprüfen oder Tod-Szene entfernen'
    }
  ];

  const handleNewProject = () => {
    const newChapter: Chapter = {
      id: '1',
      title: 'Kapitel 1',
      content: '',
      order: 1
    };

    const newProject: Project = {
      id: Date.now().toString(),
      title: 'Neues Projekt',
      chapters: [newChapter],
      characters: [],
      locations: [],
      analysisIssues: [],
      created: new Date(),
      lastModified: new Date()
    };

    setCurrentProject(newProject);
    setCurrentChapterId(newChapter.id);
    toast({
      title: "Projekt erstellt",
      description: "Ihr neues Buchprojekt wurde erfolgreich angelegt."
    });
  };

  const handleOpenProject = (projectId: string) => {
    // Mock: Load a demo project with content
    const demoChapter: Chapter = {
      id: '1',
      title: 'Die Entdeckung',
      content: 'Emma Schneider betrat das alte Archiv zum ersten Mal an einem nebligen Novembermorgen. Die schwere Eichentür quietschte, als sie sie öffnete, und der Geruch von altem Papier und Staub schlug ihr entgegen.\n\nDr. Heinrich Weber, der Archivar, erwartete sie bereits zwischen den hohen Regalen. Seine grünen Augen funkelten hinter der Brille, als er sie begrüßte...',
      order: 1
    };

    const demoProject: Project = {
      id: projectId,
      title: 'Die vergessene Stadt',
      chapters: [demoChapter],
      characters: mockCharacters,
      locations: mockLocations,
      analysisIssues: mockIssues,
      created: new Date('2025-01-01'),
      lastModified: new Date()
    };

    setCurrentProject(demoProject);
    setCurrentChapterId(demoChapter.id);
    toast({
      title: "Projekt geladen",
      description: "Ihr Projekt wurde erfolgreich geöffnet."
    });
  };

  const handleContentChange = (chapterId: string, content: string) => {
    if (!currentProject) return;

    const updatedChapters = currentProject.chapters.map(chapter =>
      chapter.id === chapterId ? { ...chapter, content } : chapter
    );

    setCurrentProject({
      ...currentProject,
      chapters: updatedChapters,
      lastModified: new Date()
    });
  };

  const handleAnalyze = () => {
    toast({
      title: "Textanalyse gestartet",
      description: "Die KI analysiert Ihren Text auf Inkonsistenzen und Fehler..."
    });
    
    // In a real implementation, this would call an AI service
    setTimeout(() => {
      if (currentProject) {
        setCurrentProject({
          ...currentProject,
          analysisIssues: mockIssues
        });
      }
      toast({
        title: "Analyse abgeschlossen",
        description: `${mockIssues.length} Hinweise gefunden. Prüfen Sie die Seitenleiste.`
      });
    }, 2000);
  };

  const handleAISuggestion = () => {
    toast({
      title: "KI-Vorschlag generiert",
      description: "Neue kreative Ideen wurden in der Seitenleiste hinzugefügt."
    });
  };

  const handleAddChapter = () => {
    if (!currentProject) return;

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: `Kapitel ${currentProject.chapters.length + 1}`,
      content: '',
      order: currentProject.chapters.length + 1
    };

    setCurrentProject({
      ...currentProject,
      chapters: [...currentProject.chapters, newChapter]
    });

    toast({
      title: "Kapitel hinzugefügt",
      description: `"${newChapter.title}" wurde erstellt.`
    });
  };

  const handleExport = () => {
    toast({
      title: "Export vorbereitet",
      description: "Ihr Projekt wird zum Download vorbereitet..."
    });
  };

  const handleIssueClick = (issue: AnalysisIssue) => {
    toast({
      title: "Problem markiert",
      description: issue.message
    });
  };

  const handleDeleteIssue = (issueId: string) => {
    if (!currentProject) return;

    setCurrentProject({
      ...currentProject,
      analysisIssues: currentProject.analysisIssues.filter(i => i.id !== issueId)
    });

    toast({
      title: "Hinweis entfernt",
      description: "Der Hinweis wurde aus der Liste gelöscht."
    });
  };

  if (!currentProject) {
    return (
      <StartScreen
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        recentProjects={recentProjects}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorNavbar
        projectTitle={currentProject.title}
        onAnalyze={handleAnalyze}
        onAISuggestion={handleAISuggestion}
        onAddChapter={handleAddChapter}
        onToggleReadMode={() => setIsReadMode(!isReadMode)}
        onExport={handleExport}
        onBackToStart={() => setCurrentProject(null)}
        isReadMode={isReadMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {!isReadMode && (
          <Sidebar
            characters={currentProject.characters}
            locations={currentProject.locations}
            analysisIssues={currentProject.analysisIssues}
            onIssueClick={handleIssueClick}
            onDeleteIssue={handleDeleteIssue}
          />
        )}
        
        <div className="flex-1 overflow-hidden p-4">
          {isReadMode ? (
            <ReadingMode chapters={currentProject.chapters} />
          ) : (
            <TextEditor
              chapters={currentProject.chapters}
              currentChapterId={currentChapterId}
              onContentChange={handleContentChange}
              analysisIssues={currentProject.analysisIssues}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
