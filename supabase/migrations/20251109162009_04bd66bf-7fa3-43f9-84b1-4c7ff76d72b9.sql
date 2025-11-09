-- Add Rafael as admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('5b1cf1ce-3b4a-4bde-9ca5-82759b37b6d9', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Add DELETE policy for profiles (only admins can delete)
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add DELETE policy for user_roles (only admins can delete)
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));