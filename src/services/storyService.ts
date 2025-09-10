import { supabase } from "@/integrations/supabase/client";
import type { Story, Page, Voice } from "@/types/story";
import { generateImage, generateSpeech } from "./aiService";

// Helper to convert any URL (data URL, blob URL) to a Blob object
const urlToBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch blob from URL: ${url}`);
    }
    return await response.blob();
};

// Helper to upload a file (as blob) to Supabase Storage and get its public URL
const uploadFile = async (
  bucket: string,
  path: string,
  file: Blob,
  contentType: string
): Promise<string> => {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true });

  if (uploadError) {
    console.error(`Failed to upload to ${bucket}:`, uploadError);
    throw new Error(`Failed to upload to ${bucket}.`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!data.publicUrl) {
    throw new Error("Could not get public URL for the uploaded file.");
  }
  return data.publicUrl;
};


export const saveStoryFull = async (story: Story): Promise<string> => {
  console.log("Saving full story to Supabase:", story.title);

  // 1. Save story metadata
  const { data: storyData, error: storyError } = await supabase
    .from("stories")
    .insert({
      title: story.title,
      voice: story.voice,
      educational_theme: story.educationalTheme,
    })
    .select("id")
    .single();

  if (storyError) {
    console.error("Error saving story metadata:", storyError);
    throw new Error(`Could not save story metadata. ${storyError.message}`);
  }
  const storyId = storyData.id;

  // 2. Process and prepare each page for insertion
  const pageInsertPromises = story.pages.map(async (page) => {
    // Generate and upload image
    const imageUrlAI = await generateImage(page.imagePrompt);
    const imageBlob = await urlToBlob(imageUrlAI);
    const imagePath = `${storyId}/${page.pageNumber}.png`;
    const imageUrl = await uploadFile('story_images', imagePath, imageBlob, 'image/png');

    // Generate and upload audio
    const audioUrlAI = await generateSpeech(page.text, story.voice);
    const audioBlob = await urlToBlob(audioUrlAI);
    const audioPath = `${storyId}/${page.pageNumber}.wav`;
    const audioUrl = await uploadFile('story_audio', audioPath, audioBlob, 'audio/wav');
    
    return {
      story_id: storyId,
      page_number: page.pageNumber,
      text: page.text,
      image_prompt: page.imagePrompt,
      image_url: imageUrl,
      audio_url: audioUrl,
    };
  });
  
  const pagesToInsert = await Promise.all(pageInsertPromises);
  
  // 3. Insert all pages into the database
  const { error: pagesError } = await supabase.from("pages").insert(pagesToInsert);
  
  if (pagesError) {
    console.error("Error saving pages:", pagesError);
    // In a real app, you might want to delete the story entry if pages fail to save.
    throw new Error(`Could not save the story pages. ${pagesError.message}`);
  }

  console.log("Successfully saved story with ID:", storyId);
  return storyId;
};

export const getStory = async (storyId: string): Promise<Story> => {
  console.log("Fetching story with ID:", storyId);
  
  const { data: storyData, error: storyError } = await supabase
    .from("stories")
    .select("*")
    .eq("id", storyId)
    .single();
    
  if (storyError || !storyData) {
    console.error("Error fetching story:", storyError);
    throw new Error("Story not found.");
  }
  
  const { data: pagesData, error: pagesError } = await supabase
    .from("pages")
    .select("*")
    .eq("story_id", storyId)
    .order("page_number", { ascending: true });

  if (pagesError) {
    console.error("Error fetching pages:", pagesError);
    throw new Error("Could not fetch story pages.");
  }

  const story: Story = {
    id: storyData.id,
    title: storyData.title,
    voice: storyData.voice as Voice,
    educationalTheme: storyData.educational_theme ?? undefined,
    pages: pagesData.map(p => ({
      pageNumber: p.page_number,
      text: p.text,
      imagePrompt: p.image_prompt,
      imageUrl: p.image_url ?? undefined,
      audioUrl: p.audio_url ?? undefined,
    })),
  };
  
  console.log("Fetched story:", story);
  return story;
};

export const getAllStories = async (): Promise<{ id: string, title: string }[]> => {
  console.log("Fetching all stories");
  
  const { data, error } = await supabase
    .from("stories")
    .select("id, title")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching all stories:", error);
    throw new Error("Could not fetch stories.");
  }

  return data || [];
};
