import { createHash } from 'node:crypto';
const json=(status,obj)=>new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hex=/^[0-9a-f]{32}$/i;
const validId=x=>typeof x==='string'&&(uuid.test(x)||hex.test(x));
const hash=x=>createHash('sha256').update(x).digest('hex');
const db=async(path,options={})=>{const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!base||!key)throw Error('Database environment variables are missing');const response=await fetch(base.replace(/\/$/,'')+'/rest/v1/'+path,{...options,headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json',...options.headers}});const body=await response.text();if(!response.ok)throw Error('Database request failed ('+response.status+')');return body?JSON.parse(body):null};
export default async function handler(request){
  try{
    if(!['GET','POST'].includes(request.method))return json(405,{error:'Method not allowed'});
    let id,choice;
    if(request.method==='GET'){id=new URL(request.url).searchParams.get('voterId')}else{
      if(Number(request.headers.get('content-length')||0)>2048)return json(413,{error:'Request too large'});
      const raw=await request.text();if(raw.length>2048)return json(413,{error:'Request too large'});
      const data=JSON.parse(raw);id=data.voterId;choice=data.choice;
      if(!['fire','keep'].includes(choice))return json(400,{error:'Invalid choice'});
    }
    if(!validId(id))return json(400,{error:'Invalid browser identifier'});
    const voterHash=hash(id);
    if(request.method==='POST')await db('fan_votes?on_conflict=voter_hash',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({voter_hash:voterHash,choice})});
    const [totals,own]=await Promise.all([
      db('rpc/fan_vote_totals',{method:'POST',body:'{}'}),
      db('fan_votes?select=choice&voter_hash=eq.'+voterHash+'&limit=1')
    ]);
    const t=totals?.[0]||totals||{};const fire=Number(t.fire_count||0),keep=Number(t.keep_count||0),total=fire+keep;
    return json(200,{fire,keep,total,firePercent:total?Math.round(fire/total*100):0,keepPercent:total?Math.round(keep/total*100):0,choice:own?.[0]?.choice||null});
  }catch(error){console.error('Vote service:',error.message);return json(503,{error:'Voting service temporarily unavailable'})}
}
export const config={path:'/.netlify/functions/vote'};
