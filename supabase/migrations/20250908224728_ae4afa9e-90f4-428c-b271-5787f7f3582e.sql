-- Create institutions table
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is institutional data)
CREATE POLICY "Anyone can view institutions" 
ON public.institutions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert institutions" 
ON public.institutions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update institutions" 
ON public.institutions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete institutions" 
ON public.institutions 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_institutions_updated_at
BEFORE UPDATE ON public.institutions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default institutions
INSERT INTO public.institutions (name) VALUES
('XP Investimentos'),
('Nubank'),
('Inter'),
('BTG Pactual'),
('Rico'),
('Clear'),
('Easynvest'),
('Modal'),
('Genial Investimentos'),
('C6 Bank'),
('Itaú'),
('Bradesco'),
('Santander'),
('Banco do Brasil'),
('Caixa Econômica Federal')
ON CONFLICT (name) DO NOTHING;