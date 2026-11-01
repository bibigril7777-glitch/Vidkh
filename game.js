const $=id=>document.getElementById(id);
const video=$('preview'), audio=$('audioPreview');
let videoURL=null,audioURL=null,recordedBlob=null,recorder=null,stream=null,recordChunks=[];
function setFileName(el,file){el.textContent=file?file.name:'មិនទាន់មានឯកសារទេ'}
function updateReady(){$('exportBtn').disabled=!(video.src&&audio.src)}
$('videoInput').addEventListener('change',e=>{
 const f=e.target.files[0];if(!f)return;
 if(videoURL)URL.revokeObjectURL(videoURL);
 videoURL=URL.createObjectURL(f);video.src=videoURL;video.style.display='block';
 $('videoName').textContent=f.name;updateReady();$('downloadLink').hidden=true;
});
function loadAudio(blob,name){
 if(audioURL)URL.revokeObjectURL(audioURL);
 audioURL=URL.createObjectURL(blob);audio.src=audioURL;audio.style.display='block';
 $('audioName').textContent=name;updateReady();$('downloadLink').hidden=true;
}
$('audioInput').addEventListener('change',e=>{const f=e.target.files[0];if(f)loadAudio(f,f.name)});
$('delay').addEventListener('input',e=>$('delayValue').textContent=`${e.target.value} វិនាទី`);
$('volume').addEventListener('input',e=>$('volumeValue').textContent=`${Math.round(Number(e.target.value)*100)}%`);
$('recordBtn').addEventListener('click',async()=>{
 if(recorder&&recorder.state==='recording'){recorder.stop();$('recordBtn').textContent='● ចាប់ផ្ដើមថត';return}
 try{
  stream=await navigator.mediaDevices.getUserMedia({audio:true});recordChunks=[];
  const mime=MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':'audio/webm';
  recorder=new MediaRecorder(stream,{mimeType:mime});
  recorder.ondataavailable=e=>{if(e.data.size)recordChunks.push(e.data)};
  recorder.onstop=()=>{recordedBlob=new Blob(recordChunks,{type:recorder.mimeType||'audio/webm'});loadAudio(recordedBlob,'សំឡេងដែលបានថត.webm');stream.getTracks().forEach(t=>t.stop());$('recordStatus').textContent='ថតរួចរាល់';};
  recorder.start();$('recordBtn').textContent='■ បញ្ឈប់ការថត';$('recordStatus').textContent='កំពុងថតសំឡេង...';
 }catch(err){$('recordStatus').textContent='មិនអាចប្រើមីក្រូហ្វូនបានទេ។ សូមអនុញ្ញាតការប្រើប្រាស់មីក្រូហ្វូន។'}
});
$('exportBtn').addEventListener('click',async()=>{
 if(!video.src||!audio.src)return;
 const btn=$('exportBtn'),wrap=$('progressWrap'),bar=$('progressBar'),txt=$('progressText'),link=$('downloadLink');
 btn.disabled=true;link.hidden=true;wrap.hidden=false;bar.style.width='0%';
 let audioCtx,sourceAudio,videoStream,combined,dest,raf=0;
 try{
  // Start both tracks at a deterministic point.
  video.pause();video.currentTime=0;
  await new Promise((resolve,reject)=>{if(video.readyState>=2)resolve();else{video.onloadeddata=resolve;video.onerror=reject}});
  const canvas=document.createElement('canvas');
  const w=video.videoWidth||1280,h=video.videoHeight||720;
  const scale=Math.min(1,1280/w);canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);
  const ctx=canvas.getContext('2d');
  audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  sourceAudio=audioCtx.createMediaElementSource(audio);
  const voiceGain=audioCtx.createGain();voiceGain.gain.value=Number($('volume').value);
  sourceAudio.connect(voiceGain);
  dest=audioCtx.createMediaStreamDestination();voiceGain.connect(dest);
  if(!$('muteOriginal').checked&&video.captureStream){
   const original=video.captureStream();const originalAudio=original.getAudioTracks();
   // Original audio is optional and routed separately.
   if(originalAudio.length){const src=audioCtx.createMediaStreamSource(new MediaStream(originalAudio));src.connect(audioCtx.destination);src.connect(dest)}
  }
  videoStream=canvas.captureStream(30);
  combined=new MediaStream([...videoStream.getVideoTracks(),...dest.stream.getAudioTracks()]);
  const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  if(!mime)throw new Error('កម្មវិធីរុករកនេះមិនគាំទ្រការនាំចេញវីដេអូ WebM ទេ។');
  const chunks=[],out=new MediaRecorder(combined,{mimeType:mime,videoBitsPerSecond:2500000});
  out.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  const finished=new Promise(resolve=>out.onstop=()=>resolve(new Blob(chunks,{type:mime})));
  const delay=Number($('delay').value);
  audio.pause();audio.currentTime=0;video.currentTime=0;
  await audioCtx.resume();
  out.start(500);video.play();
  const draw=()=>{ctx.drawImage(video,0,0,canvas.width,canvas.height);if(!video.paused&&!video.ended)raf=requestAnimationFrame(draw)};
  draw();
  const start=performance.now();
  const startVoice=()=>{audio.currentTime=0;audio.play().catch(()=>{});};
  const delayTimer=setTimeout(startVoice,delay*1000);
  const progressTimer=setInterval(()=>{const p=Math.min(99,(video.currentTime/(video.duration||1))*100);bar.style.width=p+'%';txt.textContent=`កំពុងបង្កើត... ${Math.round(p)}%`;},300);
  await new Promise(resolve=>{video.onended=resolve;video.onerror=resolve});
  clearTimeout(delayTimer);clearInterval(progressTimer);cancelAnimationFrame(raf);
  out.stop();const blob=await finished;
  video.pause();audio.pause();video.currentTime=0;audio.currentTime=0;
  const url=URL.createObjectURL(blob);link.href=url;link.hidden=false;
  link.download='video-with-voice.webm';bar.style.width='100%';txt.textContent='រួចរាល់! ចុចខាងលើដើម្បីទាញយក។';
 }catch(err){txt.textContent='មានបញ្ហា៖ '+(err.message||'មិនអាចបង្កើតវីដេអូបានទេ');}
 finally{
  cancelAnimationFrame(raf);if(audioCtx)await audioCtx.close().catch(()=>{});
  if(videoStream)videoStream.getTracks().forEach(t=>t.stop());
  if(combined)combined.getTracks().forEach(t=>t.stop());
  btn.disabled=false;
 }
});