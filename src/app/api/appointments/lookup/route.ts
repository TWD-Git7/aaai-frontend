import {appointmentProxy} from '@/lib/appointments-server';
export const runtime='nodejs';
export async function POST(request:Request) {return appointmentProxy(request,'lookup');}
