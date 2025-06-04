
# SmartPreço · Monorepo

**SmartPreço** é uma plataforma colaborativa para comparação de preços de produtos em mercados, unindo aplicativo mobile, web, dashboard admin e API robusta — tudo gerenciado em um único monorepo!

<div align="center">
  <img src="images/logo.png" height="120" alt="Logo SmartPreço" />
</div>

## 🧩 Visão Geral do Monorepo

Este repositório reúne todos os projetos que compõem o ecossistema SmartPreço:

* **native/** — App mobile React Native (Expo)
* **web/** — Landing page moderna para usuários e parceiros
* **admin/** — Dashboard Next.js para moderação e relatórios
* **backend/** — API RESTful em NestJS + PostgreSQL


## 🚀 Principais Funcionalidades

* Cadastro colaborativo de preços com fotos dos comprovantes
* Busca e comparação de preços em mercados próximos
* Favoritar produtos e mercados para acompanhar variações
* Histórico de preços e notificações em tempo real
* Dashboard de moderação, relatórios e controle de conteúdo
* Landing page institucional e área de parceiros



## 📁 Estrutura do Repositório

```
.
├── native/      # Aplicativo mobile (React Native + Expo)
├── web/         # Landing page institucional (React + Vite)
├── admin/       # Dashboard administrativo (Next.js)
├── backend/     # API backend (NestJS + Postgres)
└── README.md    # Este arquivo
```



## 🏗️ Stack Tecnológica

* **Mobile:** React Native, Expo, Clerk Auth, TanStack Query, Zod
* **Web:** React 18, Vite, Tailwind CSS, TypeScript, shadcn/ui, Bun
* **Admin:** Next.js (App Router), TypeScript, MSW, Axios, shadcn/ui
* **Backend:** Node 18+, NestJS 10, PostgreSQL, Supabase, AWS S3, Jest



## 💡 Subprojetos

### [native/](./native/README.md) · **App Mobile**

* Cadastro de produtos manual/barcode
* Comparação de preços, favoritos, IA de dúvidas e scanner
* Expo Router, React Navigation, autenticação Clerk
* Documentação e instruções completas no [README do native](./native/README.md)

### [web/](./web/README.md) · **Landing Page**

* Site institucional, apresentação, parcerias e FAQ
* Feito com Vite, React, Tailwind e animações modernas
* Responsivo e otimizado para SEO
* Veja detalhes e comandos no [README do web](./web/README.md)

### [admin/](./admin/README.md) · **Dashboard Admin**

* Moderação de produtos, mercados e preços
* Relatórios, internacionalização, modo escuro/claro
* Integração mock/MSW para desenvolvimento ágil
* Guia de uso, arquitetura e contribuição no [README do admin](./admin/README.md)

### [backend/](./backend/README.md) · **API Backend**

* API RESTful em NestJS, integração com Postgres, S3/Supabase, notificações multicanal
* Princípios SOLID, Strategy, Observer, cobertura de testes com Jest
* Organização modular por contexto de negócio
* Detalhes de arquitetura e exemplos de código no [README do backend](./backend/README.md)


## 🛠️ Como Rodar Localmente

Cada subprojeto possui README próprio com instruções detalhadas. Em resumo:

### 1. Clone o monorepo

```bash
git clone https://github.com/seu-usuario/smartpreco.git
cd smartpreco
```

### 2. Instale as dependências de cada projeto

**Exemplo para o backend:**

```bash
cd backend
pnpm install
cp .env.schema .env  # Edite as variáveis
pnpm dev
```

**Para o app mobile:**

```bash
cd native
npm install
npx expo start
```

**Para web e admin:**

```bash
cd web
bun install
bun dev

cd ../admin
yarn install
yarn dev
```

> Veja cada [README específico](#💡-subprojetos) para comandos, variáveis e instruções de build.


## 🧬 Padrões e Boas Práticas

* **SOLID e Design Patterns:** Backend e Admin seguem princípios SOLID e padrões (Strategy, Observer, Factory)
* **TypeScript Everywhere:** Código fortemente tipado, evitando erros em runtime
* **Monorepo Modular:** Cada contexto/domínio em sua pasta, facilitando manutenção e escalabilidade
* **Testes Automatizados:** Cobertura unitária no backend (Jest + Supertest), MSW mocks no admin


## 🤝 Contribuição

1. Fork este repositório e crie uma branch:

   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
2. Faça suas alterações, commit e push:

   ```bash
   git commit -m 'feat: Nova funcionalidade'
   git push origin feature/nova-funcionalidade
   ```
3. Abra um Pull Request descrevendo claramente sua contribuição.

> Siga o padrão de cada subprojeto e consulte os respectivos READMEs para setup e guidelines de contribuição.

---

### Referências e Documentação Detalhada

* [native/README.md](./native/README.md)
* [web/README.md](./web/README.md)
* [admin/README.md](./admin/README.md)
* [backend/README.md](./backend/README.md)

---

<div align="center">
  <sub>
    Feito com 💚 por colaboradores do <b>SmartPreço</b>
  </sub>
</div>

