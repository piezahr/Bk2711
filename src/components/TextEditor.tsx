import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Chapter } from "@/types/project";

interface TextEditorProps {
  chapters: Chapter[];
  currentChapterId: string;
  onContentChange: (chapterId: string, content: string) => void;
  analysisIssues?: Array<{ position: number; length: number; message: string }>;
}

export const TextEditor = ({ chapters, currentChapterId, onContentChange, analysisIssues = [] }: TextEditorProps) => {
  const findChapter = (chapters: Chapter[], id: string): Chapter | undefined => {
    for (const chapter of chapters) {
      if (chapter.id === id) return chapter;
      if (chapter.subchapters) {
        const found = findChapter(chapter.subchapters, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const currentChapter = findChapter(chapters, currentChapterId);
  const [content, setContent] = useState(currentChapter?.content || '');

  useEffect(() => {
    setContent(currentChapter?.content || '');
  }, [currentChapter]);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(currentChapterId, newContent);
  };

  return (
    <Card className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-foreground">{currentChapter?.title || 'Unbenanntes Kapitel'}</h2>
          <div className="h-px bg-border mb-6"></div>
        </div>
        
        <Textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[600px] text-base leading-relaxed resize-none border-0 focus-visible:ring-0 p-0 font-serif"
          placeholder="Beginnen Sie hier mit dem Schreiben Ihrer Geschichte..."
        />
        
        {analysisIssues.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {analysisIssues.length} Hinweise gefunden
          </div>
        )}
      </div>
    </Card>
  );
};
