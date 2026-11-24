import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {loadEnvironment} from './wordpress-env.mjs';
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=name=>{const index=process.argv.indexOf(name);return index<0?undefined:process.argv[index+1];};
function noLinks(root,file) {
 let current=root;
 for(const part of path.relative(root,file).split(path.sep)){
  if(part==='..')throw Error('Caminho fora do destino.');
  current=path.join(current,part);
  if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw Error('Destino com ligacao simbolica: '+current);
 }
}
try {
 const raw=arg('--project');if(!raw)throw Error('Indique --project com a pasta frontend.');
 const target=fs.realpathSync(raw);if(target===fs.realpathSync(source))throw Error('Execute a partir de uma pasta separada do frontend.');
 const pkg=JSON.parse(fs.readFileSync(path.join(target,'package.json'),'utf8'));
 if(pkg.name!=='aaai-portal'||!['0.6.0','0.7.0'].includes(pkg.version))throw Error('Esta fase requer AAAI v0.6.0 ou v0.7.0.');
 const wordpress=fs.realpathSync(arg('--wordpress')||path.join(path.dirname(target),'wordpress'));
 if(!fs.existsSync(path.join(wordpress,'wp-load.php'))||!fs.existsSync(path.join(wordpress,'wp-content')))throw Error('WordPress nao encontrado. Indique --wordpress com a pasta correcta.');
 const manifest=JSON.parse(fs.readFileSync(path.join(source,'MANIFESTO_v070.json'),'utf8'));
 const plans=[];
 for(const entry of manifest){
  if(!entry.path||path.isAbsolute(entry.path)||entry.path.split(/[\\/]/).some(p=>p==='..'||p===''))throw Error('Caminho invalido no manifesto.');
  const bytes=fs.readFileSync(path.join(source,entry.path));
  if(crypto.createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error('Integridade invalida: '+entry.path);
  const dest=path.join(target,entry.path);noLinks(target,dest);plans.push({dest,bytes});
 }
 const mu=path.join(wordpress,'wp-content','mu-plugins');
 const plugin=path.join(mu,'aaai-atendimento.php');
 const secret=path.join(mu,'aaai-atendimento','secret.php');
 noLinks(wordpress,plugin);noLinks(wordpress,secret);
 const envFile=path.join(target,'.env.local');noLinks(target,envFile);
 const beforeEnv=fs.existsSync(envFile)?fs.readFileSync(envFile,'utf8'):'';
 const settings=loadEnvironment(target);
 const envKey=settings.AAAI_ATENDIMENTO_API_KEY?.trim();
 let wpKey='';
 if(fs.existsSync(secret)){
  wpKey=fs.readFileSync(secret,'utf8').match(/return\s+'([a-f0-9]{64})'\s*;/)?.[1]||'';
  if(!wpKey)throw Error('Configuracao backend existente nao reconhecida; nao foi substituida.');
 }
 if(envKey&&!/^[a-f0-9]{64}$/.test(envKey))throw Error('AAAI_ATENDIMENTO_API_KEY existente invalido.');
 if(envKey&&wpKey&&envKey!==wpKey)throw Error('As chaves existentes do frontend e do WordPress nao coincidem. Nenhum ficheiro alterado.');
 const key=envKey||wpKey||crypto.randomBytes(32).toString('hex');
 if(!envKey&&/^\s*(?:export\s+)?AAAI_ATENDIMENTO_API_KEY\s*=/m.test(beforeEnv))throw Error('AAAI_ATENDIMENTO_API_KEY esta declarado mas vazio no .env.local. Remova essa linha vazia e repita.');
 let afterEnv=beforeEnv;
 const addLine=line=>{afterEnv+=(afterEnv&&!afterEnv.endsWith('\n')?'\n':'')+line+'\n';};
 if(!envKey)addLine(`AAAI_ATENDIMENTO_API_KEY=${key}`);
 if(!settings.WORDPRESS_API_URL?.trim()){
  if(/^\s*(?:export\s+)?WORDPRESS_API_URL\s*=/m.test(beforeEnv))throw Error('WORDPRESS_API_URL esta declarado mas vazio. Preencha o URL WordPress.');
  addLine('WORDPRESS_API_URL=http://localhost/aaai-portal-v1/wordpress/wp-json');
 }
 const apacheFile=path.join(target,'.htaccess');noLinks(target,apacheFile);
 const apacheBefore=fs.existsSync(apacheFile)?fs.readFileSync(apacheFile,'utf8'):'';
 if(!apacheBefore.includes('# BEGIN AAAI_PRIVATE_ENV')){
  const block='\n# BEGIN AAAI_PRIVATE_ENV\n<FilesMatch "^\\.env">\n  Require all denied\n</FilesMatch>\n# END AAAI_PRIVATE_ENV\n';
  plans.push({dest:apacheFile,bytes:Buffer.from(apacheBefore+block)});
 }
 const pluginBytes=fs.readFileSync(path.join(source,'backend','aaai-atendimento.php'));
 if(!manifest.some(entry=>entry.path==='backend/aaai-atendimento.php'))throw Error('Plugin nao incluido no manifesto.');
 plans.push({dest:plugin,bytes:pluginBytes});
 if(!wpKey)plans.push({dest:secret,bytes:Buffer.from(`<?php if (!defined('ABSPATH')) { exit; } return '${key}';\n`)});
 if(afterEnv!==beforeEnv)plans.push({dest:envFile,bytes:Buffer.from(afterEnv)});
 console.log(`AAAI v0.7.0: pacote verificado; frontend e modulo privado WordPress preparados.`);
 if(process.argv.includes('--dry-run'))console.log('SIMULACAO OK. Nenhum ficheiro alterado.');
 else {
  const backup=path.join(arg('--backup-root')||path.join(os.homedir(),'AAAI_Backups'),`v070_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`);
  fs.mkdirSync(backup,{recursive:true,mode:0o700});
  const records=[];
  for(let index=0;index<plans.length;index++){
   const {dest}=plans[index],saved=path.join(backup,`${index}.bak`),existed=fs.existsSync(dest);
   if(existed)fs.copyFileSync(dest,saved);
   records.push({dest,saved,existed});
  }
  fs.writeFileSync(path.join(backup,'restore-map.json'),JSON.stringify(records,null,2),{mode:0o600});
  const applied=[];
  try {
   for(let index=0;index<plans.length;index++){
    const plan=plans[index];fs.mkdirSync(path.dirname(plan.dest),{recursive:true});applied.push(index);
    fs.writeFileSync(plan.dest,plan.bytes,{mode:plan.dest===secret||plan.dest===envFile?0o600:0o644});
   }
  }catch(error){
   const failed=[];
   for(const index of applied.reverse())try{const item=records[index];if(item.existed)fs.copyFileSync(item.saved,item.dest);else fs.rmSync(item.dest,{force:true});}catch{failed.push(records[index].dest);}
   if(failed.length)console.error('Restauro manual necessario:',failed.join(', '));
   throw Error(`Aplicacao falhou: ${error.message}. Backup: ${backup}`);
  }
  console.log('ACTUALIZACAO APLICADA. Backup privado: '+backup);
  console.log('Modulo WordPress carregado automaticamente em mu-plugins. Chave criada/preservada localmente, sem a mostrar.');
 }
}catch(error){console.error('FALHA: '+error.message);process.exitCode=1;}
