-- Add default_currency column to institutions table
ALTER TABLE institutions 
ADD COLUMN default_currency text;