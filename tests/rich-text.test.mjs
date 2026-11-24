import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanHtml,plainText} from '../src/lib/rich-text.ts';
import {parseContent,parseServices} from '../src/lib/content.ts';
test('rich text keeps paragraphs, lists and links; strips executable markup',()=>{
 const clean=cleanHtml('<h2>Titulo</h2><p onclick="bad()">Texto <strong>forte</strong></p><ul><li>A</li></ul><script>bad()</script><iframe src="https://host"></iframe><a href="javascript:bad()">X</a><img src="data:image/svg+xml,x" onerror="bad()">');
 assert.match(clean,/<h2>Titulo<\/h2>/);assert.match(clean,/<strong>forte<\/strong>/);assert.match(clean,/<li>A<\/li>/);
 assert.doesNotMatch(clean,/script|iframe|onclick|onerror|javascript:|data:image/);
});
test('entity encoded attacks and protocol relative resources are blocked',()=>{
 const clean=cleanHtml('<a href="&#106;avascript:alert(1)">A</a><img src="//example.org/a.png"><img src="https://example.org/a.png"><form><input></form><svg><foreignObject><script>alert(1)</script></foreignObject></svg>');
 assert.doesNotMatch(clean,/href=|src="\/\/|form|input|svg|script|alert/);
 assert.match(clean,/src="https:\/\/example.org\/a.png"/);
});
test('titles and full body are available from plugin v0.3.1 without inventing content',()=>{
 const value={id:1,title:'Apoio &amp; integra&#231;&#227;o',slug:'apoio',locale:'pt',description:'Resumo',content:'<p>Texto completo</p>',date:'2026-10-30T10:00:00Z'};
 const item=parseContent([value],'pt')[0];
 assert.equal(item.title,'Apoio & integração');assert.equal(item.content,'<p>Texto completo</p>');
 assert.equal(parseServices([value],'pt')[0].content,'<p>Texto completo</p>');
 assert.equal(plainText('<b>AAAI</b> &amp; apoio'),'AAAI & apoio');
 assert.equal(cleanHtml(null),'');
});
