// Optional authoring utility. All generated HTML files are committed; no build is needed.
import { writeFileSync } from 'node:fs';
import { config } from '../assets/js/data/config.js';
const pages={index:['Cuidado especializado para cada momento da sua vida','Conheça a Clínica Essentia, um template fictício de clínica multidisciplinar.'],sobre:['Sobre nós','Conheça a proposta demonstrativa de escuta, acolhimento e cuidado integrado.'],especialidades:['Especialidades','Encontre áreas de atendimento com busca por nome, categoria e unidade.'],especialidade:['Especialidade','Conheça informações, profissionais e unidades da área de atendimento.'],profissionais:['Profissionais','Explore os perfis fictícios por área de atuação e unidade.'],profissional:['Perfil profissional','Conheça a formação demonstrativa, áreas e unidades deste perfil fictício.'],planos:['Planos de saúde','Consulte convênios fictícios e confirme a cobertura antes de agendar.'],unidades:['Unidades','Conheça as duas unidades demonstrativas da Clínica Essentia.'],unidade:['Unidade','Informações, ambientes ilustrativos e equipe da unidade demonstrativa.'],blog:['Blog','Leituras demonstrativas sobre consultas e cuidado multidisciplinar.'],artigo:['Artigo','Conteúdo editorial demonstrativo sobre organização e cuidado.'],contato:['Contato','Conheça os canais configuráveis e o formulário de informações gerais.'],privacidade:['Privacidade','Informações demonstrativas sobre os dados e canais deste template.'],'404':['Página não encontrada','Este endereço não está disponível no site demonstrativo.']};
for(const [slug,[title,description]]of Object.entries(pages)){
 writeFileSync(`${slug}.html`,`<!doctype html>
<html lang="pt-BR">
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>${title} | ${config.name}</title>
 <meta name="description" content="${description}">
 <meta name="robots" content="${slug==='404'?'noindex, follow':'index, follow'}">
 <meta name="theme-color" content="#123F59">
 <meta property="og:type" content="website">
 <meta property="og:locale" content="pt_BR">
 <meta property="og:title" content="${title} | ${config.name}">
 <meta property="og:description" content="${description}">
 <meta property="og:url" content="${config.siteUrl?new URL(slug+'.html',config.siteUrl.replace(/\/?$/,'/')).href:''}">
 <meta property="og:image" content="${config.siteUrl?new URL('assets/images/clinica-premium.webp',config.siteUrl.replace(/\/?$/,'/')).href:'assets/images/clinica-premium.webp'}">
 ${config.siteUrl?`<link rel="canonical" href="${new URL(slug+'.html',config.siteUrl.replace(/\/?$/,'/')).href}">`:''}
 <meta name="twitter:card" content="summary_large_image">
 <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
 <link rel="preconnect" href="https://fonts.googleapis.com">
 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 <link rel="stylesheet" href="assets/css/styles.css">
 <script type="module" src="assets/js/app.js"></script>
 ${slug==='index'?`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:config.name,description:config.demo?'Site de demonstração de clínica multidisciplinar fictícia.':description,inLanguage:'pt-BR',...(config.siteUrl?{url:config.siteUrl}:{})})}</script>`:''}
</head>
<body>
 <div id="site-header"></div>
 <main id="conteudo" tabindex="-1"><div class="container loading-skeleton" aria-busy="true" aria-label="Carregando conteúdo"><h1>${title}</h1><span></span><span></span></div></main>
 <div id="site-footer"></div>
 <noscript><div class="container"><p>Ative o JavaScript para explorar os catálogos, filtros e o agendamento desta demonstração.</p><nav aria-label="Páginas do site"><a href="index.html">Início</a> · <a href="sobre.html">Sobre nós</a> · <a href="especialidades.html">Especialidades</a> · <a href="profissionais.html">Profissionais</a> · <a href="unidades.html">Unidades</a> · <a href="contato.html">Contato</a></nav></div></noscript>
</body>
</html>
`);
}
