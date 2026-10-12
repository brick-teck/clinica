# Clínica Essentia — Implementation Plan

**Goal:** Entregar o template estático completo descrito no briefing anexado.
**Architecture:** HTML por rota, módulos ES6 de dados, componentes HTML reutilizáveis e controladores de páginas. Nenhum build ou backend requerido.
**Tech Stack:** HTML5, CSS3, JavaScript ES6, Google Fonts; servidor Node opcional apenas para preview.
**Spec:** briefing do usuário e `DESIGN.md`.

## Restrições
- 30 especialidades, no mínimo 12 perfis, 2 unidades, 4 artigos.
- Dados fictícios explícitos; mapas e WhatsApp exigem configuração válida.
- Nenhum framework, instalação ou compilação para executar.
- O usuário solicitou iniciar e concluir todas as fases; executar diretamente no workspace vazio, sem gates adicionais de aprovação.

## Tarefas
- [x] Fundação: registrar design, testes de integridade, dados e regras puras de pesquisa/agendamento.
- [x] Layout: header, mega menu, footer, cards, modal e identidade responsiva.
- [x] Homepage e catálogos: listagens com filtros combinados e URLs persistentes.
- [x] Detalhes: especialidades, perfis, unidades, artigos, estados não encontrados.
- [x] Institucional: sobre, planos, contato, privacidade e encaminhamento honesto.
- [x] Verificação: integridade de relações, links locais, filtros, agendamento, console e mobile; README e SEO.

## Riscos a verificar
Slugs inválidos têm recuperação. Trocar unidade elimina profissional incompatível. Pesquisa considera acentos e texto longo. Não abrir WhatsApp sem número válido. Contato sem email configurado explica que o envio está indisponível. Mobile sem overflow; dialog e menu operáveis por teclado.
