---
version: alpha
name: Clínica Essentia
description: Hospitalidade clínica com organização editorial para um site demonstrativo brasileiro.
colors:
  ink: "#123F59"
  primary: "#123F59"
  brand: "#287C91"
  soft: "#DDEFEF"
  canvas: "#F6F9FA"
  white: "#FFFFFF"
  muted: "#526875"
typography:
  display:
    fontFamily: "Manrope, Arial, sans-serif"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
rounded:
  DEFAULT: "12px"
  lg: "24px"
  button: "7px"
spacing:
  section-gap: "88px"
  page-max: "1240px"
components:
  button:
    height: "52px"
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
  card:
    rounded: "{rounded.DEFAULT}"
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
  icon:
    backgroundColor: "{colors.soft}"
  navigation:
    backgroundColor: "{colors.white}"
    textColor: "{colors.brand}"
  dialog:
    rounded: "20px"
---
# Clínica Essentia — direção de design

## Overview
Site institucional brasileiro, pt-BR, para demonstração comercial de uma clínica multidisciplinar fictícia. A pessoa encontra uma área de atendimento, conhece o profissional e escolhe a unidade antes de iniciar um contato. O briefing anexado é a fonte de escopo.

### Direção
Hospitalidade clínica com organização editorial. Um hero dividido entre uma mensagem humana e uma fotografia de arquitetura; o recorte arredondado da fotografia dialoga com a marca em forma de pétalas. Sem estatísticas, certificados, avaliações ou parcerias inventadas. O projeto é um site de conteúdo com catálogos, sem administração ou CRUD.

## Colors
`assets/css/styles.css` define geometria, tipografia e estados. `assets/js/data/config.js` é a fonte canônica da paleta e marca; `app.js` aplica essas cores como propriedades CSS no documento. Não há adaptadores de frameworks.

| Token | Valor | Uso |
| --- | --- | --- |
| ink | #123F59 | Texto, marca, CTA |
| brand | #287C91 | Interação, títulos secundários |
| soft | #DDEFEF | Superfícies de destaque |
| canvas | #F6F9FA | Fundo alternado |
| white | #FFFFFF | Fundo principal |
| muted | #526875 | Texto secundário |

## Typography

Manrope para títulos (peso 500–600, espaçamento levemente fechado), Inter para leitura e controles (400–600). Fontes de sistema são o fallback. Escala fluida de títulos, corpo de 16px, entrelinha de 1.7. Todas as mensagens e datas seguem pt-BR.

## Layout

Container máximo 1240px, respiro entre seções de 88px, bordas de 1px. Menu móvel abaixo de 1180px; conteúdo móvel abaixo de 768px; telas menores que 360px reduzem todos os cards a uma coluna. Navegação e página compartilham um único container. Listas curtas (até 30 itens) são renderizadas integralmente.

## Elevation & Depth

Superfícies brancas e azul suave, com bordas discretas. Sombra restrita ao mega menu, modal, botão flutuante e nota de acolhimento no hero. Nenhuma sombra em grids de catálogo.

## Shapes

Raios de 12px e 24px; fotografia do hero com arco assimétrico como assinatura. Cards simples, sem camadas decorativas. Botões usam raio de 7px, dialog 20px.

## Components

### Comportamento compartilhado
Navegação sticky; mega menu com pesquisa e disclosure móvel acessível por teclado. Catálogos têm busca sem acentos, filtros combinados, estado vazio e limpeza explícita. Busca/filtros vivem na URL para retorno e compartilhamento. Seletores são nativos: geometria do popup pertence ao sistema operacional. FAQ usa details/summary. Agendamento usa dialog nativo, foco contido, Escape e restauração de foco. A unidade e a especialidade limitam os profissionais disponíveis.

### Dados e canais
Todos os nomes, registros, planos e endereços são exemplos. Retratos ilustrativos criados para o projeto, sem identidade de pessoas reais. Fotos de ambientes são referências visuais, não fotos de uma clínica real representada pela marca. WhatsApp, mapa, telefone, e-mail e redes sociais só se tornam links após configuração válida. Sem confirmação de consulta, disponibilidade simulada ou envio simulado.

### Acessibilidade e movimento
Semântica nativa, foco visível, alvos de toque de 44px, texto alternativo, skip link, live regions nos resultados e feedback de formulário. Contraste legível, reduced motion e scrollbars operáveis. Não se declara certificação WCAG ou conformidade jurídica. Imagens reservam geometria; feedback não desloca a ação principal.

### Verificação
Testes de dados e regras com Node nativo, servidor estático sem dependências, inspeção de navegação/filtros/agendamento em navegador nos tamanhos desktop e móvel. SEO das páginas de detalhe via JavaScript tem limites documentados; não há promessa de indexação de todas as URLs por parâmetros.

## Do's and Don'ts

- Manter uma ação reconhecível e consistente em todos os catálogos.
- Identificar dados e retratos demonstrativos de forma explícita.
- Não acrescentar estatísticas clínicas, depoimentos, selos ou parcerias fictícias.
- Não usar gradientes decorativos, carrosséis automáticos ou efeitos que disputem atenção com o cuidado.
