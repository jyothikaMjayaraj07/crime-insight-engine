-- Create function to automatically create case when FIR is registered
CREATE OR REPLACE FUNCTION public.create_case_from_fir()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_case_id uuid;
BEGIN
  -- Insert a new case based on the FIR data
  INSERT INTO public.cases (
    case_number,
    title,
    description,
    priority,
    status,
    assigned_officer_id
  ) VALUES (
    'CASE-' || NEW.fir_number,
    NEW.title,
    NEW.description,
    NEW.severity,
    NEW.status,
    NEW.assigned_officer_id
  )
  RETURNING id INTO new_case_id;

  -- Link the FIR to the newly created case
  UPDATE public.firs
  SET case_id = new_case_id
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

-- Create trigger to execute the function after FIR insert
CREATE TRIGGER trigger_create_case_from_fir
  AFTER INSERT ON public.firs
  FOR EACH ROW
  EXECUTE FUNCTION public.create_case_from_fir();

COMMENT ON FUNCTION public.create_case_from_fir() IS 'Automatically creates a case when a new FIR is registered';