-- Allow users to UPDATE their own generated protocols (for AI assistant edits)
CREATE POLICY "Users can update own protocols"
ON public.generated_protocols
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);