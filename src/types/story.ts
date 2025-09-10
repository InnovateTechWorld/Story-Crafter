
export interface Page {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  pages: Page[];
  voice: Voice;
  educationalTheme?: string;
}

export type ArtStyle = "Cartoon" | "Watercolor" | "Comic Book" | "Fantasy Art";

export const voices = [
  "Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Aoede",
  "Callirrhoe", "Autonoe", "Enceladus", "Iapetus", "Umbriel", "Algieba",
  "Despina", "Erinome", "Algenib", "Rasalgethi", "Laomedeia", "Achernar",
  "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird", "Zubenelgenubi",
  "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat"
] as const;

export type Voice = typeof voices[number];
