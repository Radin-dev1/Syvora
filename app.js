const emptyStyles=document.createElement('link');
emptyStyles.rel='stylesheet';
emptyStyles.href='./empty-states.css?v=20260828-clean1';
document.head.appendChild(emptyStyles);

const chatStyles=document.createElement('link');
chatStyles.rel='stylesheet';
chatStyles.href='./chat-upgrade.css?v=20260828-chat2';
document.head.appendChild(chatStyles);

const localAIStyles=document.createElement('link');
localAIStyles.rel='stylesheet';
localAIStyles.href='./local-ai.css?v=20260828-local1';
document.head.appendChild(localAIStyles);

window.syvoraLocalAIReady=import('./local-ai.js?v=20260828-local1').catch(err=>{
  console.error('Local AI failed to load',err);
  return null;
});

const pages=[...document.querySelectorAll('.page')];
const navItems=[...document.querySelectorAll('.nav-item[data-page]')];
const pageTitle=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const names={home:'Home',ai:'AI Chat',chat:'Team Chat',projects:'Projects',studios:'Studios',build:'App Builder',code:'Code Studio',agents:'Agents',files:'Files',automations:'Automations'};

function icons(){if(window.lucide)window.lucide.createIcons()}
function notify(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2100)}
function openPage(name,push=true){if(!names[name])name='home';pages.forEach(p=>p.classList.toggle('active',p.id===`page-${name}`));navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===name));if(pageTitle)pageTitle.textContent=names[name];if(push)history.replaceState(null,'',name==='home'?location.pathname:`#${name}`);window.scrollTo({top:0,behavior:'smooth'});icons()}
navItems.forEach(n=>n.addEventListener('click',()=>openPage(n.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(el=>el.addEventListener('click',()=>openPage(el.dataset.pageLink)));
const initial=location.hash.slice(1);if(names[initial])openPage(initial,false);
window.addEventListener('hashchange',()=>openPage(location.hash.slice(1)||'home',false));

const modal=document.getElementById('commandModal');
const commandInput=document.getElementById('commandInput');
function openCommand(){modal?.classList.add('open');modal?.setAttribute('aria-hidden','false');setTimeout(()=>commandInput?.focus(),40)}
function closeCommand(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');if(commandInput)commandInput.value=''}
document.getElementById('commandButton')?.addEventListener('click',openCommand);
modal?.addEventListener('click',e=>{if(e.target===modal)closeCommand()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape'){closeCommand();closeStudio()}});
commandInput?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.command-list button').forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?'flex':'none')});
document.querySelectorAll('[data-command-page]').forEach(b=>b.addEventListener('click',()=>{openPage(b.dataset.commandPage);closeCommand()}));

async function getLocalAI(){
  await window.syvoraLocalAIReady;
  if(!window.SyvoraLocalAI)throw new Error('The local AI module could not load. Check your internet connection and refresh.');
  return window.SyvoraLocalAI;
}

const homePrompt=document.getElementById('homePrompt');
const homeMode=document.getElementById('homeMode');
async function submitHome(){
  const text=homePrompt?.value.trim();
  if(!text){notify('Type something first');return}
  const mode=homeMode?.value||'Normal chat';
  if(mode==='Create mode'){
    openPage('studios');
    notify('Choose a Studio');
  }else{
    openPage('ai');
    const chatMode=document.getElementById('chatMode');
    if(chatMode)chatMode.value=mode;
    if(homePrompt)homePrompt.value='';
    await sendChat(text);
  }
}
document.getElementById('homeSend')?.addEventListener('click',submitHome);
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitHome()}});

const messages=document.getElementById('messages');
const chatInput=document.getElementById('chatInput');
const chatHistory=[];
let chatBusy=false;
function clearEmpty(){messages?.querySelector('.empty-chat')?.remove()}
function appendMessage(text,role='user',streaming=false){
  if(!messages)return null;
  clearEmpty();
  const row=document.createElement('div');
  row.className=`message ${role==='assistant'?'assistant':''}${streaming?' local-streaming':''}`;
  const avatar=document.createElement('div');
  avatar.className='message-avatar';
  avatar.innerHTML=role==='assistant'?'<i data-lucide="sparkles"></i>':'R';
  const body=document.createElement('div');
  body.className='message-body';
  const who=document.createElement('strong');
  who.textContent=role==='assistant'?'Syvora':'You';
  const p=document.createElement('p');
  p.textContent=text;
  body.append(who,p);
  row.append(avatar,body);
  messages.appendChild(row);
  messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});
  icons();
  return {row,p,body};
}
function setChatDisabled(disabled){
  chatBusy=disabled;
  if(chatInput)chatInput.disabled=disabled;
  const send=document.getElementById('chatSend');
  if(send)send.disabled=disabled;
}
async function sendChat(overrideText){
  const text=(overrideText??chatInput?.value??'').trim();
  if(!text||chatBusy)return;
  appendMessage(text,'user');
  chatHistory.push({role:'user',content:text});
  if(chatInput)chatInput.value='';
  const assistant=appendMessage('Starting local AI…','assistant',true);
  if(!assistant)return;
  setChatDisabled(true);
  try{
    const ai=await getLocalAI();
    const answer=await ai.generate(chatHistory,{
      onProgress:status=>{if(!assistant.p.textContent||assistant.p.textContent==='Starting local AI…')assistant.p.textContent=status;},
      onToken:full=>{
        assistant.p.textContent=full;
        messages.scrollTop=messages.scrollHeight;
      }
    });
    assistant.row.classList.remove('local-streaming');
    chatHistory.push({role:'assistant',content:answer});
  }catch(err){
    console.error(err);
    assistant.row.classList.remove('local-streaming');
    assistant.row.classList.add('local-model-error');
    assistant.p.textContent=`Local AI could not start: ${err.message}`;
  }finally{
    setChatDisabled(false);
    chatInput?.focus();
  }
}
document.getElementById('chatSend')?.addEventListener('click',()=>sendChat());
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}});
function bindStarterButtons(){
  document.querySelectorAll('.starter-grid button:not([data-open-studio])').forEach(btn=>{
    if(btn.dataset.localBound)return;
    btn.dataset.localBound='1';
    btn.addEventListener('click',()=>{
      const title=btn.querySelector('strong')?.textContent||btn.textContent.trim();
      if(chatInput){chatInput.value=title;chatInput.focus()}
    });
  });
}
bindStarterButtons();
document.getElementById('newChat')?.addEventListener('click',async()=>{
  chatHistory.length=0;
  try{(await getLocalAI()).reset()}catch{}
  if(messages)messages.innerHTML='<div class="empty-chat"><img src="assets/syvora-logo.svg" alt="Syvora" /><h2>What do you want to work on?</h2><p>Ask anything or write code with a local model running on your device.</p><div class="starter-grid"><button><i data-lucide="telescope"></i><span><strong>Explain a topic</strong><small>Ask the local model</small></span></button><button><i data-lucide="code-2"></i><span><strong>Write or debug code</strong><small>Use the local coding model</small></span></button><button data-open-studio="Image Studio"><i data-lucide="image"></i><span><strong>Create an image</strong><small>Open Image Studio</small></span></button><button><i data-lucide="lightbulb"></i><span><strong>Brainstorm ideas</strong><small>Generate ideas locally</small></span></button></div>';
  bindStarterButtons();bindStudioOpeners();icons();
});
document.querySelectorAll('.toggle').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));

