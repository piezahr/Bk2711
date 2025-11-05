import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, FileSearch, Sparkles, MapPin } from "lucide-react";
import { Character, Location, AnalysisIssue } from "@/types/project";
import { CharacterPanel } from "./CharacterPanel";
import { AnalysisPanel } from "./AnalysisPanel";
import { AIPanel } from "./AIPanel";
import { LocationPanel } from "./LocationPanel";

interface SidebarProps {
  characters: Character[];
  locations: Location[];
  analysisIssues: AnalysisIssue[];
  onIssueClick: (issue: AnalysisIssue) => void;
  onDeleteIssue: (issueId: string) => void;
}

export const Sidebar = ({ characters, locations, analysisIssues, onIssueClick, onDeleteIssue }: SidebarProps) => {
  return (
    <Card className="w-80 flex-shrink-0 overflow-hidden">
      <Tabs defaultValue="analysis" className="h-full">
        <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
          <TabsTrigger value="analysis" className="gap-2">
            <FileSearch className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="characters" className="gap-2">
            <Users className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>
        
        <div className="overflow-y-auto h-[calc(100%-48px)]">
          <TabsContent value="analysis" className="m-0 p-4">
            <AnalysisPanel 
              issues={analysisIssues} 
              onIssueClick={onIssueClick}
              onDeleteIssue={onDeleteIssue}
            />
          </TabsContent>
          
          <TabsContent value="characters" className="m-0 p-4">
            <CharacterPanel characters={characters} />
          </TabsContent>
          
          <TabsContent value="locations" className="m-0 p-4">
            <LocationPanel locations={locations} />
          </TabsContent>
          
          <TabsContent value="ai" className="m-0 p-4">
            <AIPanel />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};
