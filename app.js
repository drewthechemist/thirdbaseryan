'use strict';
const $=id=>document.getElementById(id);
$('year').textContent=new Date().getFullYear();
$('menu').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open))});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));
const voteKey='thirdbase-voter-id-v2';
let poll={fire:0,keep:0,total:0,firePercent:0,keepPercent:0,choice:null}, pollReady=false, showVerdict=false;
function voterId(){let id=localStorage.getItem(voteKey);if(!id){id=crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem(voteKey,id)}return id}
function updatePoll(data){poll=data;pollReady=true;const n=Number(data.firePercent)||0;$('heatValue').textContent=data.total?`${n}%`:'—';$('heatLabel').textContent=data.total?'of votes say FIRE HIM':'Awaiting the first vote';$('heatFill').style.width=`${n}%`;$('heatMeter').setAttribute('aria-valuenow',String(n));$('firePct').textContent=`${n}% FIRE`;$('keepPct').textContent=`${data.keepPercent||0}% KEEP`;$('voteCount').textContent=`${Number(data.total||0).toLocaleString()} community ballots`;$('voteResult').textContent=data.choice?`Your current ballot: ${data.choice==='fire'?'FIRE HIM':'KEEP HIM'}. You can change it.`:'Cast your ballot below.';document.querySelectorAll('[data-vote]').forEach(btn=>{btn.disabled=false;btn.setAttribute('aria-pressed',String(btn.dataset.vote===data.choice))});const shareBox=$('postVoteShare');shareBox.hidden=!data.choice;
if(data.choice){$('postVoteMessage').textContent=`You voted ${data.choice==='fire'?'FIRE':'KEEP'}. ${data.choice==='fire'?data.firePercent:data.keepPercent}% of ${Number(data.total||0).toLocaleString()} ballots agree.`;}
if(showVerdict)shareCard()}
async function pollRequest(method='GET',choice){const url='/.netlify/functions/vote';const options={method,headers:{'content-type':'application/json'}};if(method==='POST')options.body=JSON.stringify({voterId:voterId(),choice});else url;const endpoint=method==='GET'?`${url}?voterId=${encodeURIComponent(voterId())}`:url;const response=await fetch(endpoint,options);let data;try{data=await response.json()}catch{throw Error('Poll service unavailable')}if(!response.ok)throw Error(data.error||'Poll request failed');return data}
async function loadPoll(){try{updatePoll(await pollRequest())}catch(err){$('voteResult').textContent=`Live voting unavailable: ${err.message}`;$('voteCount').textContent='Database setup may still be needed';document.querySelectorAll('[data-vote]').forEach(btn=>btn.disabled=true)}}
document.querySelectorAll('[data-vote]').forEach(btn=>btn.addEventListener('click',async()=>{document.querySelectorAll('[data-vote]').forEach(b=>b.disabled=true);$('voteResult').textContent='Saving ballot…';try{updatePoll(await pollRequest('POST',btn.dataset.vote));showVerdict=true;$('verdictCard').textContent='SHOW ORIGINAL CARD';shareCard()}catch(err){$('voteResult').textContent=`Could not save vote: ${err.message}`;document.querySelectorAll('[data-vote]').forEach(b=>b.disabled=false)}}));$('refreshVote').addEventListener('click',loadPoll);loadPoll();
const excuses=["We were one adjustment away from making the adjustment.", "The scoreboard didn’t reflect how good Tuesday’s practice was.", "We won the first three quarters of the film review.", "We just need to execute the execution better.", "Our game plan was outstanding until the other team started playing.", "We need to find a way to win the games we didn’t win.", "The analytics department says our vibes were elite.", "We had a great week of practice. Unfortunately, the game was on Saturday.", "We made halftime adjustments. They were mostly to the thermostat.", "The other team had the unfair advantage of knowing what we were going to run.", "We're evaluating why the evaluation process didn't evaluate that.", "The first 58 minutes were really encouraging. The last two were educational.", "The scoreboard is just one metric, and frankly it's a pretty negative one.", "We didn't lose the fourth quarter. We simply ran out of quarters to win.", "We thought they'd stop throwing to the guy who was wide open.", "The plan was to establish the run. We just forgot to establish the blocking.", "We liked the matchup on paper. The grass had other ideas.", "Our best plays looked tremendous on the whiteboard.", "The defense was in position. Unfortunately, so was their receiver.", "We weren't outcoached. We were unexpectedly coached against.", "There's no reason to panic. We have a very strong Tuesday planned.", "We didn't abandon the run. We gave it a much-needed rest.", "We were saving our best adjustments for overtime.", "We challenged the guys to respond. They responded with questions.", "That third-and-17 was actually a great opportunity to punt.", "We didn't see that blitz coming. Or the next six.", "We felt really good about the two-point play we never got to run.", "We made some big stops. Just not on the drives that mattered.", "We need to get back to the fundamentals of talking about fundamentals.", "We won the time-of-possession battle in the press conference.", "The game was closer than the final score if you remove their touchdowns.", "We had tremendous energy in the locker room after the game.", "We were trying to avoid being predictable, so we ran the same play again.", "The fourth-down call was aggressive in spirit, conservative in execution.", "We're not making excuses. We're providing a detailed list of circumstances.", "We had them exactly where we wanted them, until they scored again.", "The film will show a lot of things that the scoreboard won't.", "We were committed to complementary football. The offense complemented their defense.", "We just didn't get the bounce. Or the tackle. Or the coverage.", "We'll have to take a hard look at why our hard looks aren't working.", "We were ready for their adjustments. We just weren't ready for their adjustments to our adjustments.", "We need to be more physical, starting with the postgame handshake.", "We kept the playbook simple so nobody would be confused, including their defense.", "The guys competed for four quarters. The scoreboard competed harder.", "We had a good plan for the first half and a really good plan for next week.", "We can't control what the other team does with the football.", "We knew they'd make plays. We didn't anticipate they'd make all of them.", "We're going to fix the little things. The big things are still under review.", "Our margin for error was small. Our errors were not.", "We had the right personnel in the right places, just at the wrong times.", "We didn't want to show too much of the offense before the next game.", "That timeout was important. We needed a moment to consider another timeout.", "We've got to coach better, play better, and explain it better.", "We came in with a championship mindset and left with valuable feedback.", "We'll look at the tape. The tape has been very patient with us.", "We knew the rivalry would be emotional. We didn't know the other team would be so motivated.", "We were close to turning the corner. Then we called a screen pass.", "We prepared for every scenario except the one that happened.", "The game plan was sound. The sound was mostly our fans booing.", "Every setback is a lesson, and we're building quite the curriculum.", "We felt like we controlled the game, aside from the points and the clock.", "We've got to do a better job of not letting their best player be their best player.", "We're focused on the process. The results have asked not to be involved.", "We practiced the two-minute drill all week. We just didn't practice having two minutes.", "We need to get the ball to our playmakers. That's on the list for next Saturday.", "We had some really positive moments between their scoring drives.", "The locker room believes in the system. The system is currently unavailable for comment.", "We're going to use this loss as fuel. We have enough fuel to reach Mars.", "We didn't overlook anybody. We just looked at them from very far away.", "We weren't expecting them to make that many halftime adjustments.", "We have to improve our situational awareness, particularly when we're in a situation.", "We trust our identity. We're still working out what it is."];
let excusePool=[];
function nextExcuse(){if(!excusePool.length){excusePool=excuses.map((_,i)=>i);for(let i=excusePool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[excusePool[i],excusePool[j]]=[excusePool[j],excusePool[i]];}}const i=excusePool.pop();$('excuse').textContent='“'+excuses[i]+'”';}
$('nextExcuse').addEventListener('click',nextExcuse);
const losses=[{"date": "2026-11-21", "opponent": "Nebraska", "score": "28–31", "category": "Upset", "headline": "Cornhuskered", "take": "Nebraska snapped a 31-game losing streak against AP-ranked teams — and Ohio State became the team that finally let them celebrate.", "url": "https://bigten.org/stats.aspx?path=football&year=2026"}, {"date": "2026-11-07", "opponent": "Oregon", "score": "28–41", "category": "Collapse", "headline": "The Home-Field Hospitality Package", "take": "A 13-point home defeat in a crucial November conference game.", "url": "https://bigten.org/stats.aspx?path=football&year=2026"}, {"date": "2026-10-31", "opponent": "USC", "score": "18–30", "category": "Upset", "headline": "Halloween in Hollywood", "take": "No. 2 Ohio State lost by 12 on the road, dealing a major blow to its season.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2026-schedule.html"}, {"date": "2026-09-12", "opponent": "Texas", "score": "23–24", "category": "Big game", "headline": "One Point, No Consolation", "take": "Ohio State blew a 20-point fourth-quarter lead to No. 4 Texas — the largest fourth-quarter comeback ever against an AP No. 1 team.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2026-schedule.html"}, {"date": "2025-12-31", "opponent": "Miami", "score": "14–24", "category": "Playoff", "headline": "Cotton Bowl Exit", "take": "The season ended with a double-digit College Football Playoff defeat.", "url": "https://ohiostatebuckeyes.com/staff-directory/ryan-day/108"}, {"date": "2025-12-06", "opponent": "Indiana", "score": "10–13", "category": "Championship", "headline": "Ten Points in a Title Game", "take": "Ohio State scored only 10 points in a three-point Big Ten championship loss.", "url": "https://ohiostatebuckeyes.com/staff-directory/ryan-day/108"}, {"date": "2024-11-30", "opponent": "Michigan", "score": "10–13", "category": "Rivalry", "headline": "The Three-Point Nightmare", "take": "An unranked Michigan team won in Columbus, extending the rivalry losing streak to four.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2024-schedule.html"}, {"date": "2024-10-12", "opponent": "Oregon", "score": "31–32", "category": "Big game", "headline": "The Clock Ran Out", "take": "A one-point loss in Eugene ended with a controversial late-game clock sequence.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2024-schedule.html"}, {"date": "2023-12-29", "opponent": "Missouri", "score": "3–14", "category": "Bowl", "headline": "Three Points. Three.", "take": "Ohio State managed just a field goal in the Cotton Bowl.", "url": "https://ohiostatebuckeyes.com/staff-directory/ryan-day/108"}, {"date": "2023-11-25", "opponent": "Michigan", "score": "24–30", "category": "Rivalry", "headline": "Third Time Was Not the Charm", "take": "A third straight defeat to Michigan ended Ohio State’s unbeaten regular-season bid.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2023-schedule.html"}, {"date": "2022-12-31", "opponent": "Georgia", "score": "41–42", "category": "Playoff", "headline": "Midnight Miss", "take": "Ohio State led by 14 in the fourth quarter but lost the Peach Bowl semifinal by one point.", "url": "https://ohiostatebuckeyes.com/staff-directory/ryan-day/108"}, {"date": "2022-11-26", "opponent": "Michigan", "score": "23–45", "category": "Rivalry", "headline": "The Second-Half Exit", "take": "A 22-point home rivalry defeat after Ohio State led at halftime.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2022-schedule.html"}, {"date": "2021-11-27", "opponent": "Michigan", "score": "27–42", "category": "Rivalry", "headline": "The Streak Begins", "take": "Michigan broke Ohio State’s long winning streak in the rivalry, winning by 15 in Ann Arbor.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2021-schedule.html"}, {"date": "2021-09-11", "opponent": "Oregon", "score": "28–35", "category": "Upset", "headline": "The Ducks Came to Columbus", "take": "Oregon handed Ohio State an early-season home defeat.", "url": "https://www.sports-reference.com/cfb/schools/ohio-state/2021-schedule.html"}, {"date": "2021-01-11", "opponent": "Alabama", "score": "24–52", "category": "Championship", "headline": "National Title, National Blowout", "take": "A 28-point defeat in the national championship game.", "url": "https://ohiostatebuckeyes.com/staff-directory/ryan-day/108"}, {"date": "2019-12-28", "opponent": "Clemson", "score": "23–29", "category": "Playoff", "headline": "Sixteen Wasn’t Enough", "take": "Ohio State built a 16–0 lead before losing the CFP semifinal.", "url": "https://ohiostatebuckeyes.com/documents/download/2023/9/19/2023_FB_Media_Guide_252-297_All-Time_Results.pdf"}];
const list=$('lossList');
let personalRatings={};
let communityPain={};
const MIN_RATINGS=3;
async function painRequest(method='GET',lossId=null,rating=null){
 const endpoint='/.netlify/functions/pain-ratings';
 const options=method==='POST'?{method,headers:{'content-type':'application/json'},body:JSON.stringify({voterId:voterId(),lossId,rating})}:{method};
 const url=method==='GET'?endpoint+'?voterId='+encodeURIComponent(voterId()):endpoint;
 const response=await fetch(url,options);
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(data.error||'Could not save community rating');
 return data;
}
function applyPainData(data){
 communityPain=Object.fromEntries((data.leaderboard||[]).map(x=>[x.loss_id,{average:Number(x.average_rating),count:Number(x.vote_count)}]));
 personalRatings=Object.fromEntries((data.myRatings||[]).map(x=>[x.loss_id,Number(x.rating)]));
 renderPainLeaderboard();
 renderLosses();
}
function renderPainLeaderboard(){
 const box=$('painLeaderboard');box.replaceChildren();
 const eligible=losses.map(g=>({g,stat:communityPain[lossId(g)]})).filter(x=>x.stat&&x.stat.count>=MIN_RATINGS).sort((a,b)=>b.stat.average-a.stat.average||b.stat.count-a.stat.count||a.g.date.localeCompare(b.g.date));
 if(!eligible.length){const p=document.createElement('p');p.className='muted';p.textContent='No losses have reached 3 ratings yet. Rate a loss below to help build the leaderboard.';box.append(p);return;}
 eligible.forEach(({g,stat},i)=>{
  const a=document.createElement('a');a.className='pain-rank-row';a.href='#loss-'+lossId(g);
  const rank=document.createElement('strong');rank.className='pain-rank-number';rank.textContent='#'+(i+1);
  const name=document.createElement('span');name.className='pain-rank-name';name.textContent=g.opponent+' · '+g.date.slice(0,4);
  const score=document.createElement('strong');score.className='pain-rank-score';score.textContent=stat.average.toFixed(2)+' / 5';
  const count=document.createElement('small');count.textContent=stat.count.toLocaleString()+' ratings';
  a.append(rank,name,score,count);box.append(a);
 });
}
async function loadPain(){try{applyPainData(await painRequest())}catch(e){const p=$('painLeaderboard');p.textContent='Live pain ratings unavailable. '+e.message;renderLosses()}}
$('refreshPain').addEventListener('click',loadPain);
const lossId=g=>g.date+'-'+g.opponent.toLowerCase().replace(/[^a-z0-9]/g,'');
function lossShareImage(g){const c=document.createElement('canvas');c.width=1200;c.height=630;const x=c.getContext('2d');x.fillStyle='#101014';x.fillRect(0,0,1200,630);x.fillStyle='#d72843';x.fillRect(0,0,18,630);x.fillStyle='#ff5268';x.font='bold 40px Arial';x.fillText('THIRDBASERYAN.COM',65,105);x.fillStyle='#fff';x.font='bold 52px Arial';x.fillText('THE LOSS HALL OF FAME',65,200);x.font='bold 95px Arial';x.fillText('VS. '+g.opponent.toUpperCase(),65,325);x.fillStyle='#ff5268';x.font='bold 78px Arial';x.fillText('L '+g.score,65,435);x.fillStyle='#c7c7d0';x.font='28px Arial';x.fillText(g.date+'  •  '+g.category+'  •  PARODY HEADLINE',65,510);x.font='23px Arial';x.fillText('Independent fan commentary • Verify score on site • Not affiliated with OSU',65,580);return c}
async function shareLoss(g){const c=lossShareImage(g),url=location.origin+location.pathname+'#loss-'+lossId(g);const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));const file=blob?new File([blob],'thirdbaseryan-'+lossId(g)+'.png',{type:'image/png'}):null;try{if(file&&navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:'ThirdBaseRyan Loss Hall',text:'Remember this one? '+url});return}if(navigator.share){await navigator.share({title:'ThirdBaseRyan Loss Hall',text:'Remember this one?',url});return}}catch(e){if(e.name==='AbortError')return}const a=document.createElement('a');a.download='thirdbaseryan-'+lossId(g)+'.png';a.href=c.toDataURL('image/png');a.click()}

