// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  travelStyle?: string[];
  budget?: number;
  mustHaves?: string[];
  avoidList?: string[];
  foodPrefs?: string[];
  activityLevel?: 'Low' | 'Medium' | 'High';
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Group related types
export interface Group {
  id: string;
  name: string;
  description?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  members?: GroupMember[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'owner' | 'member';
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// Itinerary related types
export interface Itinerary {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  content: ItineraryContent;
  isFinalized: boolean;
  group?: Group;
  votes?: Vote[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryContent {
  destination: string;
  days: ItineraryDay[];
  summary: {
    highlights: string[];
    compromises: string[];
    estimatedTotalCost: string;
  };
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
  accommodation: Accommodation;
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  suitableFor: string[];
  optionalFor: string[];
  estimatedCost: string;
}

export interface Meal {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  suggestion: string;
  accommodates: string[];
}

export interface Accommodation {
  name: string;
  description: string;
  estimatedCost: string;
}

export interface Vote {
  id: string;
  itineraryId: string;
  userId: string;
  value: number; // Usually +1 for upvote, -1 for downvote
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  itineraryId: string;
  userId: string;
  content: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}
