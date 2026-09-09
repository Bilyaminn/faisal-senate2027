import {renderPoster,TEMPLATES} from './templates.js';

export function createPosterEngine({canvas,candidateSrc,logoSrc,onState}){
  const ctx=canvas.getContext('2d',{alpha:false});
  const candidate=new Image(),logoImg=new Image();
  let supporter=null,template='classic',zoom=100,renderQueued=false;
  const state={name:'',message:'I stand with Dr. Faisal Shuaib',hashtag:'#FaisalForNasarawaWest'};
  candidate.decoding='async';logoImg.decoding='async';
  const candidateReady=new Promise((resolve,reject)=>{candidate.onload=resolve;candidate.onerror=()=>reject(new Error('Campaign portrait failed to load'));candidate.src=candidateSrc});
  logoImg.onload=()=>queue();
  logoImg.onerror=()=>queue();
  logoImg.src=logoSrc;
  function set(partial){Object.assign(state,partial);queue()}
  function setSupporter(img){supporter=img;queue()}
  function setTemplate(value){if(TEMPLATES[value]){template=value;queue()}}
  function setZoom(value){zoom=value;queue()}
  function queue(){if(renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;draw()})}
  function draw(){if(!candidate.complete||!candidate.naturalWidth)return;renderPoster({ctx,candidate,logoImg,supporter,name:state.name,message:state.message,hashtag:state.hashtag,zoom,template});onState?.({template,hasSupporter:Boolean(supporter),name:state.name})}
  async function ready(){await candidateReady; if(document.fonts?.ready) await document.fonts.ready; queue()}
  function reset(){supporter=null;template='classic';zoom=100;Object.assign(state,{name:'',message:'I stand with Dr. Faisal Shuaib',hashtag:'#FaisalForNasarawaWest'});queue()}
  function blob(){return new Promise(resolve=>canvas.toBlob(resolve,'image/png',1))}
  return {ready,set,setSupporter,setTemplate,setZoom,reset,blob,get template(){return template},get state(){return state},get hasSupporter(){return Boolean(supporter)}}
}
