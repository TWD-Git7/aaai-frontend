import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
export function loadEnvironment(root=process.cwd()) {
  const env={...process.env};
  for(const name of ['.env.development.local','.env.local','.env.development','.env']) {
    const file=path.join(root,name);
    if(!fs.existsSync(file))continue;
    const parsed=parseEnv(fs.readFileSync(file,'utf8'));
    for(const [key,value] of Object.entries(parsed))if(env[key]===undefined)env[key]=value;
  }
  return env;
}
export function configure(root,url) {
  const base=new URL(url);
  if(!['http:','https:'].includes(base.protocol)||base.username||base.password)throw Error('URL WordPress invalido.');
  if(loadEnvironment(root).WORDPRESS_API_URL?.trim())return {status:'preserved'};
  const file=path.join(root,'.env.local');
  const previous=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
  // Never silently replace an explicit (including empty) declaration.
  if(/^\s*(?:export\s+)?WORDPRESS_API_URL\s*=/m.test(previous))return {status:'manual',message:'WORDPRESS_API_URL ja declarado no .env.local; configure o valor manualmente.'};
  if(previous)fs.copyFileSync(file,`${file}.backup-${Date.now()}`);
  const line=`WORDPRESS_API_URL=${JSON.stringify(base.href)}`;
  fs.writeFileSync(file,`${previous}${previous&&!previous.endsWith('\n')?'\n':''}${line}\n`,'utf8');
  return {status:'configured'};
}
