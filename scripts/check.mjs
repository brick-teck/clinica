import {readdirSync,readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {specialties} from '../assets/js/data/especialidades.js';
import {specialtyDetail,professionalDetail,unitDetail,articleDetail} from '../assets/js/pages/details.js';
import {professionals} from '../assets/js/data/profissionais.js';
import {units} from '../assets/js/data/unidades.js';
import {articles} from '../assets/js/data/artigos.js';
import {home} from '../assets/js/pages/home.js';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?walk(path.join(dir,item.name)):[path.join(dir,item.name)]);
const files=[...walk('assets/js'),...walk('scripts'),...walk('tests')];
for(const file of files.filter(f=>/\.(m?js)$/.test(f))){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,`${file}: ${result.stderr}`);}
const rendered=[home(),...specialties.map(specialtyDetail),...professionals.map(professionalDetail),...units.map(unitDetail),...articles.map(articleDetail)];
let links=0;
for(const html of rendered){assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1);for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=match[1];if(/^(https?:|mailto:|tel:|#)/.test(url))continue;assert.ok(existsSync(url.split('?')[0]),url);links++;
}assert.ok(!/href="#"/.test(html));}
assert.equal(new Set(specialties.map(s=>s.description)).size,30);
assert.ok(existsSync('sitemap.xml'));assert.ok(readFileSync('sitemap.xml','utf8').includes('unidade.html?slug=unidade-norte'));
console.log(`${files.length} arquivos de código verificados; ${rendered.length} páginas renderizadas; ${links} referências locais válidas.`);
