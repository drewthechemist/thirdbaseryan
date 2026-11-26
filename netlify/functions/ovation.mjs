import {createHash} from 'node:crypto';
const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
export default async function handler(req, netlifyContext){try{
 if(!['GET','POST'].includes(req.method))return reply(405,{error:'Method not allowed'});
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!base||!key)throw Error('Missing configuration');
 const context=process.env.OVATION_ENV;
 console.log('Ovation diagnostic v3', JSON.stringify({environment:context===undefined?'missing':context==='test'?'test':context==='production'?'production':'unexpected',length:context?.length??0}));
 if(!['production','test'].includes(context))throw Error('Unknown deployment context');
 if(req.method==='GET' && new URL(req.url).searchParams.get('map')==='1'){
 const rpc=context==='production'?'ovation_geography':'ovation_geography_test';
 const r=await fetch(base.replace(/\/$/,'')+'/rest/v1/rpc/'+rpc,{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json'},body:'{}'});
 if(!r.ok)throw Error('Geography '+r.status);
 return new Response(JSON.stringify(await r.json()),{headers:{'content-type':'application/json','cache-control':'public, max-age=60','Netlify-CDN-Cache-Control':'public, s-maxage=300'}});
 }
 let id;if(req.method==='POST'){const raw=await req.text();if(raw.length>512)return reply(413,{error:'Too large'});try{id=JSON.parse(raw).id}catch{return reply(400,{error:'Invalid request'})}}else id=new URL(req.url).searchParams.get('id');
 if(!/^[a-f0-9]{32}$/i.test(id||''))return reply(400,{error:'Invalid identifier'});
 const rpc=context==='production'?'ovation_geo':'ovation_geo_test';
 const r=await fetch(base.replace(/\/$/,'')+'/rest/v1/rpc/'+rpc,{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json'},body:JSON.stringify({p_hash:createHash('sha256').update(id).digest('hex'),p_join:req.method==='POST',p_region:netlifyContext?.geo?.country?.code==='US'?(netlifyContext.geo.subdivision?.code||null):netlifyContext?.geo?.country?.code?'INTL':null})});if(!r.ok)throw Error('Database '+r.status);return reply(200,await r.json());
}catch(e){console.error(e.message);return reply(503,{error:'Tribute temporarily unavailable. Please try again.'})}}
