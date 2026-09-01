-- =========================================================
-- QuimLab 9 — esquema da base de dados Supabase
-- Cola este ficheiro inteiro no "SQL Editor" do Supabase e
-- clica em "Run" para criar tudo de uma vez.
-- =========================================================

-- Perfis dos utilizadores (aluno, professor, administrador)
-- Ligado à tabela auth.users, que o Supabase gere automaticamente.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  name text not null,
  role text not null default 'aluno' check (role in ('aluno', 'professor', 'administrador')),
  points integer not null default 0,
  progress jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Recursos publicados pelos professores (fichas, links, materiais)
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  unit integer not null,
  content text,
  link text,
  author_id uuid references auth.users (id) on delete set null,
  author_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.resources enable row level security;

-- =========================================================
-- Confirmação automática de email
-- O painel do Supabase deixou de mostrar o interruptor "Confirm
-- email" nos projectos novos do plano gratuito (é uma medida deles
-- contra abuso). Este gatilho confirma cada conta nova automaticamente
-- assim que é criada, para o registo funcionar sem precisares de
-- receber nenhum email de verificação.
-- =========================================================
create or replace function public.auto_confirm_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is null then
    update auth.users
    set email_confirmed_at = now()
    where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists auto_confirm_email_trigger on auth.users;
create trigger auto_confirm_email_trigger
  after insert on auth.users
  for each row execute function public.auto_confirm_email();

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Um utilizador pode criar o seu próprio perfil no momento do registo.
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Um utilizador pode actualizar o seu próprio perfil (pontos, progresso);
-- um administrador pode actualizar qualquer perfil (mudar cargo, repor pontos).
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'administrador'
    )
  );

-- Só um administrador pode remover uma conta.
drop policy if exists "profiles_delete_admin_only" on public.profiles;
create policy "profiles_delete_admin_only"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'administrador'
    )
  );

-- Qualquer pessoa com sessão iniciada pode ver os recursos publicados.
drop policy if exists "resources_select_all" on public.resources;
create policy "resources_select_all"
  on public.resources for select
  using (auth.role() = 'authenticated');

-- Só o próprio autor pode publicar um recurso em seu nome.
drop policy if exists "resources_insert_own" on public.resources;
create policy "resources_insert_own"
  on public.resources for insert
  with check (auth.uid() = author_id);

-- O autor ou um administrador podem apagar um recurso.
drop policy if exists "resources_delete_own_or_admin" on public.resources;
create policy "resources_delete_own_or_admin"
  on public.resources for delete
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'administrador'
    )
  );
