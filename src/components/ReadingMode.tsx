import { Card } from "@/components/ui/card";
import { Chapter } from "@/types/project";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReadingModeProps {
  chapters: Chapter[];
}

export const ReadingMode = ({ chapters }: ReadingModeProps) => {
  return (
    <ScrollArea className="flex-1">
      <Card className="max-w-4xl mx-auto p-12 my-8 shadow-lg">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Kapitel {index + 1}: {chapter.title}
              </h2>
              <div className="whitespace-pre-wrap text-base leading-relaxed font-serif">
                {chapter.content}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ScrollArea>
  );
};
