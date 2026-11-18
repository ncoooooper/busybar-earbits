import {device} from "@shared/device";
import {surface,label,panel,rect,wrap,mint,amber,read,persist,report,type Frame,type Key} from "@shared/surface";
import manifest from "./appmeta/manifest.json";

const intervals=["Major 3rd","Perfect 4th","Perfect 5th","Octave"];
let question=Math.floor(Math.random()*4), choice=0, answered=false, playing=false, stopped=false;
let message="Start: hear the pair";
let audioEndsAt=0;
let stats=read("scores",{right:0,total:0,streak:0,best:0});
function draw():Frame{
 const color=answered?(choice===question?mint:amber):"#ABB8FFFF";
 return [rect("line",0,0,Math.round((choice+1)*18),2,color),
 label("pick",answered?(choice===question?"Correct!":"Hear again"):intervals[choice],1,0,color),
 ...panel("EARBITS",["Identify the interval",answered?"Answer: "+intervals[question]:message,
 "Pick: "+intervals[choice],"Score "+stats.right+"/"+stats.total+"   Best "+stats.best,
 "Start: replay the notes",answered?"Click: next question":"Wheel: choose / click: grade"])];
}
async function play(){
 if(playing||stopped)return;
 playing=true;
 try{
   const startedAt=Date.now();
   await device.AudioPlay({application_name:manifest.id,path:"sounds/pair"+question+".snd"});
   audioEndsAt=startedAt+1000;
   message="Heard both notes?";console.log("Played pair",question);
 }catch(error){message="Audio unavailable: retry";report(error);}
 finally{playing=false;if(!stopped)refresh();}
}
function key(k:Key){
 if(k==="start"){void play();return;}
 if(!answered&&(k==="up"||k==="down"))choice=wrap(choice+(k==="up"?1:-1),4);
 if(k==="ok"&&!answered){
   answered=true;stats.total++;stats.streak=choice===question?stats.streak+1:0;
   if(choice===question)stats.right++;
   stats.best=Math.max(stats.best,stats.streak);persist("scores",stats);
   console.log("graded",choice,question,stats.right,stats.total);
 }else if(k==="ok"){
   answered=false;question=wrap(question+1+Math.floor(Math.random()*3),4);choice=0;void play();
 }
}
const refresh=surface(draw,key,()=>{stopped=true;if(Date.now()<audioEndsAt)void device.AudioStop().catch(report);},{enabled:false});
void play();
