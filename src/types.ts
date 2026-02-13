// 1. Define the different "Screens" the app can show
export enum AppScreen {
  LOGIN = "LOGIN",
  DASHBOARD = "DASHBOARD",
  LEVELS = "LEVELS",
  LESSON = "LESSON",
  YOUNG_READERS = "YOUNG_READERS",
  GAME = "GAME",
  ALL_GAMES = "ALL_GAMES", // <--- This was missing!
}

// 2. Define the Levels
export enum AppLevel {
  LEVEL_1 = "LEVEL_1",
  LEVEL_2 = "LEVEL_2",
  LEVEL_3 = "LEVEL_3",
  MOCK_TESTS = "MOCK_TESTS",
}

// 3. Define what a Lesson looks like
export interface LessonContent {
  id: string;
  title: string;
  videoUrl: string;
  worksheetUrl?: string;
}
