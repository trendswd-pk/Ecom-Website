-- Default admin: admin@trendswd.com / admin123
--
-- 1) Create the Auth user first (Dashboard → Authentication → Users → Add user)
--    Email: admin@trendswd.com  |  Password: admin123  |  Auto confirm: ON
--
-- 2) Then run this SQL to sync the profiles row (admin role + full permissions):

insert into public.profiles (id, email, role, permissions)
select
  u.id,
  u.email,
  'admin',
  '{"can_view": true, "can_edit": true, "can_delete": true}'::jsonb
from auth.users u
where u.email = 'admin@trendswd.com'
on conflict (id) do update
set
  email = excluded.email,
  role = excluded.role,
  permissions = excluded.permissions,
  updated_at = now();
