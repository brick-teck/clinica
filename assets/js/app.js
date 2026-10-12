import { config } from './data/config.js';
import { specialties } from './data/especialidades.js';
import { header,footer,notFound } from './components.js';
import { home } from './pages/home.js';
import { catalog,initCatalog } from './pages/catalogs.js';
import { detail } from './pages/details.js';
import { about,contact,privacy } from './pages/institutional.js';
import { initAppointment } from './appointment.js';
import { initContact } from './contact.js';
import { normalize,safeURL } from './utils.js';

const page=location.pathname.split('/').pop()||'index.html';
const main=document.getElementById('conteudo');
const meta={
 'index.html':['Cuidado especializado para cada momento da sua vida','Conheça a Clínica Essentia, template fictício de clínica multidisciplinar com especialidades, profissionais e unidades.'],
 'sobre.html':['Sobre nós','Conheça a proposta de escuta, acolhimento e cuidado integrado da Clínica Essentia demonstrativa.'],
 'especialidades.html':['Especialidades','Explore 30 áreas de atendimento e encontre especialidades por nome, categoria e unidade.'],
 'profissionais.html':['Profissionais','Conheça os perfis fictícios por especialidade e unidade de atendimento.'],
 'planos.html':['Planos de saúde','Consulte convênios fictícios e informações para confirmar cobertura antes de agendar.'],
 'unidades.html':['Unidades','Conheça as unidades Centro e Norte, espaços demonstrativos da Clínica Essentia.'],
 'blog.html':['Blog','Artigos demonstrativos sobre organização da consulta e cuidado multidisciplinar.'],
 'contato.html':['Contato','Escolha uma unidade e conheça os canais de contato configuráveis do template.'],
 'privacidade.html':['Privacidade','Informações sobre dados, canais externos e funcionamento desta demonstração.'],
};
function metadata(title,description,found=true) {
 document.title=`${title} | ${config.name}`;
 for(const [selector,value]of [['meta[name="description"]',description],['meta[property="og:title"]',document.title],['meta[property="og:description"]',description]])document.querySelector(selector)?.setAttribute('content',value);
 if(!found)document.querySelector('meta[name="robots"]').content='noindex, follow';
 const base=safeURL(config.siteUrl);if(base){
  const url=new URL(page+location.search,base.endsWith('/')?base:base+'/').href;
  const canonical=document.querySelector('link[rel="canonical"]')||document.createElement('link');canonical.rel='canonical';canonical.href=url;if(!canonical.isConnected)document.head.append(canonical);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content',url);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content',new URL('assets/images/clinica-premium.webp',base.endsWith('/')?base:base+'/').href);
 }
}
try {
 for(const [key,value]of Object.entries(config.colors))document.documentElement.style.setProperty(`--${key}`,value);
 let content;
 if(page==='index.html')content=home();
 else if(['especialidades.html','profissionais.html','planos.html','unidades.html','blog.html'].includes(page))content=catalog(page);
 else if(['especialidade.html','profissional.html','unidade.html','artigo.html'].includes(page)){
  const result=detail(page,new URLSearchParams(location.search).get('slug'));content=result.html;metadata(result.title,result.description,result.found);
 }else if(page==='sobre.html')content=about();else if(page==='contato.html')content=contact();else if(page==='privacidade.html')content=privacy();else {content=notFound('Página');metadata('Página não encontrada','Este endereço não está disponível.',false);}
 if(meta[page])metadata(...meta[page]);
 document.getElementById('site-header').innerHTML=header(page);
 main.innerHTML=content;document.getElementById('site-footer').innerHTML=footer();
 initNavigation();initAppointment();initCatalog(page);initContact();initHomeSearch();initReveal();
}catch(error){
 console.error('Não foi possível carregar o template.',error);
 main.innerHTML='<section class="section"><div class="container"><h1>O conteúdo não pôde ser carregado.</h1><p>Atualize a página ou verifique se o projeto está sendo servido por HTTP.</p><a class="button primary" href="index.html">Voltar ao início</a></div></section>';
}
function initNavigation() {
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav'),toggle=document.querySelector('.specialty-toggle'),mega=document.querySelector('#mega-menu');
 const closeMega=()=>{mega.hidden=true;toggle.setAttribute('aria-expanded','false');};
 const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');closeMega();};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');if(!open)closeMega();});
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';mega.hidden=!open;toggle.setAttribute('aria-expanded',String(open));});
 document.addEventListener('click',ev=>{if(!ev.target.closest('.specialty-nav'))closeMega();if(!ev.target.closest('.site-header'))closeMenu();});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){if(!mega.hidden){closeMega();toggle.focus();}else if(nav.classList.contains('open')){closeMenu();menu.focus();}}});
 const mq=matchMedia('(min-width: 1180px)');mq.addEventListener('change',closeMenu);
 document.querySelector('.site-header').addEventListener('focusout',ev=>{if(ev.relatedTarget&&!document.querySelector('.site-header').contains(ev.relatedTarget))closeMenu();});
 const input=document.querySelector('#mega-search'),clear=input.closest('.search-field').querySelector('.clear-search');
 const search=()=>{const filtered=specialties.filter(s=>normalize(s.name).includes(normalize(input.value)));document.querySelector('#mega-results').innerHTML=filtered.map(s=>`<a href="especialidade.html?slug=${s.slug}">${s.name}<span aria-hidden="true">↗</span></a>`).join('');document.querySelector('#mega-empty').hidden=!!filtered.length;clear.hidden=!input.value;};
 input.addEventListener('input',ev=>{if(!ev.isComposing)search();});input.addEventListener('compositionend',search);clear.addEventListener('click',()=>{input.value='';search();input.focus();});
}
function initHomeSearch() {
 const form=document.querySelector('#home-search');if(!form)return;const input=form.querySelector('input'),clear=form.querySelector('.clear-search');
 form.addEventListener('submit',ev=>{ev.preventDefault();location.href=`especialidades.html${input.value.trim()?'?q='+encodeURIComponent(input.value.trim()):''}`;});
 input.addEventListener('input',()=>clear.hidden=!input.value);clear.addEventListener('click',()=>{input.value='';clear.hidden=true;input.focus();});
}
function initReveal() {
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window))return;
 const observer=new IntersectionObserver(entries=>{for(const item of entries)if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target);}},{threshold:.06});
 document.querySelectorAll('.section-heading,.editorial-copy,.editorial-image').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
}
