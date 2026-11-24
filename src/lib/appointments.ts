export const appointmentStates=['received','review','scheduled','in_progress','completed','cancelled'] as const;
export type AppointmentState=(typeof appointmentStates)[number];
export type Booking={name:string;email:string;phone:string;service:string;date:string;period:'morning'|'afternoon';message:string;locale:string;consent:boolean;idempotencyKey:string};
const record=(v:unknown):v is Record<string,unknown>=>typeof v==='object'&&v!==null&&!Array.isArray(v);
export function appointmentToday(now=new Date()) {return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Luanda',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function validBooking(value:unknown):value is Booking {
 if(!record(value))return false;
 for(const key of ['name','email','phone','service','date','period','message','locale','idempotencyKey'])if(typeof value[key]!=='string')return false;
 const v=value as unknown as Booking;
 const d=new Date(`${v.date}T12:00:00Z`);
 const today=appointmentToday();
 return v.name.trim().length>=2&&v.name.length<=100&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)&&v.email.length<=254&&v.phone.length<=40&&v.service.trim().length>=2&&v.service.length<=150&&/^\d{4}-\d{2}-\d{2}$/.test(v.date)&&!Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v.date&&v.date>=today&&['morning','afternoon'].includes(v.period)&&v.message.length<=1200&&['pt','en','fr','es'].includes(v.locale)&&v.consent===true&&/^[a-f0-9-]{32,80}$/i.test(v.idempotencyKey);
}
export function validLookup(value:unknown):value is {reference:string;accessCode:string} {
 return record(value)&&typeof value.reference==='string'&&/^AAAI-\d{4}-[A-F0-9]{12}$/.test(value.reference)&&typeof value.accessCode==='string'&&/^[a-f0-9]{32}$/.test(value.accessCode);
}
export function atendimentoUrl(base:string,endpoint:'health'|'appointments'|'lookup') {
 const url=new URL(base);
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('Invalid WordPress URL');
 if(url.searchParams.has('rest_route'))url.searchParams.set('rest_route',`${url.searchParams.get('rest_route')?.replace(/\/+$/,'')||''}/aaai-atendimento/v1/${endpoint}`);
 else url.pathname=`${url.pathname.replace(/\/+$/,'')}/aaai-atendimento/v1/${endpoint}`;
 return url;
}
export function validReceipt(value:unknown):value is {reference:string;accessCode:string;state:AppointmentState} {
 if(!record(value))return false;const state=value.state;
 return validLookup(value)&&appointmentStates.includes(state as AppointmentState);
}
export function validTracking(value:unknown):value is {reference:string;state:AppointmentState;scheduledAt:string;publicMessage:string;updatedAt:string} {
 return record(value)&&typeof value.reference==='string'&&/^AAAI-\d{4}-[A-F0-9]{12}$/.test(value.reference)&&appointmentStates.includes(value.state as AppointmentState)&&typeof value.scheduledAt==='string'&&typeof value.publicMessage==='string'&&value.publicMessage.length<=4800&&typeof value.updatedAt==='string';
}

export function validRequestOrigin(origin:string|null,requestUrl:string,host:string|null) {
 if(!origin)return true;
 try {
  const source=new URL(origin),expectedHost=(host||new URL(requestUrl).host).toLowerCase();
  return ['http:','https:'].includes(source.protocol)&&source.host.toLowerCase()===expectedHost;
 }catch{return false;}
}
