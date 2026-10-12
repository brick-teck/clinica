# Clínica Essentia

Template institucional completo de uma clínica multidisciplinar **fictícia**, desenvolvido com HTML5, CSS3 e JavaScript ES6. Sem frameworks, banco de dados, autenticação, serviços pagos ou build obrigatório.

## Executar

Sirva esta pasta por HTTP. Módulos JavaScript não funcionam corretamente abrindo o HTML diretamente com `file://`.

Com Node.js instalado:

```console
node scripts/serve.mjs
```

Acesse **http://127.0.0.1:4173**. Não execute `npm install`: o site e esse servidor não têm dependências. Opcionalmente use `npm.cmd start` no PowerShell, `python -m http.server 4173` ou Live Server do VS Code. Para alterar a porta do servidor Node, configure a variável `PORT`.

## O que está incluído

- Homepage completa, Sobre, Especialidades, Profissionais, Planos, Unidades, Blog, Contato, Privacidade e página 404.
- 30 áreas de atendimento com conteúdo próprio, procedimentos/serviços, FAQ, unidades e equipe relacionada.
- 18 perfis fictícios com retratos ilustrativos, formação, registro demonstrativo e convênios.
- Duas unidades com galeria, acessibilidade demonstrativa e agendamento contextual.
- Quatro artigos com data, categoria, autoria demonstrativa e leituras relacionadas.
- Pesquisa sem acentos, filtros combinados, estado vazio, limpeza e preservação dos filtros na URL.
- Mega menu pesquisável, menu móvel, FAQ nativo, modal acessível, redução de movimento e botão flutuante de contato.
- Agendamento por unidade → especialidade → profissional opcional → WhatsApp quando configurado.
- Contato com validação e encaminhamento por aplicativo de e-mail quando configurado, sem simular envio.
- Metadados por arquivo HTML, atualização de SEO nos detalhes, Open Graph, WebSite JSON-LD, sitemap e robots.

Todos os nomes, registros, formações, convênios, contatos e endereços são demonstrações. Nenhuma consulta real, disponibilidade, certificação, cobertura ou parceria é afirmada.

## Estrutura

```text
*.html                      Entradas estáticas de cada rota
assets/css/styles.css       Design system e responsividade
assets/js/app.js            Composição de páginas, navegação, SEO
assets/js/components.js     Header, footer, cards, busca, FAQ, CTA
assets/js/appointment.js    Agendamento e contato via WhatsApp
assets/js/contact.js        Validação e encaminhamento de e-mail
assets/js/utils.js          Busca normalizada, escaping, URLs
assets/js/data/             Conteúdos e relacionamentos editáveis
assets/js/pages/            Homepage, catálogos, detalhes e institucional
assets/images/             WebP locais e favicon SVG
scripts/                   Preview, checagens e utilitários opcionais de autoria
tests/                     Testes com Node nativo
DESIGN.md                   Direção visual e mapeamento dos tokens
docs/VERIFICACAO.md          Evidências e limites da verificação
```

## Personalizar

Edite `assets/js/data/config.js` para alterar nome, marca, logo, paleta, textos institucionais, domínio e canais. `logo` aceita um caminho local como `assets/images/minha-marca.svg`. A paleta é aplicada como propriedades CSS por `app.js`; há fallback equivalente em `styles.css` para o carregamento inicial. Para substituir a paleta permanente, atualize também esse fallback e `DESIGN.md`. Tipografia, medidas e raios ficam em `styles.css`.

Os módulos `especialidades.js`, `profissionais.js`, `planos.js`, `unidades.js`, `artigos.js` e `navigation.js` controlam os respectivos conteúdos. A edição desses arrays não exige mudar o layout. Slugs são únicos, sem espaços, e ligam os dados:

