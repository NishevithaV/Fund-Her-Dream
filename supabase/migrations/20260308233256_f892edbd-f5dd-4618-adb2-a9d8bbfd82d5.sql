UPDATE public.ideas SET founder_name = 'Ananya Kapoor' WHERE id = 'e2b288a6-d011-4a6a-8fae-8c2b40fdb00e';

UPDATE public.ideas SET title = REPLACE(title, ' — ', ' - ') WHERE title LIKE '%—%';