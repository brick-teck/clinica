// Optional QA tool; install playwright-core outside the project or make it available locally.
// On this Windows workspace it is resolved from %TEMP%/essentia-qa.
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { mkdir,writeFile,readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { specialties } from '../assets/js/data/especialidades.js';
import { professionals } from '../assets/js/data/profissionais.js';
import { units } from '../assets/js/data/unidades.js';
import { articles } from '../assets/js/data/artigos.js';
const library=process.env.PLAYWRIGHT_MODULE||path.join(process.env.TEMP,'essentia-qa/node_modules/playwright-core/index.mjs');
const {chromium}=await import(pathToFileURL(library));
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const base=process.env.QA_URL||'http://127.0.0.1:4173';
const checks=[];const errors=[];await mkdir('artifacts',{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
page.on('pageerror',error=>errors.push(String(error)));
page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().includes('favicon'))errors.push(msg.text());});
async function go(route=''){
 const response=await page.goto(`${base}/${route}`);assert.equal(response.status(),200,route);await page.waitForSelector('.site-header');
 assert.equal(await page.locator('main h1').count(),1);assert.ok(!(await page.locator('main').innerText()).includes('O conteúdo não pôde ser carregado'));
}
async function check(label,fn){await fn();checks.push(label);console.log(`PASS ${label}`);}
try {
 await check('14 rotas e todos os detalhes de dados renderizam',async()=>{
  for(const route of ['','sobre.html','especialidades.html','profissionais.html','planos.html','unidades.html','blog.html','contato.html','privacidade.html'])await go(route);
  for(const [route,items]of [['especialidade',specialties],['profissional',professionals],['unidade',units],['artigo',articles]])for(const item of items){await go(`${route}.html?slug=${item.slug}`);assert.equal((await page.locator('main h1').innerText()).trim(),item.name||item.title);}
  await go('especialidade.html?slug=invalido');assert.ok((await page.locator('main h1').innerText()).includes('não encontrado'));assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, follow');
 });
 await check('busca, filtros combinados, estado vazio e limpeza',async()=>{
  await go('especialidades.html');assert.equal(await page.locator('#catalog-results .specialty-card').count(),30);
  await page.locator('#catalog-search').fill('clinica medica');assert.equal(await page.locator('#catalog-results .specialty-card').count(),1);assert.ok(page.url().includes('q=clinica'));
  await page.getByRole('button',{name:'Limpar buscar especialidades'}).click();assert.equal(await page.locator('#catalog-results .specialty-card').count(),30);
  await page.locator('#filter-category').selectOption('Exames');await page.locator('#filter-unit').selectOption('unidade-norte');assert.equal(await page.locator('.empty-state').count(),1);
  await page.locator('.empty-state [data-reset]').click();assert.equal(await page.locator('#catalog-results .specialty-card').count(),30);
  await go('profissionais.html?q=Clara&specialty=cardiologia&unit=unidade-centro');assert.equal(await page.locator('.professional-card').count(),1);
  await page.locator('#filter-unit').selectOption('unidade-norte');assert.equal(await page.locator('.professional-card').count(),0);
  await go('planos.html');await page.locator('#filter-specialty').selectOption('nutricao');await page.locator('#filter-unit').selectOption('unidade-norte');assert.equal(await page.locator('.insurance-card').count(),3);
 });
 await check('mega menu pesquisa e Escape',async()=>{
  await go();await page.locator('.specialty-toggle').click();assert.equal(await page.locator('#mega-menu').isVisible(),true);
  await page.locator('#mega-search').fill('nutricao');assert.equal(await page.locator('#mega-results a').count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('#mega-menu').isVisible(),false);
 });
 await check('agendamento respeita perfil, unidade e ausência de canal',async()=>{
  await go('profissional.html?slug=clara-monteiro');await page.locator('main [data-book]').first().click();
  assert.equal(await page.locator('#booking-unit').inputValue(),'unidade-centro');assert.equal(await page.locator('#booking-specialty').inputValue(),'cardiologia');assert.equal(await page.locator('#booking-professional').inputValue(),'clara-monteiro');
  assert.equal(await page.locator('#booking-continue').isVisible(),false);assert.equal(await page.locator('#booking-unavailable').isDisabled(),true);
  await page.locator('#booking-unit').selectOption('unidade-norte');assert.equal(await page.locator('#booking-professional').inputValue(),'');assert.ok(!(await page.locator('#booking-professional').innerText()).includes('Clara'));
  await page.keyboard.press('Escape');assert.equal(await page.locator('#appointment-dialog').isVisible(),false);assert.equal(await page.locator('main [data-book]').first().evaluate(el=>el===document.activeElement),true);
  await go('unidade.html?slug=unidade-norte');await page.locator('main [data-book]').first().click();assert.equal(await page.locator('#booking-unit').inputValue(),'unidade-norte');await page.keyboard.press('Escape');
  await go('especialidade.html?slug=dermatologia');await page.locator('main [data-book]').first().click();await page.locator('#booking-unit').selectOption('unidade-norte');assert.equal(await page.locator('#booking-specialty').inputValue(),'dermatologia');await page.keyboard.press('Escape');
  await go('profissional.html?slug=rafael-vidal');await page.locator('main [data-book]').first().click();await page.locator('#booking-unit').selectOption('unidade-norte');assert.equal(await page.locator('#booking-professional').inputValue(),'rafael-vidal','Profissional continua elegível na nova unidade');await page.keyboard.press('Escape');
  await page.evaluate(async()=>{const{config}=await import('/assets/js/data/config.js');config.channels['unidade-norte'].whatsapp='5511999999999';});
  await page.locator('main [data-book]').first().click();await page.locator('#booking-unit').selectOption('unidade-norte');const href=await page.locator('#booking-continue').getAttribute('href');assert.equal(new URL(href).hostname,'wa.me');assert.ok(new URL(href).searchParams.get('text').includes('Rafael Vidal'));assert.equal(await page.locator('#booking-continue').isVisible(),true);await page.keyboard.press('Escape');
 });
 await check('contato valida campos e não afirma envio sem canal',async()=>{
  await go('contato.html');await page.locator('#contact-submit').click();assert.equal(await page.locator('[aria-invalid="true"]').count(),3);
  await page.locator('#contact-name').fill('Pessoa de teste');await page.locator('#contact-email').fill('teste@example.com');await page.locator('#contact-message').fill('Informações gerais de atendimento.');await page.locator('#contact-submit').click();assert.ok((await page.locator('#contact-status').innerText()).includes('não foi enviada'));
 });
 await check('nova unidade sem canais tem recuperação no contato',async()=>{
  await go('contato.html');await page.evaluate(async()=>{
   const {units}=await import('/assets/js/data/unidades.js');units.push({slug:'unidade-teste',name:'Unidade Teste',address:'Endereço fictício',hours:'Horário de exemplo'});
   const select=document.getElementById('contact-unit');select.add(new Option('Unidade Teste','unidade-teste'));select.value='unidade-teste';select.dispatchEvent(new Event('change'));
  });
  assert.ok((await page.locator('#contact-details').innerText()).includes('Unidade Teste'));assert.ok((await page.locator('#contact-details').innerText()).includes('Telefone não configurado'));
 });
 await check('links e imagens locais sem destinos vazios',async()=>{
  for(const route of ['','especialidades.html','profissionais.html','planos.html','unidades.html','blog.html','sobre.html']){
   await go(route);const broken=await page.locator('a[href]').evaluateAll(links=>links.filter(a=>a.getAttribute('href')==='#'||a.getAttribute('href')==='').map(a=>a.outerHTML));assert.deepEqual(broken,[]);
   const paths=await page.locator('a[href],img[src]').evaluateAll(els=>[...new Set(els.map(el=>el.getAttribute('href')||el.getAttribute('src')).filter(x=>x&&!/^(https?:|mailto:|tel:|#)/.test(x)))]);
   for(const url of paths){const r=await page.request.get(`${base}/${url}`);assert.equal(r.status(),200,url);}
  }
 });
 await check('desktop, 320, 390, 768, 1024 sem overflow',async()=>{
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});for(const route of ['','especialidades.html','profissionais.html','planos.html','contato.html','especialidade.html?slug=cirurgia-de-cabeca-e-pescoco','profissional.html?slug=clara-monteiro','unidade.html?slug=unidade-norte']){
    await go(route);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: ${route}`);
   }
  }
 });
 await check('menu móvel, teclado, select e modal',async()=>{
  await page.setViewportSize({width:390,height:844});await go();await page.locator('.menu-toggle').click();assert.equal(await page.locator('#main-nav').isVisible(),true);await page.locator('.specialty-toggle').click();assert.equal(await page.locator('#mega-menu').isVisible(),true);await page.keyboard.press('Escape');await page.keyboard.press('Escape');assert.equal(await page.locator('#main-nav').isVisible(),false);
  await page.locator('.header-book').click();await page.locator('#booking-unit').selectOption('unidade-centro');await page.locator('#booking-specialty').selectOption('cardiologia');await page.locator('#booking-professional').focus();await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement.closest('dialog')!==null));await page.screenshot({path:'artifacts/agendamento-mobile.png'});await page.keyboard.press('Escape');
  await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(async im=>{im.loading='eager';try{await im.decode();}catch{}}));});await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
  await go('especialidades.html');await page.locator('#filter-category').focus();await page.keyboard.press('Space');await page.keyboard.press('Escape');await page.screenshot({path:'artifacts/especialidades-mobile.png'});
 });
 await check('acessibilidade automatizada em páginas e modal',async()=>{
  const axe=await readFile(path.join(path.dirname(library),'../axe-core/axe.min.js'),'utf8');
  for(const route of ['','especialidades.html','profissionais.html','contato.html','profissional.html?slug=clara-monteiro']){
   await go(route);await page.addScriptTag({content:axe});const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
   assert.deepEqual(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],route);
  }
  await page.locator('main [data-book]').first().click();const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.deepEqual(result.violations.map(v=>v.id),[],'modal');await page.keyboard.press('Escape');
 });
 await page.setViewportSize({width:1440,height:1000});await go();await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(async im=>{im.loading='eager';try{await im.decode();}catch{}}));});await page.screenshot({path:'artifacts/home-desktop.png'});await page.screenshot({path:'artifacts/home-full.png',fullPage:true});
 await go('especialidade.html?slug=cardiologia');await page.screenshot({path:'artifacts/cardiologia-desktop.png'});
 assert.deepEqual(errors,[],'Console/browser errors');
 await writeFile('artifacts/browser-qa.json',JSON.stringify({checks,errors,date:new Date().toISOString()},null,2));
 console.log(`${checks.length} grupos de verificações passaram; ${errors.length} erros de console.`);
}finally{await browser.close();}
