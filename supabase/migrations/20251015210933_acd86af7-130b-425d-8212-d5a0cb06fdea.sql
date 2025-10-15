-- Add column to institutions table to track if it requires additional file
ALTER TABLE public.institutions 
ADD COLUMN requires_additional_file boolean DEFAULT false;