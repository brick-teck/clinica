# Verificação — 12 de outubro de 2026

Resultado verificado localmente em servidor HTTP estático e Edge/Chromium headless. Nenhuma publicação externa ou envio de mensagens foi realizado.

| Verificação | Comando / evidência | Resultado |
| --- | --- | --- |
| Integridade, filtros e regras de contato | `node --test tests/*.test.mjs` | 7 testes passaram |
| Sintaxe JS e links de páginas renderizadas | `node scripts/check.mjs` | 24 arquivos de código; 55 renders; 625 referências locais válidas |
| Design tokens | `npx.cmd -y -p @google/design.md designmd lint DESIGN.md` | 0 erros, 0 avisos |
| Navegação e fluxos reais | `node scripts/browser-qa.mjs` | 10 grupos de verificações passaram, 0 erros de console |
| SEO | `node scripts/generate-seo.mjs` | Sitemap com 63 URLs, domínio reservado de demonstração |
| Auditor premium estático | `audit_project.py . --mode strict --output docs/premium-audit.json` | 2 alertas de detecção de ações, analisados abaixo |

## Cobertura de navegador

- Renderização das páginas principais e dos 30 detalhes de áreas, 18 perfis, duas unidades e quatro artigos.
- Slug inválido com navegação de recuperação e metadado noindex.
- Busca sem acentos, persistência na URL, filtros combinados, limpeza e estado vazio.
- Mega menu, busca do menu e Escape; navegação móvel com disclosures.
- Agendamento originado de perfil, área e unidade. Preservação de profissional elegível na troca de unidade e remoção de profissional incompatível.
- WhatsApp não configurado sem link acionável; com configuração de teste, URL/mensagem corretas, sem abrir o serviço ou enviar mensagem.
- Formulário inválido com erros associados aos campos; formulário válido sem e-mail informa que não enviou.
- Nova unidade sem canal de contato configurado não quebra a página.
- Referências locais retornam HTTP 200; nenhuma funcionalidade termina em href vazio ou `#`.
- Layouts de 320, 390, 768, 1024 e 1440px sem overflow horizontal nas rotas representativas.
- Modal com Escape, foco contido e restauração de foco, select nativo e menu móvel operados por teclado.
- axe-core nas páginas inicial, especialidades, profissionais, contato, perfil e modal: nenhuma violação automática das regras selecionadas WCAG A/AA.

Capturas em `artifacts/home-desktop.png`, `home-full.png`, `home-mobile.png`, `cardiologia-desktop.png`, `especialidades-mobile.png` e `agendamento-mobile.png`; relatório de navegador em `artifacts/browser-qa.json`. Essa pasta é local e ignorada pelo Git.

## Limite do auditor estático

O auditor da skill retorna código 1 por dois alertas `affordance.actionless-button` em `assets/js/components.js:39` e `assets/js/pages/catalogs.js:18`. Ele procura handlers inline (`onclick`, `@click` ou `v-on:click`) em templates HTML literais e não reconhece os handlers ES6 registrados externamente.

As ações existem: `initNavigation()` em `app.js` liga o toggle de especialidades; `initCatalog()` liga os controles de limpeza por delegação e `initAppointment()` liga os CTAs `[data-book]`. Os testes de navegador executaram esses controles com sucesso. Os alertas são falsos positivos conhecidos, preservados no JSON original; nenhum handler inline ou atributo artificial foi adicionado para contornar a auditoria. O resultado **não** é anunciado como uma auditoria estática sem erros.

## Limites da entrega

- Contatos, mapas e redes precisam dos dados reais autorizados da implantação.
- Sitemap e URLs de compartilhamento devem ser regenerados depois de definir `config.siteUrl`.
- SEO/social previews completos nos detalhes dependem de futura geração de HTML por slug.
- E-mail é encaminhamento `mailto:`, sem backend, confirmação de envio ou prova de entrega.
- Google Fonts depende de acesso externo; há fallback de sistema.
- Não foram executados ensaios em hardware iOS/Android, Safari, leitor de tela real, rede móvel lenta ou medição de Core Web Vitals em produção.
- axe e testes de teclado são evidências parciais; não constituem certificação de acessibilidade ou conformidade jurídica.