| Campo | Relação |
| --- | --- |
| `specialty.units` | Slugs de unidades que oferecem a área |
| `professional.specialties` | Slugs das áreas do profissional |
| `professional.units` | Unidades onde esse profissional atende |
| `professional.plans` | Convênios vinculados ao perfil |
| `plan.units` | Unidades participantes |
| `plan.specialties` | Áreas específicas; array vazio representa todas as áreas disponíveis na unidade |
| `plan.active` | Exibição da prévia e do catálogo |

As relações são demonstrativas. Registros como `CRM EXEMPLO 001` não são registros profissionais válidos. Valide dados, formação, registros, autorização de fotografias e conteúdo de saúde antes de uma implantação real. Colonoscopia e Endoscopia são exibidas na categoria **Exames**, enquanto as áreas de outras profissões ficam em **Terapias**; o catálogo mantém os 30 nomes solicitados pelo briefing.

Ao adicionar uma unidade, crie seu objeto em `unidades.js`, ajuste os relacionamentos nas áreas e perfis, e adicione seus canais a `config.channels`. Sem canais o site mostra o estado não configurado. Trocar a unidade no agendamento preserva o profissional apenas se ele continuar elegível.

### Configurar WhatsApp, e-mail, telefones e mapas

Os valores iniciais estão vazios, para não encaminhar visitantes a pessoas reais por engano.

```js
channels: {
  'unidade-centro': {
    whatsapp: '', // Número autorizado com país + DDD, somente dígitos: 55...
    phone: '',    // Telefone público autorizado
    email: '',    // Destinatário real autorizado
    mapUrl: '',   // Link HTTPS do mapa para endereço real validado
  },
}
```

O WhatsApp só aparece como link quando o número passa pela validação de formato brasileiro. A mensagem contém a unidade, a área e o profissional selecionados. **Nenhum horário é sugerido ou reservado automaticamente.** Sem número, o visitante pode apenas copiar uma mensagem de exemplo.

O formulário não envia dados a um servidor. Com e-mail configurado, prepara um link `mailto:`; a pessoa confere e envia no próprio aplicativo. Sem e-mail, informa que a mensagem não foi enviada. Alguns dispositivos não têm aplicativo de e-mail configurado; o site não consegue verificar a abertura nem confirmar o envio. Não inclua dados de saúde nos campos.

O mapa e a ação Como chegar aparecem somente com `mapUrl` HTTP(S) configurado. Valide o endereço real antes de criar o link. O template não cria pinos fictícios. Redes sociais funcionam da mesma forma: só aparecem após URL válida em `config.social`.

### Metadados e domínio

Após definir `config.siteUrl` (incluindo o caminho do repositório quando necessário), execute estes utilitários **opcionais de autoria**, sem instalação:

```console
node scripts/create-pages.mjs
node scripts/generate-seo.mjs
```

Eles atualizam os arquivos HTML, URL de compartilhamento, canonical, sitemap e robots. O sitemap entregue usa `https://example.com/`, domínio reservado para exemplos: **regenere antes de publicar**. Não há canonical apontando para domínio fictício no modo inicial.

Os detalhes funcionam por query string:

```text
especialidade.html?slug=cardiologia
profissional.html?slug=clara-monteiro
unidade.html?slug=unidade-centro
artigo.html?slug=antes-da-primeira-consulta
```

O JavaScript atualiza título, descrição e canonical em cada detalhe. Robôs que não executam JS recebem os metadados genéricos do arquivo; previews sociais normalmente não leem as alterações feitas por JS. Para SEO e compartilhamento completos, evolua para HTML individual previamente gerado por slug, reutilizando os módulos de dados e os renderizadores em `pages/details.js`. O site atual não requer essa etapa para funcionar.

O JSON-LD descreve um **WebSite demonstrativo**. Não há marcação MedicalClinic com endereço, avaliações ou certificações fictícios.

## Testar

Com Node.js 22 ou posterior:

```console
node --test tests/*.test.mjs
node scripts/check.mjs
```

Os testes verificam dados obrigatórios, slugs únicos, conteúdo distinto, relações, filtros, URLs de WhatsApp e planos desativados. A checagem também valida sintaxe JavaScript e referências locais de todas as páginas de detalhe renderizadas.

