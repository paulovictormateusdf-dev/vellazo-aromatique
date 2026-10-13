# Vellazo Aromatique

Site estático (HTML + CSS + JS) com um painel de administração para a dona atualizar os produtos.

## Estrutura
- `index.html`, `css/style.css`, `js/main.js`: o site
- `assets/`: logo, fotos iniciais e favicon
- `data/produtos.json`: lista inicial de produtos (usada até o painel ser salvo pela primeira vez)
- `admin/index.html`: painel protegido por senha (`/admin/`)
- `api/`: funções da Vercel que leem e gravam os produtos e as fotos
- `package.json`: dependência `@vercel/blob`

## Configuração na Vercel (uma vez só)
1. Importe o repositório na Vercel (Framework Preset: Other) e faça o primeiro deploy.
2. No projeto, abra **Storage → Create Database → Blob**, crie o armazenamento com acesso **Public** e conecte ao projeto.
   Isso cria sozinho a variável `BLOB_READ_WRITE_TOKEN`.
3. Abra **Settings → Environment Variables** e crie `ADMIN_PASSWORD` com a senha do painel (use uma senha longa).
4. Vá em **Deployments → ⋯ → Redeploy** para as variáveis valerem.
5. Acesse `seu-site.vercel.app/admin/`, entre com a senha e teste salvando um produto.

A dona usa o guia `GUIA-DONA-DO-SITE.md`.
