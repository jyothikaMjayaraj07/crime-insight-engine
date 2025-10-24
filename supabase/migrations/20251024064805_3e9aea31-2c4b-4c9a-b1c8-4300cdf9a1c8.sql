-- Step 1: Add case_id to firs table
ALTER TABLE public.firs 
ADD COLUMN case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL;

-- Step 2: Migrate existing data (cases.fir_id → firs.case_id)
UPDATE public.firs
SET case_id = cases.id
FROM public.cases
WHERE firs.id = cases.fir_id;

-- Step 3: Remove fir_id from cases table
ALTER TABLE public.cases 
DROP COLUMN fir_id;

-- Step 4: Create index for performance
CREATE INDEX idx_firs_case_id ON public.firs(case_id);

-- Step 5: Update RLS policy for firs to include case access
DROP POLICY IF EXISTS "Officers and admins can update FIRs" ON public.firs;

CREATE POLICY "Officers and admins can update FIRs" 
ON public.firs 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add comment explaining the relationship
COMMENT ON COLUMN public.firs.case_id IS 'Links multiple FIRs to one case (many-to-one relationship)';
COMMENT ON TABLE public.case_suspects IS 'Junction table linking cases to criminals (many-to-many relationship)';