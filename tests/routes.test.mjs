import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
const pages=['index','sobre','especialidades','especialidade','profissionais','profissional','planos','unidades','unidade','blog','artigo','contato','privacidade','404'];
test('todas as rotas HTML podem ser servidas sem build',()=>{
 for(const page of pages){const url=new URL(`../${page}.html`,import.meta.url);assert.ok(existsSync(url),`${page}.html ainda não existe`);const html=readFileSync(url,'utf8');assert.ok(html.includes('id="conteudo"'));assert.ok(html.includes('type="module"'));assert.ok(html.includes('name="description"'));}
});
