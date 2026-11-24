import sanitizeHtml from 'sanitize-html';
import {decodeHTML} from 'entities';

/** Sanitise on the server before rich text reaches dangerouslySetInnerHTML. */
export function cleanHtml(value: unknown): string {
  if (typeof value !== 'string') return '';
  return sanitizeHtml(value, {
    allowedTags:['p','br','h2','h3','h4','strong','b','em','i','u','s','ul','ol','li','blockquote','a','figure','figcaption','img','table','thead','tbody','tr','th','td','hr'],
    allowedAttributes:{a:['href','title'],img:['src','alt','width','height'],th:['scope'],ol:['start']},
    allowedSchemes:['http','https','mailto','tel'],
    allowedSchemesByTag:{img:['http','https']},
    allowProtocolRelative:false,
    transformTags:{img:(_tag,attrs)=>({tagName:'img',attribs:{...attrs,loading:'lazy',decoding:'async'}})},
  });
}
export function plainText(value:unknown): string {
  return typeof value==='string'?decodeHTML(sanitizeHtml(value,{allowedTags:[],allowedAttributes:{}})).trim():'';
}
