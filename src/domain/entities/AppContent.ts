export interface Section {
  key: 'howItWorks' | 'mission' | 'vision';
  title: string;
  content: string;
}

export interface AppContent {
  gradientStart: string;
  gradientEnd: string;
  fontFamily: string;
  mainTitle: string;
  sections: Section[];
}