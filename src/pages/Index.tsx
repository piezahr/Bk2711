import { useState, useEffect } from "react";
import { StartScreen } from "@/components/StartScreen";
import { EditorNavbar } from "@/components/EditorNavbar";
import { TextEditor } from "@/components/TextEditor";
import { Sidebar } from "@/components/Sidebar";
import { ReadingMode } from "@/components/ReadingMode";
import { ChapterNavigation } from "@/components/ChapterNavigation";
import { Project, Chapter, AnalysisIssue, Character, Location } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { saveProject, getAllProjects, getProject, deleteProject } from "@/lib/projectStorage";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState<string>('');
  const [isReadMode, setIsReadMode] = useState(false);

  const [recentProjects, setRecentProjects] = useState<Array<{ id: string; title: string; lastModified: Date }>>([]);

  useEffect(() => {
    const projects = getAllProjects();
    setRecentProjects(
      projects
        .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
        .slice(0, 5)
        .map(p => ({ id: p.id, title: p.title, lastModified: p.lastModified }))
    );
  }, [currentProject]);

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
    const project = getProject(projectId);
    
    if (project) {
      setCurrentProject(project);
      setCurrentChapterId(project.chapters[0]?.id || '');
      toast({
        title: "Projekt geladen",
        description: `"${project.title}" wurde erfolgreich geöffnet.`
      });
    } else {
      toast({
        title: "Fehler",
        description: "Projekt konnte nicht gefunden werden.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    try {
      deleteProject(projectId);
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      toast({
        title: "Projekt gelöscht",
        description: "Das Projekt wurde erfolgreich entfernt."
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Projekt konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

  const handleContentChange = (chapterId: string, content: string) => {
    if (!currentProject) return;

    const updateChapter = (chapters: Chapter[]): Chapter[] => {
      return chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return { ...chapter, content };
        }
        if (chapter.subchapters) {
          return { ...chapter, subchapters: updateChapter(chapter.subchapters) };
        }
        return chapter;
      });
    };

    const updatedProject = {
      ...currentProject,
      chapters: updateChapter(currentProject.chapters),
      lastModified: new Date()
    };

    setCurrentProject(updatedProject);
    saveProject(updatedProject);
  };

  const handleAnalyze = async () => {
    if (!currentProject) return;

    toast({
      title: "Textanalyse gestartet",
      description: "Die KI analysiert Ihren Text auf Inkonsistenzen und Fehler..."
    });

    try {
      // Combine all text from all chapters
      const getAllText = (chapters: Chapter[]): string => {
        return chapters.map(ch => {
          const text = ch.content || '';
          const subText = ch.subchapters ? getAllText(ch.subchapters) : '';
          return text + '\n' + subText;
        }).join('\n');
      };

      const fullText = getAllText(currentProject.chapters);

      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: {
          text: fullText,
          characters: currentProject.characters,
          locations: currentProject.locations
        }
      });

      if (error) {
        console.error("Analysis error:", error);
        throw error;
      }

      const issues = data?.issues || [];
      
      const updatedProject = {
        ...currentProject,
        analysisIssues: issues,
        lastModified: new Date()
      };

      setCurrentProject(updatedProject);
      saveProject(updatedProject);

      toast({
        title: "Analyse abgeschlossen",
        description: `${issues.length} Hinweise gefunden.`
      });
    } catch (error) {
      console.error("Error analyzing text:", error);
      toast({
        title: "Fehler",
        description: "Textanalyse fehlgeschlagen. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
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

    const updatedProject = {
      ...currentProject,
      analysisIssues: currentProject.analysisIssues.filter(i => i.id !== issueId),
      lastModified: new Date()
    };

    setCurrentProject(updatedProject);
    saveProject(updatedProject);

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
        onDeleteProject={handleDeleteProject}
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
          <>
            <ChapterNavigation
              chapters={currentProject.chapters}
              currentChapterId={currentChapterId}
              onChapterSelect={setCurrentChapterId}
            />
            <Sidebar
              characters={currentProject.characters}
              locations={currentProject.locations}
              analysisIssues={currentProject.analysisIssues}
              onIssueClick={handleIssueClick}
              onDeleteIssue={handleDeleteIssue}
            />
          </>
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
