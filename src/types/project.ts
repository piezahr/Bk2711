export interface Character {
  id: string;
  name: string;
  age?: string;
  appearance?: string;
  personality?: string;
  role: 'main' | 'supporting' | 'minor';
  relationships: Array<{
    characterId: string;
    type: string;
    description: string;
  }>;
  locations: string[];
  mentions: number;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  characters: string[];
}

export interface AnalysisIssue {
  id: string;
  type: 'contradiction' | 'logic' | 'style' | 'character';
  severity: 'high' | 'medium' | 'low';
  position: number;
  length: number;
  message: string;
  suggestion?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  subchapters?: Chapter[];
}

export interface Project {
  id: string;
  title: string;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  analysisIssues: AnalysisIssue[];
  lastModified: Date;
  created: Date;
}
