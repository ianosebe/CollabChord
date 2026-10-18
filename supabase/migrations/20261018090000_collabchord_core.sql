-- CollabChord core schema. Apply once to a fresh Supabase project.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text not null default '',
  skills text[] not null default '{}',
  genres text[] not null default '{}',
  looking_for text[] not null default '{}',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.bulletins (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 1 and 3000),
  role_needed text not null,
  genre text,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);
create table public.collaboration_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  status text not null default 'active' check (status in ('active','paused','completed','archived')),
  created_at timestamptz not null default now()
);
create table public.project_members (
  project_id uuid not null references public.collaboration_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'collaborator' check (member_role in ('owner','collaborator')),
  joined_at timestamptz not null default now(),
  primary key (project_id,user_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.collaboration_projects(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now(),
  constraint message_context check (project_id is not null or recipient_id is not null)
);
create table public.timeline_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collaboration_projects(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  time_seconds integer not null default 0 check (time_seconds >= 0),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create table public.stems (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.collaboration_projects(id) on delete cascade,
  uploader_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  storage_path text not null,
  duration_seconds numeric(8,2),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.bulletins enable row level security;
alter table public.collaboration_projects enable row level security;
alter table public.project_members enable row level security;
alter table public.messages enable row level security;
alter table public.timeline_comments enable row level security;
alter table public.stems enable row level security;
create policy "Profiles are viewable by signed-in users" on public.profiles for select to authenticated using (true);
create policy "Users create own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Signed-in users view open bulletins" on public.bulletins for select to authenticated using (status = 'open' or creator_id = (select auth.uid()));
create policy "Users create bulletins" on public.bulletins for insert to authenticated with check (creator_id = (select auth.uid()));
create policy "Owners update bulletins" on public.bulletins for update to authenticated using (creator_id = (select auth.uid())) with check (creator_id = (select auth.uid()));
create policy "Owners delete bulletins" on public.bulletins for delete to authenticated using (creator_id = (select auth.uid()));
create policy "Project members view projects" on public.collaboration_projects for select to authenticated using (owner_id = (select auth.uid()) or exists (select 1 from public.project_members pm where pm.project_id = id and pm.user_id = (select auth.uid())));
create policy "Users create projects" on public.collaboration_projects for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "Owners update projects" on public.collaboration_projects for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "Owners delete projects" on public.collaboration_projects for delete to authenticated using (owner_id = (select auth.uid()));
create policy "Members can view their own membership" on public.project_members for select to authenticated using (user_id = (select auth.uid()));
create policy "Project owners add members" on public.project_members for insert to authenticated with check (exists (select 1 from public.collaboration_projects p where p.id = project_id and p.owner_id = (select auth.uid())));
create policy "Project owners remove members" on public.project_members for delete to authenticated using (exists (select 1 from public.collaboration_projects p where p.id = project_id and p.owner_id = (select auth.uid())));
create policy "Users read their messages" on public.messages for select to authenticated using (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()) or (project_id is not null and exists (select 1 from public.project_members pm where pm.project_id = messages.project_id and pm.user_id = (select auth.uid()))));
create policy "Users send messages as themselves" on public.messages for insert to authenticated with check (sender_id = (select auth.uid()) and ((recipient_id is not null and project_id is null) or (project_id is not null and exists (select 1 from public.project_members pm where pm.project_id = messages.project_id and pm.user_id = (select auth.uid())))));
create policy "Members view timeline comments" on public.timeline_comments for select to authenticated using (exists (select 1 from public.project_members pm where pm.project_id = timeline_comments.project_id and pm.user_id = (select auth.uid())));
create policy "Members create timeline comments" on public.timeline_comments for insert to authenticated with check (author_id = (select auth.uid()) and exists (select 1 from public.project_members pm where pm.project_id = timeline_comments.project_id and pm.user_id = (select auth.uid())));
create policy "Members view stems" on public.stems for select to authenticated using (exists (select 1 from public.project_members pm where pm.project_id = stems.project_id and pm.user_id = (select auth.uid())));
create policy "Members add stems" on public.stems for insert to authenticated with check (uploader_id = (select auth.uid()) and exists (select 1 from public.project_members pm where pm.project_id = stems.project_id and pm.user_id = (select auth.uid())));
grant select, insert, update, delete on public.profiles, public.bulletins, public.collaboration_projects, public.project_members, public.messages, public.timeline_comments, public.stems to authenticated;
create index bulletins_creator_id_idx on public.bulletins(creator_id);
create index collaboration_projects_owner_id_idx on public.collaboration_projects(owner_id);
create index messages_project_id_created_at_idx on public.messages(project_id,created_at);
create index messages_sender_id_created_at_idx on public.messages(sender_id,created_at);
create index messages_recipient_id_created_at_idx on public.messages(recipient_id,created_at);
create index project_members_user_id_idx on public.project_members(user_id);
create index stems_project_id_created_at_idx on public.stems(project_id,created_at);
create index stems_uploader_id_idx on public.stems(uploader_id);
create index timeline_comments_project_id_time_seconds_idx on public.timeline_comments(project_id,time_seconds);
create index timeline_comments_author_id_idx on public.timeline_comments(author_id);
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('collabchord-stems','collabchord-stems',false,52428800,array['audio/mpeg','audio/wav','audio/x-wav','audio/mp4','audio/aac','audio/ogg','audio/flac']);
create policy "Project members read stem files" on storage.objects for select to authenticated using (bucket_id='collabchord-stems' and exists (select 1 from public.project_members pm where pm.project_id::text=(storage.foldername(name))[1] and pm.user_id=(select auth.uid())));
create policy "Project members upload stem files" on storage.objects for insert to authenticated with check (bucket_id='collabchord-stems' and exists (select 1 from public.project_members pm where pm.project_id::text=(storage.foldername(name))[1] and pm.user_id=(select auth.uid())));
create policy "Project members update stem files" on storage.objects for update to authenticated using (bucket_id='collabchord-stems' and exists (select 1 from public.project_members pm where pm.project_id::text=(storage.foldername(name))[1] and pm.user_id=(select auth.uid()))) with check (bucket_id='collabchord-stems' and exists (select 1 from public.project_members pm where pm.project_id::text=(storage.foldername(name))[1] and pm.user_id=(select auth.uid())));
create policy "Project members delete stem files" on storage.objects for delete to authenticated using (bucket_id='collabchord-stems' and exists (select 1 from public.project_members pm where pm.project_id::text=(storage.foldername(name))[1] and pm.user_id=(select auth.uid())));