const teamTextarea=document.querySelector('.team-composer textarea');
document.querySelector('.send-team')?.addEventListener('click',()=>notify('Create or open a channel before sending messages'));
teamTextarea?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();notify('Create or open a channel before sending messages')}});
document.querySelectorAll('.team-tabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.team-tabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));

const studioModal=document.getElementById('studioModal');
const studioTitle=document.getElementById('studioWorkspaceTitle');
const studioSubtitle=document.getElementById('studioWorkspaceSubtitle');
const studioCanvasTitle=document.getElementById('studioCanvasTitle');
const studioCanvasText=document.getElementById('studioCanvasText');
const studioPrompt=document.getElementById('studioPrompt');
const studioProfiles={
  'Image Studio':['Generate, edit and enhance images','Create your first image','Describe an image, upload a reference, or use editing tools.'],
  'Video Studio':['Generate and edit videos','Create your first video','Start from text, an image, or a clip, then edit it on the timeline.'],
  'UI Designer':['Design websites and apps','Design a new interface','Describe the product and create an editable UI canvas.'],
  '3D Designer':['Create 3D objects and scenes','Create a 3D scene','Describe an object or scene, then adjust materials, lighting and cameras.'],
  'Website Builder':['Build and publish websites','Build a website','Describe the site you want and edit the responsive preview.'],
  'App Builder':['Create applications','Build an app','Describe your app, screens and functionality.'],
  'Code Studio':['Write, debug and ship code','Start coding','Connect a repository or describe what you want to build.'],
  'Brand Studio':['Create brand systems','Build a brand','Create logos, colors, typography and brand rules.'],
  'Audio Studio':['Voice, sound and audio tools','Create audio','Create narration, voices, sound effects or clean up audio.'],
  'Presentation Studio':['Create slide decks','Create a presentation','Describe your topic and structure the slides.'],
  'Document Studio':['Create reports and documents','Create a document','Create reports, PDFs, briefs, notes and summaries.'],
  'Game Studio':['Design games and game assets','Create a game concept','Plan maps, UI, scripts and game assets.'],
  'Agent Studio':['Build custom AI workers','Create an agent','Give an agent a role, instructions, tools, memory and permissions.'],
  'Automation Studio':['Create workflows','Build an automation','Choose a trigger and connect actions, agents and apps.']
};
function openStudio(name){const profile=studioProfiles[name]||['Create with Syvora','Start creating','Describe what you want to make.'];if(studioTitle)studioTitle.textContent=name;if(studioSubtitle)studioSubtitle.textContent=profile[0];if(studioCanvasTitle)studioCanvasTitle.textContent=profile[1];if(studioCanvasText)studioCanvasText.textContent=profile[2];if(studioPrompt){studioPrompt.value='';studioPrompt.placeholder=`Describe what you want to make in ${name}...`;}studioModal?.classList.add('open');studioModal?.setAttribute('aria-hidden','false');icons()}
function closeStudio(){studioModal?.classList.remove('open');studioModal?.setAttribute('aria-hidden','true')}
function bindStudioOpeners(){document.querySelectorAll('[data-open-studio]').forEach(el=>{if(el.dataset.bound)return;el.dataset.bound='1';el.addEventListener('click',e=>{e.stopPropagation();openStudio(el.dataset.openStudio)})})}
bindStudioOpeners();
document.getElementById('closeStudio')?.addEventListener('click',closeStudio);
document.getElementById('studioGenerate')?.addEventListener('click',()=>{const text=studioPrompt?.value.trim();if(!text){notify('Describe what you want to create first');return}notify('This Studio needs its own local media model. Text/code AI is working now.')});
document.querySelectorAll('.studio-tools button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.studio-tools button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));
document.querySelectorAll('.studio-filter button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.studio-filter button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));

const buildInput=document.getElementById('buildInput');
const builderLog=document.querySelector('.builder-chat-log');
const browserPreview=document.querySelector('#page-build .browser-preview');
let generatedAppHTML='';
let buildBusy=false;
function appendBuildMessage(text,type='user'){
  if(!builderLog)return null;
  const div=document.createElement('div');
  div.className=type==='user'?'builder-user-message':'builder-ai-message';
  if(type!=='user')div.innerHTML='<strong>Syvora Local AI</strong><span></span>';
  if(type==='user')div.textContent=text;else div.querySelector('span').textContent=text;
  builderLog.appendChild(div);
  builderLog.scrollTop=builderLog.scrollHeight;
  return type==='user'?div:div.querySelector('span');
}
function renderGeneratedApp(html){
  if(!browserPreview)return;
  generatedAppHTML=html;
  browserPreview.classList.add('has-generated-app');
  browserPreview.querySelector('.preview-empty')?.remove();
  let frame=browserPreview.querySelector('.generated-preview-frame');
  if(!frame){
    frame=document.createElement('iframe');
    frame.className='generated-preview-frame';
    frame.setAttribute('sandbox','allow-scripts allow-forms allow-modals allow-popups');
    browserPreview.appendChild(frame);
  }
  frame.srcdoc=html;
}
function showGeneratedCode(){
  if(!browserPreview||!generatedAppHTML)return notify('Generate an app first');
  browserPreview.querySelector('.generated-preview-frame')?.remove();
  browserPreview.querySelector('.generated-code-view')?.remove();
  const pre=document.createElement('pre');
  pre.className='generated-code-view';
  pre.textContent=generatedAppHTML;
  browserPreview.appendChild(pre);
}
function showGeneratedPreview(){
  if(!generatedAppHTML)return;
  browserPreview?.querySelector('.generated-code-view')?.remove();
  renderGeneratedApp(generatedAppHTML);
}
async function sendBuild(){
  const text=buildInput?.value.trim();
  if(!text||buildBusy){if(!text)notify('Describe what you want to build first');return}
  appendBuildMessage(text,'user');
  buildInput.value='';
  const status=appendBuildMessage('Preparing the local model…','assistant');
  status?.parentElement?.classList.add('loading');
  buildBusy=true;
  if(buildInput)buildInput.disabled=true;
  const send=document.getElementById('buildSend');if(send)send.disabled=true;
  try{
    const ai=await getLocalAI();
    const html=await ai.buildApp(text,{
      onProgress:s=>{if(status)status.textContent=s},
      onToken:full=>{if(status)status.textContent=`Generating app locally… ${Math.max(1,Math.round(full.length/80))} chunks`}
    });
    if(!/<html[\s>]/i.test(html))throw new Error('The model did not return a complete HTML app. Try a simpler prompt.');
    renderGeneratedApp(html);
    if(status)status.textContent='App generated locally. You can preview it or open the Code tab.';
    status?.parentElement?.classList.remove('loading');
  }catch(err){
    console.error(err);
    if(status)status.textContent=`Could not generate the app: ${err.message}`;
    status?.parentElement?.classList.remove('loading');
    status?.parentElement?.classList.add('error');
  }finally{
    buildBusy=false;
    if(buildInput)buildInput.disabled=false;
    if(send)send.disabled=false;
    buildInput?.focus();
  }
}
document.getElementById('buildSend')?.addEventListener('click',sendBuild);
buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendBuild()}});
document.querySelectorAll('#page-build .builder-toolbar button').forEach(btn=>btn.addEventListener('click',()=>{
  const label=btn.textContent.trim().toLowerCase();
  if(label==='preview'){document.querySelectorAll('#page-build .builder-toolbar button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');showGeneratedPreview()}
  if(label==='code'){document.querySelectorAll('#page-build .builder-toolbar button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');showGeneratedCode()}
  if(label==='visual edit')notify('Visual editing is next; the local AI generation and preview are working now.');
}));

document.querySelectorAll('.primary-button').forEach(btn=>{if(!btn.dataset.pageLink&&!['newChat'].includes(btn.id)&&!btn.closest('.studio-modal')&&!btn.closest('#page-build'))btn.addEventListener('click',()=>notify(`${btn.textContent.trim()} is not connected yet`))});
icons();