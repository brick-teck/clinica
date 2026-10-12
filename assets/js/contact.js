import { units } from './data/unidades.js';
import { config } from './data/config.js';
import { icon,bookButton } from './components.js';
import { escapeHTML as e } from './utils.js';
export function initContact() {
 const selector=document.querySelector('#contact-unit');if(!selector)return;
 const emailValid=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
 function render() {
  const u=units.find(u=>u.slug===selector.value);
  if(!u){document.querySelector('#contact-details').innerHTML='<p>Escolha uma unidade para conhecer os canais.</p>';return;}
  document.querySelector('#message-unit').value=u.slug;
  const c=config.channels[u.slug]||{};
  document.querySelector('#contact-details').innerHTML=`<div class="contact-unit-card"><h2>${e(u.name)}</h2><div class="contact-line">${icon('pin')}<p>${e(u.address)}</p></div><div class="contact-line">${icon('clock')}<p>${e(u.hours)}</p></div><div class="contact-line">${icon('phone')}${c.phone?`<a href="tel:${e(c.phone.replace(/[^\d+]/g,''))}">${e(c.phone)}</a>`:'<p>Telefone não configurado.</p>'}</div><div class="contact-line">${icon('mail')}${emailValid(c.email||config.email)?`<a href="mailto:${e(c.email||config.email)}">${e(c.email||config.email)}</a>`:'<p>E-mail não configurado.</p>'}</div>${bookButton('Consultar canais da unidade',`data-unit="${u.slug}"`,'outline')}</div>`;
 }
 selector.addEventListener('change',render);render();
 const form=document.querySelector('#contact-form');
 for(const id of ['name','email','message']) {
  const input=document.getElementById(`contact-${id}`);input.setAttribute('aria-describedby',`error-${id}`);
  input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');document.getElementById(`error-${id}`).textContent='';});
 }
 form.addEventListener('submit',async ev=>{
  ev.preventDefault();let invalid=null;
  const values={name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),message:form.elements.message.value.trim()};
  const errors={name:values.name.length<2?'Informe seu nome (ao menos 2 caracteres).':'',email:!emailValid(values.email)?'Informe um e-mail válido.':'',message:values.message.length<5?'Escreva uma mensagem com ao menos 5 caracteres.':''};
  for(const [id,error]of Object.entries(errors)){
   const field=document.getElementById(`contact-${id}`);document.getElementById(`error-${id}`).textContent=error;field.setAttribute('aria-invalid',String(!!error));if(error&&!invalid)invalid=field;
  }
  const status=document.querySelector('#contact-status');
  if(invalid){status.textContent='Confira os campos indicados para continuar.';invalid.focus();return;}
  const unit=units.find(u=>u.slug===document.querySelector('#message-unit').value);
  if(!unit){status.textContent='Escolha a unidade que receberá a mensagem.';document.querySelector('#message-unit').focus();return;}
  const target=config.channels[unit.slug]?.email||config.email;
  if(!emailValid(target)){status.textContent='E-mail de atendimento não configurado nesta demonstração. A mensagem não foi enviada. Configure o canal para habilitar o encaminhamento.';return;}
  const submit=document.querySelector('#contact-submit');submit.disabled=true;submit.setAttribute('aria-busy','true');submit.classList.add('busy');status.textContent='Preparando a mensagem para o aplicativo de e-mail…';
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const body=`Nome: ${values.name}\nE-mail para resposta: ${values.email}\nUnidade: ${unit.name}\n\n${values.message}`;
  location.href=`mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent(`Contato — ${unit.name}`)}&body=${encodeURIComponent(body)}`;
  status.textContent='Mensagem preparada para seu aplicativo de e-mail. Confira o destinatário e envie por lá. Este site não confirma o envio.';
  submit.disabled=false;submit.removeAttribute('aria-busy');submit.classList.remove('busy');
 });
}
