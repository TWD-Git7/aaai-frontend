/** Public contact details supplied in the approved header reference. No secrets. */
export function publicContacts(env:Record<string,string|undefined>) {
  const rawEmail=env.AAAI_CONTACT_EMAIL?.trim()||'geral@apoioimigrantes.com';
  const rawPhone=env.AAAI_CONTACT_PHONE?.trim()||'+244 924 217 955';
  const email=/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(rawEmail)?rawEmail:'';
  const phone=/^\+?[\d\s()-]{8,25}$/.test(rawPhone)?rawPhone:'';
  const rawWhatsapp=env.AAAI_WHATSAPP_NUMBER?.trim()||'';
  const digits=rawWhatsapp.replace(/\D/g,'');
  const whatsapp=/^\+?[\d\s()-]+$/.test(rawWhatsapp)&&digits.length>=8&&digits.length<=15?digits:'';
  const rawMember=env.AAAI_MEMBER_URL?.trim()||'';
  let memberUrl='';
  try {const url=new URL(rawMember);if(['https:','http:'].includes(url.protocol)&&!url.username&&!url.password)memberUrl=url.href;}catch{}
  return {email,phone,whatsapp,memberUrl,address:env.AAAI_CONTACT_ADDRESS?.trim()||''};
}
export type PublicContacts=ReturnType<typeof publicContacts>;
