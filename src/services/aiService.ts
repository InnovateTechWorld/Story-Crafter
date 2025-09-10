
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Modality } from "@google/genai";
import type { Story, ArtStyle, Voice } from "@/types/story";

// Helper function to write a string to a DataView
const writeString = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};

// Helper function to create a WAV blob URL from raw PCM data
const createWaveBlobUrl = (pcmData: ArrayBuffer): string => {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.byteLength;
  const chunkSize = 36 + dataSize;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, chunkSize, true);
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
  view.setUint16(20, 1, true); // Audio format (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM data
  new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));

  const blob = new Blob([view], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};


const getClient = () => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please add it via the button on the main page.");
  }
  // Using GoogleGenAI as per the provided documentation
  return new GoogleGenAI({ apiKey });
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const generateStory = async (
  prompt: string,
  numPages: number,
  artStyle: ArtStyle,
  voice: Voice,
  educationalTheme?: string
): Promise<Story> => {
  console.log("Generating story with:", { prompt, numPages, artStyle, voice, educationalTheme });
  const ai = getClient();

  const storyPrompt = `Create a children's story about: "${prompt}".
The story must be exactly ${numPages} pages long.
The art style for the illustrations is ${artStyle}.
${educationalTheme ? `Subtly incorporate the educational theme of "${educationalTheme}".` : ""}
The story needs a clear beginning, middle, and end.
For each page, provide the page number, one paragraph of text (about 50-100 words), and a detailed prompt for an image generation model to create an illustration that matches the page's content and art style.

Return a single, valid JSON object with this exact structure:
{
  "title": "A short, catchy title for the story",
  "pages": [
    {
      "pageNumber": 1,
      "text": "The text for page 1.",
      "imagePrompt": "A detailed image prompt for page 1."
    }
  ]
}
Do not include any other text, markdown, or formatting outside of this JSON object.
`;
  
  // Following documentation: ai.models.generateContent with 'config' for JSON
  const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: storyPrompt,
      config: {
        responseMimeType: "application/json",
      },
  });

  const responseText = response.text;
  console.log("Generated story JSON:", responseText);

  try {
    const storyData = JSON.parse(responseText);
    const story: Story = {
      id: `story-${Date.now()}`,
      title: storyData.title,
      pages: storyData.pages,
      voice,
      educationalTheme,
    };
    console.log("Parsed story:", story);
    if (!story.title || !story.pages || story.pages.length === 0) {
      throw new Error("Invalid story structure received from AI.");
    }
    return story;
  } catch (e) {
    console.error("Failed to parse story JSON:", e, responseText);
    throw new Error("The AI created an invalid story. Please try a different prompt.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  console.log("Generating image for prompt:", prompt);
  const ai = getClient();
  
  // Following documentation for image generation
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageBase64 = part.inlineData.data;
      const imageUrl = `data:${part.inlineData.mimeType};base64,${imageBase64}`;
      console.log("Generated image URL.");
      return imageUrl;
    }
  }
  
  console.error("Image generation failed. Using placeholder.", response.text);
  throw new Error("Failed to generate image.");
};

export const generateSpeech = async (text: string, voice: Voice): Promise<string> => {
  console.log("Generating speech for text with voice:", voice);
  const ai = getClient();

  // Following documentation for text-to-speech
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const part = response.candidates?.[0]?.content.parts[0];
  if (part && part.inlineData) {
    const audioBase64 = part.inlineData.data;
    
    // The base64 data is raw PCM. We need to wrap it in a WAV container to be playable in the browser.
    const byteCharacters = atob(audioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const pcmData = new Uint8Array(byteNumbers).buffer;
    
    const audioUrl = createWaveBlobUrl(pcmData);

    console.log("Generated audio URL (WAV blob).");
    return audioUrl;
  }

  console.error("Audio generation failed. Using placeholder.", response.text);
  throw new Error("Failed to generate audio.");
};