const filterBar=document.createElement('div');filterBar.className='lossfilters';filterBar.setAttribute('aria-label','Filter losses');
const filters=['All','Rivalry','Playoff','Championship','Upset','Collapse','Big game','Bowl'];let selected='All';
function renderLosses(){
  list.replaceChildren();
  const shown=losses.filter(g=>selected==='All'||g.category===selected);
  for(const g of shown){
    const id=lossId(g), el=document.createElement('details');el.className='loss loss-compact';el.id='loss-'+id;
    const summary=document.createElement('summary');summary.className='loss-summary';
    const main=document.createElement('span');main.className='loss-summary-main';
    const opponent=document.createElement('strong');opponent.textContent=g.opponent;
    const date=document.createElement('small');date.textContent=new Date(g.date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    main.append(opponent,date);
    const score=document.createElement('strong');score.className='loss-compact-score';score.textContent='L '+g.score;
    const arrow=document.createElement('span');arrow.className='loss-chevron';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');
    summary.append(main,score,arrow);
    const content=document.createElement('div');content.className='loss-detail';
    const heading=document.createElement('h3');heading.textContent=g.headline;
    const meta=document.createElement('p');meta.className='lossmeta';meta.textContent=g.category+' · Satirical commentary';
    const desc=document.createElement('p');desc.className='loss-embarrassment';desc.textContent='THE EMBARRASSING PART: '+g.take;
    const source=document.createElement('a');source.href=g.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Verify score / source ↗';
    const tools=document.createElement('div');tools.className='loss-tools';
    const rating=document.createElement('div');rating.className='loss-rating';
    const label=document.createElement('span');label.textContent='RATE THE PAIN:';rating.append(label);
    const stat=document.createElement('div');stat.className='community-pain';
    const updateStat=()=>{
      const s=communityPain[id];
      stat.textContent=s&&s.count?`Community: ${s.average.toFixed(2)}/5 (${s.count.toLocaleString()} ${s.count===1?'rating':'ratings'})`:'Community: no ratings yet';
    };
    updateStat();
    for(let n=1;n<=5;n++){
      const b=document.createElement('button');b.type='button';b.className='pain-btn';b.textContent='★';
      b.setAttribute('aria-label',`Rate ${g.opponent} loss ${n} out of 5`);
      b.setAttribute('aria-pressed',String(personalRatings[id]===n));
      if(n<=Number(personalRatings[id]||0))b.classList.add('selected');
      b.addEventListener('click',async()=>{
        rating.querySelectorAll('.pain-btn').forEach(btn=>btn.disabled=true);
        stat.textContent='Saving rating…';
        try{applyPainData(await painRequest('POST',id,n))}
        catch(e){stat.textContent='Could not save: '+e.message;rating.querySelectorAll('.pain-btn').forEach(btn=>btn.disabled=false)}
      });rating.append(b);
    }
    rating.append(stat);
    const share=document.createElement('button');share.type='button';share.className='loss-share';share.textContent='SHARE THIS LOSS ↗';share.addEventListener('click',()=>shareLoss(g));
    tools.append(rating,share);content.append(heading,meta,desc,source,tools);el.append(summary,content);list.append(el);
  }
  const target=decodeURIComponent(location.hash.slice(1));if(target.startsWith('loss-')){const match=document.getElementById(target);if(match)match.open=true}
}
for(const name of filters){const btn=document.createElement('button');btn.type='button';btn.className='lossfilter';btn.textContent=name;btn.addEventListener('click',()=>{selected=name;filterBar.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));renderLosses()});btn.setAttribute('aria-pressed',String(name==='All'));filterBar.append(btn)}list.before(filterBar);renderLosses();loadPain();
const canvas=$('shareCanvas'),ctx=canvas.getContext('2d');
function shareCard(){
  ctx.fillStyle='#111115';ctx.fillRect(0,0,1200,630);
  ctx.fillStyle='#d72843';ctx.fillRect(0,0,18,630);
  ctx.fillStyle='#ff5268';ctx.font='bold 38px Arial';ctx.fillText('THIRDBASERYAN.COM',65,100);
  const personalized=showVerdict&&poll.total&&poll.choice;
  const verdict=showVerdict&&poll.total;
  ctx.fillStyle='#fff';ctx.font='bold 76px Arial';
  ctx.fillText(personalized?'I VOTED '+poll.choice.toUpperCase():verdict?'THE FAN VERDICT:':'BORN ON THIRD.',65,245);
  ctx.fillStyle='#ff5268';ctx.font='bold 88px Arial';
  ctx.fillText(verdict?`${poll.firePercent}% SAY FIRE HIM`:'STILL TRYING TO',65,355);
  ctx.font='bold 58px Arial';
  ctx.fillText(verdict?`${Number(poll.total).toLocaleString()} COMMUNITY BALLOTS`:'STEAL HOME.',65,460);
  ctx.fillStyle='#bdbdc5';ctx.font='24px Arial';
  ctx.fillText('Informal self-selected fan poll • Not affiliated with Ohio State',65,565);
}
shareCard();
$('verdictCard').addEventListener('click',()=>{showVerdict=!showVerdict;$('verdictCard').textContent=showVerdict?'SHOW ORIGINAL CARD':'SHOW FAN VERDICT ON CARD';shareCard()});
$('download').addEventListener('click',()=>{const a=document.createElement('a');a.download='thirdbaseryan-share.png';a.href=canvas.toDataURL('image/png');a.click()});
async function shareVote(){
  showVerdict=true;$('verdictCard').textContent='SHOW ORIGINAL CARD';shareCard();
  const url=location.origin+location.pathname+'#vote';
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  const file=blob?new File([blob],'thirdbaseryan-my-vote.png',{type:'image/png'}):null;
  const text=poll.choice?`I voted ${poll.choice.toUpperCase()} on ThirdBaseRyan. ${poll.firePercent}% of fans voted FIRE. ${url}`:`The ThirdBaseRyan fan verdict: ${poll.firePercent}% voted FIRE. ${url}`;
  try{
    if(file&&navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:'ThirdBaseRyan Fan Verdict',text});return;}
    if(navigator.share){await navigator.share({title:'ThirdBaseRyan Fan Verdict',text,url});return;}
  }catch(e){if(e.name==='AbortError')return;}
  const a=document.createElement('a');a.download='thirdbaseryan-my-vote.png';a.href=canvas.toDataURL('image/png');a.click();
}
$('shareMyVote').addEventListener('click',shareVote);
$('shareButton').addEventListener('click',shareVote);
document.querySelectorAll('.merch-info a,.featured-merch a,.loss-merch-callout a').forEach(a=>a.addEventListener('click',()=>{try{if(typeof window.gtag==='function')window.gtag('event','merch_click',{product_url:a.href});}catch{}}));
