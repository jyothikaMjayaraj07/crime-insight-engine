-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'officer');

-- Create enum for case status
CREATE TYPE public.case_status AS ENUM ('open', 'investigating', 'closed', 'solved');

-- Create enum for crime severity
CREATE TYPE public.crime_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  badge_number TEXT,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  district TEXT,
  area TEXT NOT NULL,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view locations"
  ON public.locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers and admins can insert locations"
  ON public.locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create criminals table
CREATE TABLE public.criminals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  alias TEXT,
  date_of_birth DATE,
  gender TEXT,
  identification_marks TEXT,
  address TEXT,
  phone TEXT,
  photo_url TEXT,
  criminal_history TEXT,
  is_repeat_offender BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.criminals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view criminals"
  ON public.criminals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers and admins can insert criminals"
  ON public.criminals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Officers and admins can update criminals"
  ON public.criminals FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create FIRs table
CREATE TABLE public.firs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  crime_type TEXT NOT NULL,
  severity crime_severity NOT NULL DEFAULT 'medium',
  incident_date TIMESTAMPTZ NOT NULL,
  location_id UUID REFERENCES public.locations(id),
  victim_name TEXT NOT NULL,
  victim_contact TEXT,
  victim_address TEXT,
  reported_by UUID REFERENCES auth.users(id),
  assigned_officer_id UUID REFERENCES auth.users(id),
  status case_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.firs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view FIRs"
  ON public.firs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers and admins can insert FIRs"
  ON public.firs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Officers and admins can update FIRs"
  ON public.firs FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create cases table
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL,
  fir_id UUID REFERENCES public.firs(id),
  title TEXT NOT NULL,
  description TEXT,
  status case_status NOT NULL DEFAULT 'open',
  priority crime_severity NOT NULL DEFAULT 'medium',
  assigned_officer_id UUID REFERENCES auth.users(id),
  investigation_notes TEXT,
  outcome TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view cases"
  ON public.cases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers and admins can insert cases"
  ON public.cases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Officers and admins can update cases"
  ON public.cases FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create suspects junction table
CREATE TABLE public.case_suspects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  criminal_id UUID REFERENCES public.criminals(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (case_id, criminal_id)
);

ALTER TABLE public.case_suspects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view suspects"
  ON public.case_suspects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers and admins can manage suspects"
  ON public.case_suspects FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Create evidence table
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  evidence_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  file_url TEXT,
  collected_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  collected_by UUID REFERENCES auth.users(id),
  chain_of_custody TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view evidence"
  ON public.evidence FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers and admins can insert evidence"
  ON public.evidence FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create function for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_criminals_updated_at
  BEFORE UPDATE ON public.criminals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_firs_updated_at
  BEFORE UPDATE ON public.firs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_firs_crime_type ON public.firs(crime_type);
CREATE INDEX idx_firs_incident_date ON public.firs(incident_date);
CREATE INDEX idx_firs_status ON public.firs(status);
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_criminals_repeat_offender ON public.criminals(is_repeat_offender);
CREATE INDEX idx_locations_city ON public.locations(city);
CREATE INDEX idx_locations_area ON public.locations(area);