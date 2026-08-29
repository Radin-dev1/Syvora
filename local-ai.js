const MODEL_ID = 'Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC';
const SYSTEM_PROMPT = `You are Syvora, a helpful AI assistant running locally in the user's browser. Be concise, practical, and accurate. You can answer general questions, brainstorm, explain concepts, and write or debug code. Never claim you searched the web, opened files, accessed GitHub, used tools, or saw workspace data unless that content was explicitly included in the user's message. For coding requests, prefer complete runnable examples and explain only what is useful.`;
const BUILD_PROMPT = `You are Syvora App Builder running locally in the browser. Build a polished, responsive web app from the user's request. Return ONLY one complete HTML document starting with <!doctype html>. Put all CSS inside <style> and all JavaScript inside <script>. Do not use markdown fences. Avoid external libraries unless absolutely necessary. The result must work inside an iframe srcdoc, have a modern 2026-quality UI, usable interactions, responsive layout, and no placeholder claims about features that do not exist.`;

let webllmModule = null;
let engine = null;
let loadingPromise = null;
let lastProgress = '';

function supportsWebGPU(){
  return typeof navigator !== 'undefined' && !!navigator.gpu;
}

function setStatus(text, state='idle'){
  lastProgress = text;
  document.querySelectorAll('[data-local-ai-status]').forEach(el=>{
    el.textContent = text;
    el.dataset.state = state;
  });
  const readyLine = document.querySelector('.chat-title span');
  if(readyLine){
    readyLine.innerHTML = `<i></i> ${text}`;
    readyLine.dataset.state = state;
  }
}

async function loadModule(){
  if(webllmModule) return webllmModule;
  webllmModule = await import('https://esm.run/@mlc-ai/web-llm');
  return webllmModule;
}

async function ensureEngine(){
  if(engine) return engine;
  if(loadingPromise) return loadingPromise;
  loadingPromise = (async()=>{
    if(!supportsWebGPU()){
      throw new Error('WebGPU is not available in this browser. Use a recent Chrome or Edge browser with WebGPU enabled.');
    }
    setStatus('Loading local AI…','loading');
    const webllm = await loadModule();
    const appConfig = {...webllm.prebuiltAppConfig, cacheBackend:'indexeddb'};
    engine = await webllm.CreateMLCEngine(MODEL_ID,{
      appConfig,
      initProgressCallback:(report)=>{
        const text = report?.text || 'Loading local AI…';
        const pct = typeof report?.progress === 'number' ? ` ${Math.round(report.progress*100)}%` : '';
        setStatus(`${text}${pct}`,'loading');
      },
      logLevel:'WARN'
    },{context_window_size:4096});
    setStatus('Local AI ready','ready');
    return engine;
  })().catch(err=>{
    engine = null;
    loadingPromise = null;
    setStatus('Local AI unavailable','error');
    throw err;
  });
  return loadingPromise;
}

async function generate(messages,{systemPrompt=SYSTEM_PROMPT,maxTokens=700,temperature=.65,onToken,onProgress}={}){
  onProgress?.('Starting local AI…');
  const llm = await ensureEngine();
  const requestMessages = [{role:'system',content:systemPrompt},...messages.slice(-12)];
  const stream = await llm.chat.completions.create({
    messages:requestMessages,
    temperature,
    max_tokens:maxTokens,
    stream:true
  });
  let output='';
  for await (const chunk of stream){
    const delta = chunk?.choices?.[0]?.delta?.content || '';
    if(!delta) continue;
    output += delta;
    onToken?.(output,delta);
  }
  if(!output.trim()) throw new Error('The local model returned an empty response.');
  return output.trim();
}

function cleanGeneratedHtml(text){
  let html = String(text || '').trim();
  html = html.replace(/^```(?:html)?\s*/i,'').replace(/```\s*$/,'').trim();
  const start = html.toLowerCase().indexOf('<!doctype html>');
  if(start >= 0) html = html.slice(start);
  if(!/^<!doctype html>/i.test(html) && /<html[\s>]/i.test(html)) html='<!doctype html>\n'+html;
  return html;
}

async function buildApp(prompt,{onToken,onProgress}={}){
  const result = await generate([{role:'user',content:prompt}],{
    systemPrompt:BUILD_PROMPT,
    maxTokens:1800,
    temperature:.55,
    onToken,
    onProgress
  });
  return cleanGeneratedHtml(result);
}

function reset(){
  try{ engine?.resetChat?.(); }catch{}
}

function installStatusUI(){
  const note = document.querySelector('.composer-note');
  if(note){
    note.innerHTML = '<span class="local-ai-dot"></span><span data-local-ai-status>Local AI · loads on first message</span><span class="local-ai-privacy">No API key · runs on your device</span>';
  }
  const modelButton = document.querySelector('.model-button');
  if(modelButton){
    modelButton.innerHTML = 'Local Qwen <i data-lucide="cpu"></i>';
    modelButton.title = 'Qwen2.5-Coder 0.5B running locally with WebLLM';
  }
  setStatus(supportsWebGPU() ? 'Local AI ready to load' : 'WebGPU required', supportsWebGPU() ? 'idle':'error');
  if(window.lucide) window.lucide.createIcons();
}

installStatusUI();

window.SyvoraLocalAI = {
  modelId:MODEL_ID,
  supportsWebGPU,
  ensureEngine,
  generate,
  buildApp,
  reset,
  get status(){return lastProgress;}
};

export {MODEL_ID,ensureEngine,generate,buildApp,reset};