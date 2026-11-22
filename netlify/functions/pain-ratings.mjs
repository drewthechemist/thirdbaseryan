import {createHash} from 'node:crypto';
const ALLOWED=new Set(["2026-11-21-nebraska", "2026-11-07-oregon", "2026-10-31-usc", "2026-09-12-texas", "2025-12-31-miami", "2025-12-06-indiana", "2024-11-30-michigan", "2024-10-12-oregon", "2023-12-29-missouri", "2023-11-25-michigan", "2022-12-31-georgia", "2022-11-26-michigan", "2021-11-27-michigan", "2021-09-11-oregon", "2021-01-11-alabama", "2019-12-28-clemson"]);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const hex=/^[0-9a-f]{32}$/i;
const json=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
async function db(path,options={}){
 const base=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!base||!key)throw Error('Missing Supabase configuration');
 const res=await fetch(base.replace(/\/$/,'')+'/rest/v1/'+path,{...options,headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json',...options.headers}});
 const text=await res.text();if(!res.ok)throw Error('Supabase '+res.status+': '+text.slice(0,160));return text?JSON.parse(text):null;
}
export default async function handler(request){
 try{
  if(!['GET','POST'].includes(request.method))return json(405,{error:'Method not allowed'});
  if(request.method==='GET'){
   const url=new URL(request.url),rawId=url.searchParams.get('voterId');
   const [totals,own]=await Promise.all([
    db('rpc/loss_pain_leaderboard',{method:'POST',body:'{}'}),
    rawId&&(uuid.test(rawId)||hex.test(rawId))?db('loss_pain_ratings?select=loss_id,rating&voter_hash=eq.'+createHash('sha256').update(rawId).digest('hex')):Promise.resolve([])
   ]);
   return json(200,{leaderboard:totals||[],myRatings:own||[]});
  }
  if(Number(request.headers.get('content-length')||0)>2048)return json(413,{error:'Request too large'});
  const raw=await request.text();if(raw.length>2048)return json(413,{error:'Request too large'});
  let data;try{data=JSON.parse(raw)}catch{return json(400,{error:'Invalid JSON'})}
  const {voterId,lossId,rating}=data||{};
  if(typeof voterId!=='string'||!(uuid.test(voterId)||hex.test(voterId)))return json(400,{error:'Invalid browser identifier'});
  if(typeof lossId!=='string'||!ALLOWED.has(lossId))return json(400,{error:'Unknown loss'});
  if(!Number.isInteger(rating)||rating<1||rating>5)return json(400,{error:'Rating must be 1–5'});
  const voter_hash=createHash('sha256').update(voterId).digest('hex');
  await db('loss_pain_ratings?on_conflict=loss_id,voter_hash',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({loss_id:lossId,voter_hash,rating,updated_at:new Date().toISOString()})});
  const [totals,own]=await Promise.all([
   db('rpc/loss_pain_leaderboard',{method:'POST',body:'{}'}),
   db('loss_pain_ratings?select=loss_id,rating&voter_hash=eq.'+voter_hash)
  ]);
  return json(200,{leaderboard:totals||[],myRatings:own||[]});
 }catch(e){console.error('Pain rating service:',e.message);return json(503,{error:'Community ratings temporarily unavailable'})}
}
export const config={path:'/.netlify/functions/pain-ratings'};
