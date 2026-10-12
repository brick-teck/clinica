import { config } from './data/config.js';
import { units } from './data/unidades.js';
import { specialties } from './data/especialidades.js';
import { professionals } from './data/profissionais.js';
import { icon,selectField } from './components.js';
import { escapeHTML as e,appointmentMessage,whatsappURL } from './utils.js';
export function initAppointment() {
 const dialog=document.createElement('dialog');dialog.id='appointment-dialog';dialog.className='appointment-dialog';dialog.setAttribute('aria-labelledby','appointment-title');
 dialog.innerHTML=`<div class="dialog-header"><span class="eyebrow">Vamos dar o próximo passo</span><button type="button" class="icon-button" data-close aria-label="Fechar agendamento">${icon('close')}</button></div><div class="dialog-body"><h2 id="appointment-title">Seu cuidado, do seu jeito.</h2><p>Escolha a unidade e a área de atendimento. A equipe confirma as informações e o agendamento pelo WhatsApp.</p><div class="booking-steps"><span>1. Unidade</span><span>2. Especialidade</span><span>3. Profissional</span></div>${selectField('Unidade','booking-unit',units,'','Escolha a unidade')}${selectField('Especialidade','booking-specialty',[],'','Escolha a unidade primeiro')}${selectField('Profissional (opcional)','booking-professional',[],'','Sem preferência')}<div class="message-preview"><span class="eyebrow">Sua mensagem</span><p id="booking-message">Selecione uma unidade e uma especialidade para preparar a mensagem.</p></div><p id="booking-status" class="booking-status" role="status" aria-live="polite"></p><a id="booking-continue" class="button primary" target="_blank" rel="noopener noreferrer" hidden>Continuar pelo WhatsApp ${icon('arrow')}</a><button type="button" id="booking-unavailable" class="button primary" disabled>Continuar pelo WhatsApp ${icon('arrow')}</button><button type="button" class="text-button" id="booking-copy" hidden>Copiar mensagem de exemplo</button><p class="small">Demonstração sem disponibilidade de horários ou confirmação automática.</p></div>`;
 document.body.append(dialog);
 const unitSelect=dialog.querySelector('#booking-unit'),specialtySelect=dialog.querySelector('#booking-specialty'),professionalSelect=dialog.querySelector('#booking-professional');
 let trigger=null,pendingSpecialty='',pendingProfessional='';
 const options=(list,label)=>`<option value="">${label}</option>${list.map(i=>`<option value="${e(i.slug)}">${e(i.name)}</option>`).join('')}`;
 function refresh(mode) {
  const unit=units.find(u=>u.slug===unitSelect.value);
  if(mode==='unit') {
   const old=specialtySelect.value||pendingSpecialty;
   specialtySelect.innerHTML=options(specialties.filter(s=>s.units.includes(unit?.slug)),'Escolha a especialidade');
   if(specialties.some(s=>s.slug===old && s.units.includes(unit?.slug)))specialtySelect.value=old;
   specialtySelect.disabled=!unit;pendingSpecialty='';
  }
  const specialty=specialties.find(s=>s.slug===specialtySelect.value);
  if(mode==='unit'||mode==='specialty') {
   const old=pendingProfessional || professionalSelect.value;
   const eligible=professionals.filter(p=>p.units.includes(unit?.slug)&&p.specialties.includes(specialty?.slug));
   professionalSelect.innerHTML=options(eligible,'Sem preferência');
   if(eligible.some(p=>p.slug===old))professionalSelect.value=old;
   professionalSelect.disabled=!specialty;pendingProfessional='';
  }
  const professional=professionals.find(p=>p.slug===professionalSelect.value);
  const ready=!!(unit&&specialty);const msg=ready?appointmentMessage({unit,specialty,professional}):'';
  dialog.querySelector('#booking-message').textContent=msg||'Selecione uma unidade e uma especialidade para preparar a mensagem.';
  const url=ready?whatsappURL(config.channels[unit.slug]?.whatsapp,msg):null;
  const link=dialog.querySelector('#booking-continue');link.hidden=!url;if(url)link.href=url;else link.removeAttribute('href');
  dialog.querySelector('#booking-unavailable').hidden=!!url;dialog.querySelector('#booking-copy').hidden=!ready;
  dialog.querySelector('#booking-status').textContent=!ready?'Escolha a unidade e a especialidade para continuar.':url?'Você será encaminhado ao WhatsApp da unidade. A consulta depende da confirmação da equipe.':'WhatsApp não configurado nesta demonstração. Você pode copiar a mensagem de exemplo; nenhum contato será realizado.';
 }
 document.addEventListener('click',ev=>{
  const control=ev.target.closest('[data-book]');if(!control)return;
  trigger=control;pendingSpecialty=control.dataset.specialty||'';pendingProfessional=control.dataset.professional||'';
  unitSelect.value=control.dataset.unit||'';specialtySelect.value='';professionalSelect.value='';
  // Keep a specialty preset until the visitor chooses an eligible unit.
  if(unitSelect.value)refresh('unit');else {
   specialtySelect.innerHTML=options([],'Escolha a unidade primeiro');specialtySelect.disabled=true;
   professionalSelect.innerHTML=options([],'Sem preferência');professionalSelect.disabled=true;refresh('professional');
  }
  dialog.showModal();document.body.classList.add('dialog-open');unitSelect.focus();
 });
 unitSelect.addEventListener('change',()=>refresh('unit'));specialtySelect.addEventListener('change',()=>refresh('specialty'));professionalSelect.addEventListener('change',()=>refresh('professional'));
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');trigger?.focus();});
 dialog.querySelector('#booking-copy').addEventListener('click',async()=>{
  try {await navigator.clipboard.writeText(dialog.querySelector('#booking-message').textContent);dialog.querySelector('#booking-status').textContent='Mensagem de exemplo copiada. Nenhum contato foi realizado.';}
  catch {dialog.querySelector('#booking-status').textContent='Não foi possível copiar automaticamente. Selecione e copie o texto da mensagem acima.';}
 });
}