Para repetir a QA de navegador, instale as ferramentas **fora do projeto**; elas não fazem parte do runtime:

```powershell
npm.cmd install --prefix "$env:TEMP/essentia-qa" playwright-core axe-core
node scripts/serve.mjs
# Em outro terminal:
node scripts/browser-qa.mjs
```

O script usa Edge headless no Windows. Em outro ambiente defina `PLAYWRIGHT_MODULE` para o caminho absoluto de `playwright-core/index.mjs`, `BROWSER_PATH` para o navegador Chromium e `QA_URL` se a porta mudar. `axe-core` deve ser instalado como pacote irmão do Playwright. As capturas e os relatórios são gravados em `artifacts/` (ignorado pelo Git). Esta QA não envia mensagens ou formulários a terceiros.

## Publicar

**GitHub Pages:** crie um repositório com o conteúdo desta pasta, envie os arquivos e escolha Settings → Pages → Deploy from a branch → sua branch → `/ (root)`. Configure `siteUrl` com `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/` e gere SEO antes de enviar. As referências relativas suportam subpastas. Não use `/assets/...` nos arquivos do projeto.

**Netlify / Vercel:** publique a raiz como projeto estático, sem comando de build. Nenhum fallback obrigatório de SPA é necessário, pois as rotas são arquivos HTML reais. **Hospedagem tradicional:** copie os HTML, `assets`, `robots.txt` e `sitemap.xml` para o diretório público. `scripts`, `tests`, `docs` e `package.json` não são necessários para servir o site.

Se o provedor não aceitar uma pasta com arquivos de documentação como origem, publique apenas os arquivos públicos. Revise os dados demonstrativos, canais e política de privacidade conforme a operação real antes do uso comercial.

## Imagens e fontes

- `assets/images/clinica-premium.webp`: ambiente clínico fictício gerado pelo recurso integrado ImageGen, sem pessoas, marcas ou clínica reconhecível; otimizado em WebP, ~150KB. Prompt: “Fotografia editorial de arquitetura de uma clínica multidisciplinar brasileira fictícia, recepção curva clara, poltronas azul-cinza, carvalho, divisórias de vidro, maca de exame ao fundo, luz natural, sem pessoas, texto, marcas ou clínica reconhecível.”
- `assets/images/ambiente.webp`: referência ilustrativa de ambiente, [Unsplash — arquivo original](https://images.unsplash.com/photo-1497366811353-6870744d04b2), baixada e hospedada localmente. Não representa a clínica fictícia. O arquivo `clinica.webp` preserva a referência inicial e não é usado pelo layout final.
- Retratos: ilustrações SVG originais demonstrativas renderizadas por `portrait()`, sem usar fotografias de médicos reais.
- Ícones: subconjunto local de geometrias Lucide, [licença ISC](https://github.com/lucide-icons/lucide/blob/main/LICENSE). Consulte `LICENSES.md`.
- Manrope e Inter: Google Fonts, com fallback do sistema. Para eliminar chamadas externas, hospede as fontes licenciadas localmente e substitua o `@import` do CSS.

Referência geral de contexto: [Ministério da Saúde — equipes multiprofissionais](https://www.gov.br/saude/pt-br/composicao/saps/acoes-interprofissionais/emulti/emulti). A nomenclatura do catálogo segue o briefing e não declara que todos os 30 itens são especialidades médicas reconhecidas; [CFM — Comissão Mista de Especialidades](https://portal.cfm.org.br/?page_id=156910) reúne informações oficiais sobre especialidades e áreas de atuação. Textos do template são originais e demonstrativos, sem recomendações individualizadas.

## Recursos futuros

Não foram adicionados: reservas, prontuários, autenticação, coleta de dados de saúde, backend, envio automático, CMS, integrações pagas, rastreadores ou geração automática de HTML por slug. Os módulos separados permitem futura troca da camada de dados por APIs/CMS/Supabase sem reconstruir os componentes.

# clinica
