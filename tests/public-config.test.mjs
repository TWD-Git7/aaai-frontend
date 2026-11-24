import test from 'node:test';
import assert from 'node:assert/strict';
import {publicContacts} from '../src/lib/public-config.ts';
import {requestLinks,localDate} from '../src/lib/request-links.ts';
test('header uses reference contacts and preserves explicit valid configuration',()=>{
 const defaults=publicContacts({});assert.equal(defaults.phone,'+244 924 217 955');assert.equal(defaults.email,'geral@apoioimigrantes.com');assert.equal(defaults.whatsapp,'');
 const configured=publicContacts({AAAI_CONTACT_PHONE:'+244 999 888 777',AAAI_CONTACT_EMAIL:'support@example.org',AAAI_WHATSAPP_NUMBER:'+244 999 888 777',AAAI_MEMBER_URL:'https://members.example.org/'});
 assert.equal(configured.whatsapp,'244999888777');assert.equal(configured.email,'support@example.org');assert.equal(configured.memberUrl,'https://members.example.org/');
 const invalid=publicContacts({AAAI_MEMBER_URL:'javascript:alert(1)',AAAI_CONTACT_EMAIL:'evil@host.org?body=bad',AAAI_WHATSAPP_NUMBER:'abc123'});
 assert.equal(invalid.memberUrl,'');assert.equal(invalid.email,'');assert.equal(invalid.whatsapp,'');
});
test('request handoff encodes user text without turning it into URL parameters',()=>{
 const body='Nome: José & Ana\nObservações: ?bcc=other@example.org';
 const links=requestLinks({email:'official@example.org',whatsapp:'244999888777',subject:'Atendimento & apoio',body});
 const url=new URL(links.email);assert.equal(url.searchParams.get('body'),body);assert.equal(url.searchParams.get('bcc'),null);
 const wa=new URL(links.whatsapp);assert.equal(wa.hostname,'wa.me');assert.equal(wa.searchParams.get('text'),'Atendimento & apoio\n\n'+body);
 assert.equal(requestLinks({email:'',whatsapp:'',subject:'x',body}).whatsapp,'');
});
test('preferred date uses visitor local day, without UTC offset drift',()=>{
 const now=new Date(2026,9,30,23,55);assert.equal(localDate(now),'2026-10-30');
});
