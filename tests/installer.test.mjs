import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const installer=fs.readFileSync(new URL('../scripts/install-v070.mjs',import.meta.url));
const envHelper=fs.readFileSync(new URL('../scripts/wordpress-env.mjs',import.meta.url));
test('v070 preflight, two-target install, backups, shared secret and reinstall preserve configuration',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'aaai-install-'));
 try{
  const source=path.join(root,'source'),target=path.join(root,'frontend'),wordpress=path.join(root,'wordpress'),backups=path.join(root,'backups');
  fs.mkdirSync(path.join(source,'scripts'),{recursive:true});fs.mkdirSync(path.join(source,'backend'));fs.mkdirSync(target);fs.mkdirSync(path.join(wordpress,'wp-content'),{recursive:true});
  fs.writeFileSync(path.join(wordpress,'wp-load.php'),'<?php');
  fs.writeFileSync(path.join(source,'scripts/install-v070.mjs'),installer);fs.writeFileSync(path.join(source,'scripts/wordpress-env.mjs'),envHelper);
  const old=JSON.stringify({name:'aaai-portal',version:'0.6.0'}),updated=JSON.stringify({name:'aaai-portal',version:'0.7.0'});
  fs.writeFileSync(path.join(target,'.htaccess'),'# Existing rule\n');fs.writeFileSync(path.join(target,'package.json'),old);fs.writeFileSync(path.join(target,'.env.local'),'AAAI_CONTACT_EMAIL=official@example.org\n');
  const files={'package.json':updated,'backend/aaai-atendimento.php':'<?php /* fixture */'};
  for(const [file,bytes] of Object.entries(files))fs.writeFileSync(path.join(source,file),bytes);
  fs.writeFileSync(path.join(source,'MANIFESTO_v070.json'),JSON.stringify(Object.entries(files).map(([file,bytes])=>({path:file,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}))));
  const run=(...args)=>spawnSync(process.execPath,[path.join(source,'scripts/install-v070.mjs'),'--project',target,'--backup-root',backups,...args],{encoding:'utf8'});
  assert.equal(run('--dry-run').status,0);assert.equal(fs.readFileSync(path.join(target,'package.json'),'utf8'),old);assert(!fs.existsSync(backups));
  fs.writeFileSync(path.join(source,'package.json'),'corrupted');assert.notEqual(run().status,0);assert.equal(fs.readFileSync(path.join(target,'package.json'),'utf8'),old);
  fs.writeFileSync(path.join(source,'package.json'),updated);const applied=run();assert.equal(applied.status,0,applied.stderr);
  assert.equal(fs.readFileSync(path.join(target,'package.json'),'utf8'),updated);assert(fs.readFileSync(path.join(target,'.htaccess'),'utf8').includes('# Existing rule'));assert(fs.readFileSync(path.join(target,'.htaccess'),'utf8').includes('Require all denied'));
  const env=fs.readFileSync(path.join(target,'.env.local'),'utf8');assert(env.includes('AAAI_CONTACT_EMAIL=official@example.org'));
  const key=env.match(/AAAI_ATENDIMENTO_API_KEY=([a-f0-9]{64})/)[1];const secret=path.join(wordpress,'wp-content/mu-plugins/aaai-atendimento/secret.php');assert(fs.readFileSync(secret,'utf8').includes(key));
  assert.equal(run().status,0);assert.equal(fs.readFileSync(path.join(target,'.env.local'),'utf8'),env);
  fs.writeFileSync(secret,"<?php return '"+'f'.repeat(64)+"';");const mismatch=run();assert.notEqual(mismatch.status,0);assert.equal(fs.readFileSync(path.join(target,'.env.local'),'utf8'),env);
  assert.equal(fs.readdirSync(backups).length,2);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
