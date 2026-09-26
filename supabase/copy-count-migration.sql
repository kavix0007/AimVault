-- Run this ONCE in Supabase SQL Editor for an existing AimVault database.
-- It adds the persistent live copy counter without changing existing crosshair data.

alter table public.crosshairs
  add column if not exists copy_count bigint not null default 0;

create or replace function public.increment_crosshair_copy(p_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.crosshairs
     set copy_count = copy_count + 1,
         updated_at = now()
   where id = p_id
     and published = true
  returning copy_count into new_count;

  if new_count is null then
    raise exception 'Crosshair not found or not published';
  end if;

  return new_count;
end;
$$;

revoke all on function public.increment_crosshair_copy(uuid) from public;
grant execute on function public.increment_crosshair_copy(uuid) to anon, authenticated;
