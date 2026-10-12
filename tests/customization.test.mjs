import test from 'node:test';
import assert from 'node:assert/strict';
import {plans} from '../assets/js/data/planos.js';
import {home} from '../assets/js/pages/home.js';
test('desativar um plano também remove sua prévia da homepage',()=>{
 const plan=plans[0];const active=plan.active;
 try{plan.active=false;assert.ok(!home().includes(plan.name),'Homepage ainda mostra convênio desativado');}finally{plan.active=active;}
});
