import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const ready = existsSync(new URL('../assets/js/data/especialidades.js', import.meta.url));
test('catálogo obrigatório está disponível', () => assert.ok(ready, 'Os dados ainda precisam ser implementados'));
if (ready) {
  const { specialties } = await import('../assets/js/data/especialidades.js');
  const { professionals } = await import('../assets/js/data/profissionais.js');
  const { units } = await import('../assets/js/data/unidades.js');
  const { plans } = await import('../assets/js/data/planos.js');
  const { articles } = await import('../assets/js/data/artigos.js');
  const { filterItems, appointmentMessage, whatsappURL } = await import('../assets/js/utils.js');
  test('30 especialidades distintas têm conteúdo próprio', () => {
    assert.equal(specialties.length, 30);
    assert.equal(new Set(specialties.map(s => s.slug)).size, 30);
    assert.equal(new Set(specialties.map(s => s.description)).size, 30);
    for (const s of specialties) { assert.ok(s.about && s.when.length && s.services.length && s.faq.length); }
  });
  test('relações apontam para dados existentes', () => {
    assert.ok(professionals.length >= 12); assert.equal(units.length, 2); assert.ok(articles.length >= 4);
    for (const record of [...specialties, ...professionals, ...plans]) {
      for (const id of record.units || []) assert.ok(units.some(u => u.slug === id), id);
      for (const id of record.specialties || []) assert.ok(specialties.some(s => s.slug === id), id);
      for (const id of record.plans || []) assert.ok(plans.some(p => p.slug === id), id);
    }
    for (const p of professionals) for (const id of p.specialties) {
      const s = specialties.find(s => s.slug === id);
      for (const u of p.units) assert.ok(s.units.includes(u), `${p.slug}: unidade incompatível`);
    }
  });
  test('pesquisa ignora acentos e combina filtros', () => {
    assert.equal(filterItems(specialties, {q:' CLINICA MEDICA '})[0].slug, 'clinica-medica');
    const list = filterItems(professionals, {q:'Clara', unit:'unidade-centro', specialty:'cardiologia'});
    assert.equal(list.length, 1);
    assert.equal(filterItems(professionals, {q:'Clara', unit:'unidade-norte', specialty:'cardiologia'}).length, 0);
    assert.equal(filterItems(specialties, {q:'inexistente'}).length, 0);
  });
  test('WhatsApp exige telefone válido e codifica mensagem', () => {
    assert.equal(whatsappURL('', 'Olá'), null);
    assert.equal(whatsappURL('000', 'Olá'), null);
    const msg = appointmentMessage({unit:units[0],specialty:specialties.find(s=>s.slug==='cardiologia')});
    assert.ok(msg.includes('Cardiologia') && msg.includes('Unidade Centro'));
    const url = new URL(whatsappURL('5511999999999', msg));
    assert.equal(url.hostname, 'wa.me'); assert.equal(url.searchParams.get('text'), msg);
  });
}
