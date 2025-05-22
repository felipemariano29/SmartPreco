# SmartPreço Web

Landing page moderna e responsiva para o aplicativo SmartPreço, desenvolvida com React e Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento para aplicações React
- **TanStack Query** - Gerenciamento de estado e cache
- **Radix UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones modernos

## 📁 Estrutura

```
web/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   ├── Hero.tsx       # Seção principal
│   │   ├── Features.tsx   # Funcionalidades
│   │   ├── HowItWorks.tsx # Como funciona
│   │   ├── Partnership.tsx # Parcerias
│   │   └── ...
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Utilitários
│   └── main.tsx          # Ponto de entrada
```

## 🎨 Componentes Principais

### Hero
Seção de destaque com call-to-action e imagens responsivas

### Features
Showcase das funcionalidades principais do app:
- Preços em tempo real
- Alertas de preço
- Comunidade ativa
- Economia garantida

### HowItWorks
Processo em 4 etapas para usar o aplicativo

### Partnership
Formulário e benefícios para estabelecimentos parceiros

### Testimonials
Depoimentos de usuários satisfeitos

### Security
Informações sobre segurança e privacidade

### FAQ
Perguntas frequentes com accordion interativo

## 🚀 Instalação

```bash
bun install
```

## 🔧 Desenvolvimento

```bash
bun dev
```

## 🏗️ Build

```bash
bun build
```

## 📱 Responsividade

Design mobile-first com breakpoints otimizados:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎯 Funcionalidades

- **Design Responsivo** - Adaptado para todos os dispositivos
- **Navegação Suave** - Scroll suave entre seções
- **Formulários Interativos** - Validação e feedback
- **Animações CSS** - Transições e hover effects
- **SEO Otimizado** - Meta tags e estrutura semântica
- **Acessibilidade** - Componentes acessíveis (Radix UI)

## 🔧 Customização

### Cores
Defina as cores do tema em `src/index.css`:
```css
:root {
  --brand-green: 34 197 94;
  --brand-orange: 249 115 22;
  --brand-blue: 59 130 246;
}
```

### Componentes
Todos os componentes UI estão em `src/components/ui/` e podem ser customizados conforme necessário.

## 📦 Deploy

Build otimizado para produção:
```bash
bun build
```

Os arquivos ficam na pasta `dist/` prontos para deploy em qualquer servidor estático.