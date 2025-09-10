# Kid Verse Crafter

Kid Verse Crafter is a web application that lets users generate, illustrate, and narrate custom children's stories using AI. It leverages Google Gemini for story, image, and speech generation, and stores stories in Supabase.

## Features

- **AI Story Generation:** Enter a prompt and get a multi-page children's story with a clear structure.
- **Customizable:** Choose art style, voice, number of pages, and an optional educational theme.
- **AI Illustrations:** Each page includes an AI-generated illustration matching the story and chosen art style.
- **Text-to-Speech:** Listen to the story with AI-generated narration in various voices.
- **Story Management:** Save and revisit stories, powered by Supabase backend.

## How It Works

1. **Enter Story Details:**  
    On the main page, provide a story idea, select art style, voice, number of pages, and optionally an educational theme.

2. **AI Generation:**  
    - The app sends your prompt to Google Gemini via the [aiService](src/services/aiService.ts).
    - Gemini returns a JSON story with title, pages, and image prompts.
    - For each page, Gemini generates an illustration and narration audio.

3. **Saving Stories:**  
    - Story metadata and pages are saved to Supabase (`stories` and `pages` tables).
    - Images and audio are uploaded to Supabase Storage.

4. **Viewing & Listening:**  
    - Browse all stories or view a single storybook.
    - Each page displays text, illustration, and a play button for narration.

## Setup & Usage

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/kid-verse-crafter.git
    cd kid-verse-crafter-main
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment:**
    - Obtain a Google Gemini API key.
    - On first run, you'll be prompted to enter your API key in the UI.
    - Set up Supabase and update credentials if needed.

4. **Run the app:**
    ```bash
    npm run dev
    ```

5. **Open in browser:**  
    Visit [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **Frontend:** React, TypeScript, Vite, shadcn/ui, Tailwind CSS
- **AI:** Google Gemini (story, image, and speech generation)
- **Backend:** Supabase (database and storage)
- **Routing:** React Router
- **State/Data:** React Query

## File Structure

- `src/components/` — UI components (forms, dialogs, storybook, etc.)
- `src/services/aiService.ts` — Handles all AI interactions (story, image, speech)
- `src/services/storyService.ts` — Handles saving/loading stories from Supabase
- `src/pages/` — Main pages (Index, StorybookView, AllStories)
- `src/hooks/` — Custom React hooks (e.g., toast notifications)

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT

---

**Note:**  
- You must provide your own Google Gemini API key.
- Supabase setup is required for persistent story storage.
