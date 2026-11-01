const $ = id => document.getElementById(id);
let voiceBlob = null, voiceUrl = null, videoUrl = null, exportedUrl = null;

$("toggleKey").addEventListener("click", () => {
  const field = $("apiKey");
  field.type = field.type === "password" ? "text" : "password";
  $("toggleKey").textContent = field.type === "password" ? "បង្ហាញ" : "លាក់";
});

$("videoFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  if (videoUrl) URL.revokeObjectURL(videoUrl);
  videoUrl = URL.createObjectURL(file);
  $("video").src = videoUrl;
  $("video").load();
  $("status").textContent = "បានបញ្ចូលវីដេអូរួចរាល់។";
});

$("generateBtn").addEventListener("click", async () => {
  const key = $("apiKey").value.trim();
  const input = $("voiceText").value.trim();
  if (!key) return setStatus("សូមបញ្ចូល OpenAI API Key ជាមុន។", true);
  if (!input) return setStatus("សូមសរសេរអត្ថបទដែលចង់ឱ្យ AI អាន។", true);
  if (input.length > 4096) return setStatus("អត្ថបទវែងពេក។ សូមកាត់ឱ្យតិចជាង 4096 តួអក្សរ។", true);

  const btn = $("generateBtn");
  btn.disabled = true;
  setStatus("កំពុងបង្កើតសំឡេង… សូមរង់ចាំ។");
  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: $("voice").value,
        input,
        instructions: $("style").value,
        response_format: "mp3"
      })
    });
    if (!response.ok) {
      let message = `OpenAI API Error (${response.status})`;
      try { const data = await response.json(); message = data.error?.message || message; } catch {}
      throw new Error(message);
    }
    voiceBlob = await response.blob();
    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    voiceUrl = URL.createObjectURL(voiceBlob);
    $("audio").src = voiceUrl;
    $("audioDownload").href = voiceUrl;
    $("audioDownload").hidden = false;
    setStatus("សំឡេង AI បានបង្កើតរួចរាល់! អាចស្ដាប់ ឬទាញយកបាន។");
  } catch (err) {
    const msg = err.message || String(err);
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      setStatus("មិនអាចភ្ជាប់ API ពី browser បានទេ (អាចជា CORS)។ GitHub Pages តែមួយមុខមិនអាចដោះស្រាយបញ្ហានេះបានទេ—ត្រូវប្រើ backend។", true);
    } else {
      setStatus(msg, true);
    }
  } finally {
    btn.disabled = false;
  }
});

$("exportBtn").addEventListener("click", async () => {
  const video = $("video");
  if (!video.src) return setStatus("សូមបញ្ចូលវីដេអូជាមុន។", true);
  if (!voiceBlob || !voiceUrl) return setStatus("សូមបង្កើតសំឡេង AI ជាមុន។", true);
  if (!("MediaRecorder" in window) || !video.captureStream) {
    return setStatus("Browser នេះមិនគាំទ្រ Export។ សូមប្រើ Chrome ឬ Edge កំណែថ្មី។", true);
  }

  const btn = $("exportBtn");
  btn.disabled = true;
  try {
    video.pause();
    video.currentTime = 0;
    await waitForMedia(video);
    const audio = $("audio");
    audio.pause();
    audio.currentTime = 0;

    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    const canvasStream = canvas.captureStream(30);
    const videoStream = video.captureStream();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();
    await audioCtx.resume();
    const destination = audioCtx.createMediaStreamDestination();

    const voiceSource = audioCtx.createMediaElementSource(audio);
    voiceSource.connect(destination);
    voiceSource.connect(audioCtx.destination);

    if (!$("muteOriginal").checked) {
      const originalTracks = videoStream.getAudioTracks();
      if (originalTracks.length) {
        const originalStream = new MediaStream(originalTracks);
        const originalSource = audioCtx.createMediaStreamSource(originalStream);
        originalSource.connect(destination);
      }
    }

    const mixedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...destination.stream.getAudioTracks()
    ]);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus" : "video/webm";
    const recorder = new MediaRecorder(mixedStream, { mimeType: mime });
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    const stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = e => reject(e.error || new Error("Export error"));
    });

    function drawFrame() {
      if (video.readyState >= 2) ctx.drawImage(video, 0, 0, width, height);
      if (!video.paused && !video.ended) requestAnimationFrame(drawFrame);
    }

    setStatus("កំពុង Export វីដេអូ… សូមកុំបិទទំព័រ។");
    recorder.start(250);
    drawFrame();
    await video.play();
    await audio.play().catch(() => {});
    await new Promise(resolve => video.addEventListener("ended", resolve, { once: true }));
    recorder.stop();
    await stopped;

    const result = new Blob(chunks, { type: "video/webm" });
    if (exportedUrl) URL.revokeObjectURL(exportedUrl);
    exportedUrl = URL.createObjectURL(result);
    $("videoDownload").href = exportedUrl;
    $("videoDownload").hidden = false;
    setStatus("Export រួចរាល់! ចុច «ទាញយកវីដេអូ WebM»។");
    await audioCtx.close();
  } catch (err) {
    setStatus("Export មិនបានសម្រេច៖ " + (err.message || err), true);
  } finally {
    btn.disabled = false;
  }
});

function setStatus(message, error = false) {
  $("status").textContent = message;
  $("status").style.color = error ? "#ff9e9e" : "#a9e5c0";
}
function waitForMedia(media) {
  if (media.readyState >= 2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    media.addEventListener("loadeddata", resolve, { once: true });
    media.addEventListener("error", () => reject(new Error("មិនអាចអានវីដេអូនេះបានទេ។")), { once: true });
  });
}