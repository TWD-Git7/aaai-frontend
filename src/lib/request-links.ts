export function requestLinks({email,whatsapp,subject,body}:{email:string;whatsapp:string;subject:string;body:string}) {
 return {
  email:email?`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`:'',
  whatsapp:whatsapp?`https://wa.me/${whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`:'',
 };
}
export function localDate(now=new Date()):string {
 // Read the visitor's local date without UTC conversion shifting the selected day.
 return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
