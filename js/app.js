import {initNavigation,toast} from './ui.js';
import {createPosterEngine} from './poster/engine.js';

initNavigation();

const $=s=>document.querySelector(s);
const uploadZone=$('#uploadZone'),fileInput=$('#supporterUpload'),avatar=$('#uploadAvatar'),uploadTitle=$('#uploadTitle');
const nameInput=$('#supporterName'),messageInput=$('#slogan'),hashtagInput=$('#hashtag'),zoomInput=$('#zoomRange'),zoomValue=$('#zoomValue');
const downloadBtn=$('#downloadBtn'),shareBtn=$('#shareBtn'),resetBtn=$('#resetBtn'),status=$('#previewStatus'),posterState=$('#posterState');
const engine=createPosterEngine({canvas:$('#posterCanvas'),candidateSrc:'assets/images/img_9783.webp',logoSrc:'assets/images/apc-logo.webp',onState:({hasSupporter,name})=>{status.textContent=hasSupporter?'Personalized':'Ready';posterState.textContent=hasSupporter?(name?`Prepared for ${name}`:'Personalized poster'):'Base poster ready'}});

engine.ready().catch(()=>toast('The campaign image could not be loaded.'));

function update(){engine.set({name:nameInput.value.trim(),message:messageInput.value.trim(),hashtag:hashtagInput.value.trim()})}
[nameInput,messageInput,hashtagInput].forEach(el=>el.addEventListener('input',update));
zoomInput.addEventListener('input',()=>{zoomValue.value=`${zoomInput.value}%`;engine.setZoom(Number(zoomInput.value))});

uploadZone.addEventListener('click',()=>fileInput.click());
['dragenter','dragover'].forEach(type=>uploadZone.addEventListener(type,e=>{e.preventDefault();uploadZone.classList.add('dragging')}));
['dragleave','drop'].forEach(type=>uploadZone.addEventListener(type,e=>{e.preventDefault();uploadZone.classList.remove('dragging')}));
uploadZone.addEventListener('drop',e=>handleFile(e.dataTransfer.files?.[0]));
fileInput.addEventListener('change',e=>handleFile(e.target.files?.[0]));
function handleFile(file){if(!file||!file.type.startsWith('image/'))return toast('Please choose an image file.');if(file.size>8*1024*1024)return toast('Please choose an image under 8 MB.');const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{engine.setSupporter(img);avatar.innerHTML='';const thumb=new Image();thumb.src=url;thumb.alt='Selected supporter photo';avatar.appendChild(thumb);uploadTitle.textContent='Photo selected';toast('Photo added to the poster.');};img.onerror=()=>toast('That image could not be read.');img.src=url}

uploadZone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fileInput.click()}});

document.querySelectorAll('.template-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.template-tab').forEach(t=>{const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active))});engine.setTemplate(tab.dataset.template)}));

downloadBtn.addEventListener('click',async()=>{const blob=await engine.blob();if(!blob)return;const safe=(nameInput.value.trim()||'supporter').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'supporter';const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`faisal-shuaib-poster-${safe}.png`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Poster downloaded.');});

shareBtn.addEventListener('click',async()=>{const blob=await engine.blob();if(!blob)return;const file=new File([blob],'faisal-shuaib-poster.png',{type:'image/png'});if(navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({title:'Dr. Faisal Shuaib poster',text:'Dr. Faisal Shuaib — Nasarawa West',files:[file]})}catch(e){if(e.name!=='AbortError')toast('Sharing was not available.')}}else{await navigator.clipboard?.writeText(location.href);toast('Poster sharing is not supported here; page link copied if available.')}});

resetBtn.addEventListener('click',()=>{engine.reset();nameInput.value='';messageInput.value='I stand with Dr. Faisal Shuaib';hashtagInput.value='#FaisalForNasarawaWest';zoomInput.value='100';zoomValue.value='100%';fileInput.value='';avatar.innerHTML='<span>+</span>';uploadTitle.textContent='Upload a photo';document.querySelectorAll('.template-tab').forEach(t=>{const active=t.dataset.template==='classic';t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active))});toast('Studio reset.');});
