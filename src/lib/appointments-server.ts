import 'server-only';
import {NextResponse} from 'next/server';
import {atendimentoUrl,validBooking,validLookup,validReceipt,validTracking,validRequestOrigin} from './appointments';
const failure=(error:string,status:number)=>NextResponse.json({error},{status,headers:{'Cache-Control':'no-store, private','Pragma':'no-cache'}});
export async function appointmentProxy(request:Request,kind:'appointments'|'lookup') {
 const origin=request.headers.get('origin');
 if(!validRequestOrigin(origin,request.url,request.headers.get('host')))return failure('forbidden',403);
 if(request.headers.get('content-type')?.toLowerCase().split(';')[0].trim()!=='application/json')return failure('invalid',415);
 const base=process.env.WORDPRESS_API_URL?.trim(),key=process.env.AAAI_ATENDIMENTO_API_KEY?.trim();
 if(!base||!key)return failure('unavailable',503);
 let body:unknown;
 try {
  const reader=request.body?.getReader();if(!reader)return failure('invalid',400);
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>10000){await reader.cancel();return failure('invalid',413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  body=JSON.parse(new TextDecoder().decode(bytes));
 }catch{return failure('invalid',400);}
 if(!(kind==='appointments'?validBooking(body):validLookup(body)))return failure('invalid',400);
 try {
  const response=await fetch(atendimentoUrl(base,kind),{method:'POST',headers:{'Content-Type':'application/json','X-AAAI-Key':key},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!response.ok){const status=[400,404,409,429].includes(response.status)?response.status:503;return failure(({400:'invalid',404:'not_found',409:'conflict',429:'rate_limited'} as Record<number,string>)[status]||'unavailable',status);}
  const data:unknown=await response.json();
  if(kind==='appointments'){
   if(!validReceipt(data))return failure('unavailable',503);
   return NextResponse.json({reference:data.reference,accessCode:data.accessCode,state:data.state},{status:response.status,headers:{'Cache-Control':'no-store, private','Pragma':'no-cache'}});
  }
  if(!validTracking(data))return failure('unavailable',503);
  // Explicit allowlist: no upstream personal/internal fields can pass through.
  return NextResponse.json({reference:data.reference,state:data.state,scheduledAt:data.scheduledAt,publicMessage:data.publicMessage,updatedAt:data.updatedAt},{headers:{'Cache-Control':'no-store, private','Pragma':'no-cache'}});
 }catch{return failure('unavailable',503);}
}
