import { Chapter } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronDown, FileText } from "lucide-react";
import { useState } from "react";

interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapterId: string;
  onChapterSelect: (chapterId: string) => void;
}

export const ChapterNavigation = ({ chapters, currentChapterId, onChapterSelect }: ChapterNavigationProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleExpand = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const renderChapter = (chapter: Chapter, level: number = 0) => {
    const hasSubchapters = chapter.subchapters && chapter.subchapters.length > 0;
    const isExpanded = expandedChapters.has(chapter.id);
    const isActive = currentChapterId === chapter.id;

    return (
      <div key={chapter.id} style={{ marginLeft: `${level * 12}px` }}>
        <div className="flex items-center gap-1">
          {hasSubchapters && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleExpand(chapter.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasSubchapters && <div className="w-6" />}
          
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className="flex-1 justify-start gap-2 text-sm"
            onClick={() => onChapterSelect(chapter.id)}
          >
            <FileText className="h-4 w-4" />
            {chapter.title}
          </Button>
        </div>

        {hasSubchapters && isExpanded && (
          <div className="mt-1">
            {chapter.subchapters!.map(sub => renderChapter(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-64 flex-shrink-0 p-4 overflow-y-auto">
      <h3 className="font-semibold text-lg mb-4">Kapitel</h3>
      <div className="space-y-1">
        {chapters.map(chapter => renderChapter(chapter))}
      </div>
    </Card>
  );
};
