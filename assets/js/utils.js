export const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const filterItems = (items,{q='',unit='',specialty='',category=''}={}) => items.filter(item =>
 normalize(item.name || item.title).includes(normalize(q)) &&
 (!unit || item.units?.includes(unit)) &&
 (!specialty || item.specialties?.length===0 || item.specialties?.includes(specialty)) &&
 (!category || item.category===category));
export const appointmentMessage = ({unit,specialty,professional}) => `Olá! Gostaria de informações para agendar ${specialty ? `uma consulta de ${specialty.name}` : 'uma consulta'} na ${unit.name}.${professional ? ` Tenho interesse no atendimento com ${professional.name}.` : ''}`;
export function whatsappURL(phone,message) {
 const number=String(phone || '').replace(/\D/g,'');
 if(!/^55[1-9]\d\d{8,9}$/.test(number)) return null;
 return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export const safeURL = value => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : null; } catch { return null; } };
export const dateLabel = value => new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`));
