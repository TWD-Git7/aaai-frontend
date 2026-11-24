import test from 'node:test';
import assert from 'node:assert/strict';
import {apiUrl, parseServices, parseContent, safeImage} from '../src/lib/content.ts';
const service = {id:1,title:'Apoio',slug:'apoio',locale:'pt',order:2};
test('empty publication differs from failed or malformed response', () => {
  assert.deepEqual(parseServices([], 'pt'), []);
  for (const value of [null,{},[null],[{id:1}],[{...service,title:{rendered:'unsafe'}}]]) assert.equal(parseServices(value,'pt'),null);
});
test('services are normalised, ordered and locale checked', () => {
  assert.deepEqual(parseServices([service,{...service,id:2,order:0}],'pt').map(s=>s.id),[2,1]);
  assert.equal(parseServices([{...service,locale:'en'}],'pt'),null);
  assert.equal(parseServices([service],'pt')[0].description,'');
});
test('unsafe image URLs never reach the image component', () => {
  for (const url of ['javascript:alert(1)','data:image/png;base64,x','//host/image','https://user:pass@host/image',null]) assert.equal(safeImage(url),null);
  assert.equal(parseContent([{...service,image:'javascript:x'}],'pt')[0].image,null);
  assert.equal(safeImage('https://example.org/image.png'),'https://example.org/image.png');
});
test('WordPress URL supports both permalink modes and preserves parameters', () => {
  assert.equal(apiUrl('http://localhost/site/wp-json/','news','pt').href,'http://localhost/site/wp-json/aaai/v1/news?lang=pt');
  const url=apiUrl('http://localhost/site/?rest_route=/&other=1','services','fr');
  assert.equal(url.searchParams.get('rest_route'),'/aaai/v1/services');
  assert.equal(url.searchParams.get('lang'),'fr');
  assert.equal(url.searchParams.get('other'),'1');
  assert.throws(()=>apiUrl('file:///tmp','news','pt'));
  assert.throws(()=>apiUrl('http://localhost','news','xx'));
});
