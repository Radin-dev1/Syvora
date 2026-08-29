const emptyStyles=document.createElement('link');
emptyStyles.rel='stylesheet';
emptyStyles.href='./empty-states.css?v=20260828-clean1';
document.head.appendChild(emptyStyles);

const chatStyles=document.createElement('link');
chatStyles.rel='stylesheet';
chatStyles.href='./chat-upgrade.css?v=20260828-chat2';
document.head.appendChild(chatStyles);

const pages=[...document.querySelectorAll('.page')];
const navItems=[...document.querySelectorAll('.nav-item[data-page]')];
const pageTitle=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const names={home:'Home',ai:'AI Chat',chat:'Team Chat',projects:'Projects',studios:'Studios',build:'App Builder',code:'Code Studio',agents:'Agents',files:'Files',automations:'Automations'};

function icons(){if(window.lucide)window.lucide.createIcons()}
function notify(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),1900)}
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

const homePrompt=document.getElementById('homePrompt');
const homeMode=document.getElementById('homeMode');
function submitHome(){const text=homePrompt?.value.trim();if(!text){notify('Type something first');return}const mode=homeMode?.value||'Normal chat';if(mode==='Create mode'){openPage('studios');notify('Choose a Studio to create in')}else{openPage('ai');const chatMode=document.getElementById('chatMode');if(chatMode)chatMode.value=mode;appendMessage(text,'user');notify('AI backend is not connected yet')}if(homePrompt)homePrompt.value=''}
document.getElementById('homeSend')?.addEventListener('click',submitHome);
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitHome()}});

const messages=document.getElementById('messages');
const chatInput=document.getElementById('chatInput');
function clearEmpty(){messages?.querySelector('.empty-chat')?.remove()}
function appendMessage(text,role='user'){if(!messages)return;clearEmpty();const row=document.createElement('div');row.className=`message ${role==='assistant'?'assistant':''}`;row.style.cssText='max-width:780px;width:100%;margin:8px auto;display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:flex-start';const avatar=document.createElement('div');avatar.style.cssText=`width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-weight:700;font-size:9px;${role==='assistant'?'background:#eaf5fd;color:#168eea':'background:#151a20;color:white'}`;avatar.innerHTML=role==='assistant'?'<i data-lucide="sparkles"></i>':'R';const bubble=document.createElement('div');bubble.style.cssText='font-size:10px;line-height:1.65;color:#4f5964;padding-top:2px';bubble.innerHTML=`<strong style="display:block;color:#1f252c;margin-bottom:3px">${role==='assistant'?'Syvora':'You'}</strong><p style="margin:0"></p>`;bubble.querySelector('p').textContent=text;row.append(avatar,bubble);messages.appendChild(row);messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});icons()}
function sendChat(){const text=chatInput?.value.trim();if(!text)return;appendMessage(text,'user');chatInput.value='';notify('AI backend is not connected yet')}
document.getElementById('chatSend')?.addEventListener('click',sendChat);
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}});
document.getElementById('newChat')?.addEventListener('click',()=>{if(messages)messages.innerHTML='<div class="empty-chat"><img src="assets/syvora-logo.svg" alt="Syvora" /><h2>What do you want to work on?</h2><p>Ask anything, research the web, analyze files, write code, generate creative work, or use workspace context after you add it.</p><div class="starter-grid"><button><i data-lucide="telescope"></i><span><strong>Research a topic</strong><small>Search and compare sources</small></span></button><button><i data-lucide="code-2"></i><span><strong>Write or debug code</strong><small>Start from scratch or connect a repo</small></span></button><button data-open-studio="Image Studio"><i data-lucide="image"></i><span><strong>Create an image</strong><small>Open Image Studio</small></span></button><button><i data-lucide="file-text"></i><span><strong>Analyze files</strong><small>Upload a file first</small></span></button></div>';bindStudioOpeners();icons();notify('New empty chat started')});
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
document.getElementById('studioGenerate')?.addEventListener('click',()=>{const text=studioPrompt?.value.trim();if(!text){notify('Describe what you want to create first');return}notify('Generation backend is not connected yet')});
document.querySelectorAll('.studio-tools button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.studio-tools button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));
document.querySelectorAll('.studio-filter button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.studio-filter button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));

const buildInput=document.getElementById('buildInput');
document.getElementById('buildSend')?.addEventListener('click',()=>{if(!buildInput?.value.trim()){notify('Describe what you want to build first');return}notify('App generation backend is not connected yet')});
buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('buildSend')?.click()}});

document.querySelectorAll('.primary-button').forEach(btn=>{if(!btn.dataset.pageLink&&!['newChat'].includes(btn.id)&&!btn.closest('.studio-modal'))btn.addEventListener('click',()=>notify(`${btn.textContent.trim()} is not connected yet`))});
icons();