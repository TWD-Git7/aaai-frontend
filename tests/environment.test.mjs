import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {configure,loadEnvironment} from '../scripts/wordpress-env.mjs';
test('configuration creates a valid URL while preserving existing environment and other keys',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'aaai-config-'));
 const old=process.env.WORDPRESS_API_URL;delete process.env.WORDPRESS_API_URL;
 try {
  fs.writeFileSync(path.join(dir,'.env.local'),'AAAI_CONTACT_EMAIL=official@example.org\n');
  assert.equal(configure(dir,'http://localhost/site/wp-json').status,'configured');
  assert.equal(loadEnvironment(dir).AAAI_CONTACT_EMAIL,'official@example.org');
  assert.equal(loadEnvironment(dir).WORDPRESS_API_URL,'http://localhost/site/wp-json');
  const before=fs.readFileSync(path.join(dir,'.env.local'),'utf8');
  assert.equal(configure(dir,'https://other.org/wp-json').status,'preserved');
  assert.equal(fs.readFileSync(path.join(dir,'.env.local'),'utf8'),before);
  assert.throws(()=>configure(dir,'file:///tmp'));
  fs.writeFileSync(path.join(dir,'.env.local'),'WORDPRESS_API_URL=\n');
  assert.equal(configure(dir,'http://localhost/wp-json').status,'manual');
 } finally {if(old!==undefined)process.env.WORDPRESS_API_URL=old;else delete process.env.WORDPRESS_API_URL;fs.rmSync(dir,{recursive:true,force:true});}
});
