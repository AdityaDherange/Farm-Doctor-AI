-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  display_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diagnosis table for storing crop disease diagnoses
CREATE TABLE public.diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop TEXT NOT NULL,
  variety TEXT,
  disease TEXT,
  severity TEXT,
  confidence DECIMAL(5, 4),
  image_url TEXT,
  soil_type TEXT,
  soil_ph DECIMAL(3, 1),
  planting_date DATE,
  previous_crop TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  weather_data JSONB,
  treatment_chemical TEXT,
  treatment_organic TEXT,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat history table for AI chatbot
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  diagnosis_id UUID REFERENCES public.diagnoses(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Diagnoses policies
CREATE POLICY "Users can view their own diagnoses"
  ON public.diagnoses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON public.diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnoses"
  ON public.diagnoses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
  ON public.diagnoses FOR DELETE
  USING (auth.uid() = user_id);

-- Chat history policies
CREATE POLICY "Users can view their own chat history"
  ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger to run on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for profile timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for diagnosis images
INSERT INTO storage.buckets (id, name, public)
VALUES ('diagnosis-images', 'diagnosis-images', true);

-- Storage policies for diagnosis images
CREATE POLICY "Users can upload their own diagnosis images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'diagnosis-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view diagnosis images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'diagnosis-images');

CREATE POLICY "Users can delete their own diagnosis images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'diagnosis-images' AND auth.uid()::text = (storage.foldername(name))[1]);