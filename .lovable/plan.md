

## Plano: Autenticação com Supabase + Persistência de Dados

### Visão Geral
Criar sistema de login/signup após o onboarding, salvar o perfil do usuário no Supabase e proteger o dashboard para usuários autenticados.

### 1. Criar tabelas no Supabase (migração SQL)

**Tabela `profiles`:**
- `id` (UUID, FK → auth.users, PK)
- `email` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `profile_data` (JSONB — armazena todo o UserProfile do onboarding)
- `has_completed_onboarding` (boolean, default false)

**RLS Policies:**
- SELECT: usuário pode ler apenas seu próprio perfil
- INSERT: usuário autenticado pode inserir seu próprio perfil
- UPDATE: usuário pode atualizar apenas seu próprio perfil

**Trigger:** auto-criar registro em `profiles` quando um novo usuário se registra via `auth.users`

### 2. Criar página de Auth (`src/pages/Auth.tsx`)
- Página com formulário de **login** e **signup** (toggle entre os dois)
- Usa `supabase.auth.signUp()` e `supabase.auth.signInWithPassword()`
- Design consistente com o estilo KOR (font-display, tracking, minimalista)
- Redirecionamento: após login → dashboard (se onboarding completo) ou onboarding

### 3. Criar página de Reset de Senha (`src/pages/ResetPassword.tsx`)
- Formulário para definir nova senha após clicar no link de recuperação
- Chama `supabase.auth.updateUser({ password })`

### 4. Fluxo do Onboarding atualizado (`src/pages/Onboarding.tsx`)
- Após completar o formulário, redirecionar para `/auth` (signup/login)
- Após autenticação bem-sucedida, salvar `profile_data` na tabela `profiles` e redirecionar para `/dashboard`

### 5. Proteger rotas (`src/App.tsx`)
- Criar componente `ProtectedRoute` que verifica sessão Supabase
- Dashboard e Goals ficam protegidos
- Se não autenticado → redireciona para `/auth`

### 6. Hook de autenticação (`src/hooks/useAuth.ts`)
- Hook com `onAuthStateChange` + `getSession`
- Expõe `user`, `session`, `loading`, `signOut`
- Carrega `profile_data` do Supabase ao fazer login e popula o Zustand store

### 7. Atualizar store (`src/store/useAppStore.ts`)
- Adicionar ação `loadProfileFromDB` para hidratar o estado com dados do Supabase
- Adicionar ação `saveProfileToDB` para persistir no Supabase

### 8. Atualizar rotas (`src/App.tsx`)
- `/auth` → página de login/signup
- `/reset-password` → página de redefinição de senha
- Dashboard e Goals protegidos com `ProtectedRoute`

### Fluxo do Usuário
```text
Landing → Onboarding (formulário) → Auth (signup/login) → Dashboard
                                                              ↑
Landing → Auth (login) ──────────────────────────────────────┘
```

### Detalhes Técnicos
- Profile data armazenado como JSONB para flexibilidade (não precisa de uma coluna por campo)
- `onAuthStateChange` configurado ANTES de `getSession()` conforme boas práticas do Supabase
- Redirect URL configurado para `window.location.origin`

