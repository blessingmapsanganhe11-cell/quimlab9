# Guia: publicar o QuimLab 9 como site real (passo a passo)

Este guia assume que nunca fizeste isto antes. Vai com calma, um passo de
cada vez — não precisas de saber programar para completar a maior parte
destes passos.

Vais usar três serviços gratuitos (para começar):

- **Supabase** — a base de dados e o sistema de login/registo.
- **GitHub** — onde o código do site fica guardado.
- **Vercel** — onde o site fica publicado, com o teu domínio próprio.

---

## Parte 1 — Criar a base de dados (Supabase)

1. Vai a [supabase.com](https://supabase.com) e cria uma conta gratuita
   (podes usar o GitHub para entrar mais depressa).
2. Clica em **"New project"**. Escolhe um nome (ex: `quimlab9`), uma
   password para a base de dados (guarda-a nalgum lado seguro) e a região
   mais próxima. Espera 1–2 minutos até o projecto ficar pronto.
3. No menu da esquerda, abre **"SQL Editor"** → **"New query"**.
4. Abre o ficheiro `supabase/schema.sql` (incluído neste pacote), copia
   **todo** o conteúdo, cola no editor SQL do Supabase e clica em **"Run"**.
   Isto cria as duas tabelas (`profiles` e `resources`) e as regras de
   segurança.
5. Nalguns projectos novos do Supabase, a opção "Confirm email" já não
   aparece no painel (a Supabase escondeu-a nos projectos gratuitos mais
   recentes, como medida contra abuso). **Não é preciso procurá-la** — o
   ficheiro `schema.sql` já inclui um mecanismo (um "trigger" na base de
   dados) que confirma automaticamente cada conta nova assim que é criada,
   por isso o registo funciona na mesma sem precisares de mexer nesse
   interruptor. Se voltares a correr o `schema.sql`, isto é reaplicado sem
   problema (o ficheiro pode ser corrido várias vezes em segurança).
6. Ainda em **Authentication → Settings**, garante que "Enable email
   provider" está ligado (é a definição por omissão).
7. Vai a **Settings → API**. Vais precisar de dois valores desta página
   mais à frente: o **Project URL** e a **anon public key**.

## Parte 2 — Preparar o código no teu computador

1. Instala o [Node.js](https://nodejs.org) (versão LTS) se ainda não o
   tiveres — é o programa que corre o código React.
2. Descarrega/extrai a pasta `quimlab9-app` (este pacote) para o teu
   computador.
3. Dentro dessa pasta, faz uma cópia do ficheiro `.env.example` e chama-lhe
   `.env`. Abre-o e substitui os dois valores pelos que copiaste do
   Supabase no passo anterior:

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=a-tua-chave-anon
   ```

4. Abre um terminal dentro da pasta `quimlab9-app` e corre:

   ```
   npm install
   npm run dev
   ```

5. Abre o endereço que aparecer no terminal (normalmente
   `http://localhost:5173`) — a app deve abrir no browser, já ligada à
   tua base de dados real. Testa criar uma conta de estudante e uma de
   professor (código de demonstração no ecrã de registo) para confirmares
   que tudo funciona.

## Parte 3 — Colocar o código no GitHub

1. Cria uma conta gratuita em [github.com](https://github.com), se ainda
   não tiveres.
2. Cria um novo repositório (botão verde **"New"**), por exemplo chamado
   `quimlab9`. Deixa-o vazio (sem README).
3. No terminal, dentro da pasta `quimlab9-app`, corre:

   ```
   git init
   git add .
   git commit -m "Primeira versão do QuimLab 9"
   git branch -M main
   git remote add origin https://github.com/O-TEU-UTILIZADOR/quimlab9.git
   git push -u origin main
   ```

   (O `.env` com as tuas chaves **não** é enviado — está protegido pelo
   `.gitignore`, para nunca ficar público.)

## Parte 4 — Publicar no Vercel

1. Vai a [vercel.com](https://vercel.com) e entra com a tua conta GitHub.
2. Clica em **"Add New… → Project"** e escolhe o repositório `quimlab9`
   que acabaste de criar.
3. O Vercel deteta automaticamente que é um projecto Vite/React — não
   precisas de mudar nada nas definições de build.
4. Antes de clicar em "Deploy", abre a secção **"Environment Variables"**
   e adiciona as mesmas duas variáveis do teu `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clica em **"Deploy"**. Em 1–2 minutos o site fica online, com um
   endereço tipo `quimlab9.vercel.app` — já funcional e partilhável.

## Parte 5 — Ligar um domínio próprio

1. Regista um domínio (ex: `quimlab9.co.mz` ou `quimlab9.com`) num
   registador — no caso de `.co.mz`, através do
   [CENTRO.mz](https://www.centro.mz); para `.com`, serviços como
   Namecheap ou Google Domains.
2. No painel do Vercel, abre o teu projecto → **"Settings" → "Domains"**
   → escreve o domínio que compraste → **"Add"**.
3. O Vercel mostra-te 1 ou 2 registos DNS para adicionares no painel do
   teu registador de domínio (normalmente um registo `A` e/ou `CNAME`).
   Copia-os para lá — a activação pode demorar entre alguns minutos e
   algumas horas.
4. Quando o Vercel mostrar "Valid Configuration" ao lado do domínio, o
   site já está a funcionar nesse endereço, com HTTPS automático.

---

## Coisas importantes a saber

- **Os "códigos de professor/administrador"** (`TEACHER_CODE` e
  `ADMIN_CODE`, no topo de `src/App.jsx`) ficam visíveis a quem inspeccionar
  o código do site no browser. Antes de divulgares o link a sério, muda-os
  para algo só teu e não os partilhes publicamente — são só uma barreira
  simples, não segurança forte.
- **Remover uma conta no Painel de Administração** apaga o perfil da
  pessoa (pontos, progresso, nome) mas não apaga o registo de login dela
  no Supabase Auth — isso exigiria uma chave especial que não deve estar
  no código do site (por segurança). Se precisares de apagar contas de
  autenticação por completo, faz isso manualmente no painel do Supabase
  em **Authentication → Users**.
- **Plano gratuito do Supabase**: até 50.000 utilizadores activos por mês
  e 500 MB de base de dados — mais do que suficiente para começar numa
  escola ou distrito.
- **Actualizar o site no futuro**: sempre que quiseres mudar algo no
  código (ex: adicionar mais unidades), edita os ficheiros, corre
  `git add . && git commit -m "descrição" && git push` — o Vercel publica
  a nova versão automaticamente em cada envio.

Se ficares preso nalgum passo, diz-me exactamente onde travaste (a
mensagem de erro, se houver) que ajudo-te a resolver.
