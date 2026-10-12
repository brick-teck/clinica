import { specialties,categories } from '../data/especialidades.js';
import { professionals } from '../data/profissionais.js';
import { plans } from '../data/planos.js';
import { units } from '../data/unidades.js';
import { articles } from '../data/artigos.js';
import { heroSection,breadcrumbs,searchField,selectField,specialtyCard,professionalCard,insuranceCard,unitCard,blogCard,emptyState,appointmentCTA } from '../components.js';
import { filterItems } from '../utils.js';
const definitions = {
 'especialidades.html':{name:'Especialidades',eyebrow:'Diferentes olhares. O mesmo cuidado.',title:'Encontre o cuidado que você procura.',description:'Explore nossas 30 áreas de atendimento. Consultas, terapias e exames organizados para facilitar sua escolha.',items:specialties,card:specialtyCard,columns:'three',unit:true,category:true,placeholder:'Ex.: dermatologia, pediatria, nutrição'},
 'profissionais.html':{name:'Profissionais',eyebrow:'Nossa equipe',title:'Pessoas que fazem parte do cuidado.',description:'Conheça os perfis demonstrativos e encontre profissionais por área de atuação ou unidade.',items:professionals,card:professionalCard,columns:'four',unit:true,specialty:true,placeholder:'Buscar pelo nome do profissional'},
 'planos.html':{name:'Planos de saúde',eyebrow:'Antes de agendar',title:'Clareza sobre seu plano de saúde.',description:'Todos os convênios abaixo são exemplos fictícios. Em uma clínica real, confirme a cobertura com a equipe e sua operadora.',items:plans.filter(p=>p.active),card:insuranceCard,columns:'four',unit:true,specialty:true,placeholder:'Buscar pelo nome do plano'},
 'unidades.html':{name:'Unidades',eyebrow:'Conheça nossos espaços',title:'Perto de você, em cada encontro.',description:'Duas unidades demonstrativas, uma mesma proposta de acolhimento. Escolha um espaço para conhecer.',items:units,card:unitCard,columns:'two',placeholder:'Buscar unidade'},
 'blog.html':{name:'Blog',eyebrow:'Essentia em palavras',title:'Informação para acompanhar você.',description:'Leituras sobre o encontro com o cuidado, a organização da consulta e a nossa proposta. Artigos demonstrativos.',items:articles,card:blogCard,columns:'three',category:true,placeholder:'Buscar artigo'},
};
export function catalog(page) {
 const d=definitions[page];const params=new URLSearchParams(location.search);
 const cats=page==='blog.html'?[...new Set(articles.map(a=>a.category))]:categories;
 return `${breadcrumbs([[d.name]])}${heroSection(d)}<section class="section catalog-section"><div class="container"><div class="filter-bar" id="catalog-filters">${searchField(`Buscar ${d.name.toLowerCase()}`,d.placeholder,'catalog-search',params.get('q')||'')}${d.category?selectField('Categoria','filter-category',cats,params.get('category')||'','Todas as categorias'):''}${d.specialty?selectField('Especialidade','filter-specialty',specialties,params.get('specialty')||'','Todas as especialidades'):''}${d.unit?selectField('Unidade','filter-unit',units,params.get('unit')||'','Todas as unidades'):''}</div><div class="results-toolbar"><p id="result-count" role="status" aria-live="polite"></p><button class="text-button" type="button" data-reset>Limpar filtros</button></div><div id="catalog-results" class="grid ${d.columns}"></div>${page==='planos.html'?`<div class="info-panel"><h2>Antes de confirmar sua consulta</h2><p>O nome do plano não garante a cobertura. Confira a categoria, a unidade, o profissional e possíveis autorizações. Os cadastros deste template não representam parcerias reais.</p><button type="button" class="button primary" data-book>Confirme a cobertura com nossa equipe</button></div>`:''}${page==='profissionais.html'?'<p class="section-caption">Todos os perfis são fictícios. Registros, formações e retratos são demonstrativos.</p>':''}</div></section>${appointmentCTA()}`;
}
export function initCatalog(page) {
 const d=definitions[page];if(!d)return;
 const input=document.querySelector('#catalog-search');
 const selectIds={category:'filter-category',specialty:'filter-specialty',unit:'filter-unit'};
 function render() {
  const filters={q:input.value};
  for(const [key,id] of Object.entries(selectIds)) filters[key]=document.getElementById(id)?.value||'';
  const items=filterItems(d.items,filters);
  document.querySelector('#catalog-results').innerHTML=items.length?items.map(d.card).join(''):emptyState();
  document.querySelector('#result-count').textContent=`${items.length} ${items.length===1?'resultado encontrado':'resultados encontrados'}`;
  const params=new URLSearchParams();for(const [key,value]of Object.entries(filters))if(value.trim())params.set(key,value.trim());
  history.replaceState(null,'',`${page}${params.size?'?'+params.toString():''}`);
  input.closest('.search-field').querySelector('.clear-search').hidden=!input.value;
 }
 input.addEventListener('input',ev=>{if(!ev.isComposing)render();});input.addEventListener('compositionend',render);
 document.querySelectorAll('#catalog-filters select').forEach(el=>el.addEventListener('change',render));
 document.querySelector('.catalog-section').addEventListener('click',ev=>{if(ev.target.closest('[data-reset]')){input.value='';document.querySelectorAll('#catalog-filters select').forEach(el=>el.value='');render();input.focus();}});
 input.closest('.search-field').querySelector('.clear-search').addEventListener('click',()=>{input.value='';render();input.focus();});
 render();
}
