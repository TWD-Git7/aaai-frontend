import {apiUrl,parseServices,parseContent} from '../src/lib/content.ts';
import {atendimentoUrl} from '../src/lib/appointments.ts';
import {loadEnvironment} from './wordpress-env.mjs';
const env=loadEnvironment();
const base=env.WORDPRESS_API_URL?.trim();
if(!base){
 console.error('FALHA: WORDPRESS_API_URL nao esta configurado.');
 console.error('Execute: npm run configure -- --url "http://localhost/aaai-portal-v1/wordpress/wp-json"');
 process.exitCode=1;
} else {
 let failures=0;
 const languageIndex=process.argv.indexOf('--lang');
 const requested=languageIndex>=0?process.argv[languageIndex+1]:undefined;
 const langs=requested?[requested]:['pt','en','fr','es'];
 try {
  const health=await fetch(apiUrl(base,'health','pt'),{signal:AbortSignal.timeout(10000),cache:'no-store'});
  if(!health.ok)throw Error(`HTTP ${health.status}`);
  const data=await health.json();
  if(data.ok!==true||data.plugin!=='aaai-content')throw Error('Resposta de health inesperada.');
  console.log(`OK health: plugin AAAI ${data.version??'(sem versao)'}`);
 } catch(error){failures++;console.error(`FALHA health: ${error.message}. Confirme WAMP e a activacao do plugin aaai-content.`);}
 const jobs=langs.flatMap(locale=>['services','news','events','projects','partners','slides'].map(kind=>({locale,kind})));
 const results=await Promise.all(jobs.map(async({locale,kind})=>{
  try {
   const response=await fetch(apiUrl(base,kind,locale),{signal:AbortSignal.timeout(10000),cache:'no-store'});
   if(!response.ok)throw Error(`HTTP ${response.status}`);
   const raw=await response.json();
   const items=kind==='services'?parseServices(raw,locale):parseContent(raw,locale);
   if(items===null)throw Error('Contrato JSON invalido (ID, titulo, idioma ou campos).');
   return {ok:true,message:`OK ${locale}/${kind}: ${items.length} publicado(s)${items.length?'':' - lista vazia; publique no WordPress'}`};
  } catch(error){return {ok:false,message:`FALHA ${locale}/${kind}: ${error.message}`};}
 }));
 for(const result of results){console.log(result.message);if(!result.ok)failures++;}
 console.log(failures?`Diagnostico terminou com ${failures} falha(s).`:'API e contratos validados. Listas vazias indicam ausencia de publicacao, nao falha de ligacao.');
 if(failures)process.exitCode=1;
}

if(env.AAAI_ATENDIMENTO_API_KEY?.trim()&&base){
 try {
  const response=await fetch(atendimentoUrl(base,'health'),{headers:{'X-AAAI-Key':env.AAAI_ATENDIMENTO_API_KEY.trim()},cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error(`HTTP ${response.status}`);
  const health=await response.json();if(health.ok!==true||health.version!=='0.7.0')throw Error('Contrato backend inesperado.');
  console.log('OK modulo de atendimentos v0.7.0 e autenticacao servidor-a-servidor.');
 }catch(error){console.error('FALHA modulo de atendimentos: '+error.message);process.exitCode=1;}
}
