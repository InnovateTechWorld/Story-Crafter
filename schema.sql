-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.pages (
  story_id uuid NOT NULL,
  page_number integer NOT NULL,
  text text NOT NULL,
  image_prompt text NOT NULL,
  image_url text,
  audio_url text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pages_pkey PRIMARY KEY (id),
  CONSTRAINT pages_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id)
);
CREATE TABLE public.stories (
  title text NOT NULL,
  voice text NOT NULL,
  educational_theme text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT stories_pkey PRIMARY KEY (id)
);