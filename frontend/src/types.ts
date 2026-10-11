export type TabKey =
  | 'Home'
  | 'Discover'
  | 'Nature Missions'
  | 'Identify Nature'
  | 'Biodiversity Map'
  | 'Eco Community'
  | 'Nature Journal'
  | 'Nature AI Lab'
  | 'Settings'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Mission {
  id: string
  title: string
  description: string
  learningObjective: string
  estimatedDuration: number
  difficulty: Difficulty
  completionCriteria: string
  safetyGuidance: string
  ecoXp: number
  source: 'local_fallback' | 'local_ai'
  completed?: boolean
}

export interface JournalEntry {
  id: string
  title: string
  notes: string
  location: string
  category: string
  date: string
}

export interface Observation {
  id: string
  label: string
  type: string
  confidence: string
  status: 'pending' | 'synced' | 'failed'
  location: string
  notes: string
}
