import test from 'node:test';
import assert from 'node:assert/strict';
import {validBooking,validLookup,validReceipt,validTracking,atendimentoUrl,validRequestOrigin} from '../src/lib/appointments.ts';
const booking={name:'Maria',email:'maria@example.org',phone:'',service:'Orientacao',date:'2028-01-15',period:'morning',message:'',locale:'pt',consent:true,idempotencyKey:'01234567-1234-1234-1234-012345678901'};
test('booking validates consent, calendar date, bounds and locale at server boundary',()=>{
 assert(validBooking(booking));
 for(const data of [{...booking,consent:false},{...booking,date:'2028-02-30'},{...booking,date:'2020-01-01'},{...booking,name:' '},{...booking,email:'invalid'},{...booking,message:'x'.repeat(1201)},{...booking,period:'night'},{...booking,locale:'xx'},{...booking,idempotencyKey:'guess'}])assert(!validBooking(data));
});
test('lookup requires reference and 128-bit code; response contracts are checked',()=>{
 const proof={reference:'AAAI-2026-ABCDEF123456',accessCode:'a'.repeat(32)};assert(validLookup(proof));assert(!validLookup({...proof,accessCode:'guess'}));
 assert(validReceipt({...proof,state:'received'}));assert(!validReceipt({...proof,state:'random'}));
 assert(validTracking({reference:proof.reference,state:'scheduled',scheduledAt:'2028-01-15T10:30',publicMessage:'Confirmado',updatedAt:'2026-10-30T12:00:00Z'}));
});
test('atendimento endpoints support pretty and rest_route WordPress URLs',()=>{
 assert.equal(atendimentoUrl('http://localhost/site/wp-json','lookup').href,'http://localhost/site/wp-json/aaai-atendimento/v1/lookup');
 assert.equal(atendimentoUrl('http://localhost/site/?rest_route=/','appointments').searchParams.get('rest_route'),'/aaai-atendimento/v1/appointments');
 assert.throws(()=>atendimentoUrl('file:///tmp','lookup'));
});

test('origin validation uses the public Host when Next has an internal request URL',()=>{
 assert(validRequestOrigin('http://127.0.0.1:3231','http://localhost:3231/api/appointments','127.0.0.1:3231'));
 assert(validRequestOrigin('https://aaai.example','http://localhost:3000/api/appointments','aaai.example'));
 assert(!validRequestOrigin('https://other.example','http://localhost:3000/api/appointments','aaai.example'));
 assert(!validRequestOrigin('null','http://localhost:3000/api/appointments','localhost:3000'));
});
