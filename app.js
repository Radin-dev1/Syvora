const pages=[...document.querySelectorAll('.page')];
const navItems=[...document.querySelectorAll('.nav-item[data-page]')];
const pageTitle=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const names={home:'Home',ai:'AI Chat',chat:'Team Chat',projects:'Projects',studios:'Studios',build:'App Builder',code:'Code Studio',agents:'Agents',files:'Files',automations:'Automations'};

function icons(){if(window.lucide)window.lucide.createIcons()}
function notify(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),1700)}
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
function submitHome(){const text=homePrompt?.value.trim();if(!text){notify('Type something first');return}const mode=homeMode?.value||'Normal chat';if(mode==='Create mode'){openPage('studios');notify('Choose a Studio to create with AI')}else{openPage('ai');const chatMode=document.getElementById('chatMode');if(chatMode)chatMode.value=mode;appendMessage(text,'user');fakeReply(mode)}if(homePrompt)homePrompt.value=''}
document.getElementById('homeSend')?.addEventListener('click',submitHome);
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitHome()}});

const messages=document.getElementById('messages');
const chatInput=document.getElementById('chatInput');
function clearEmpty(){messages?.querySelector('.empty-chat')?.remove()}
function appendMessage(text,role='user'){if(!messages)return;clearEmpty();const row=document.createElement('div');row.className=`message ${role==='assistant'?'assistant':''}`;row.style.cssText='max-width:780px;width:100%;margin:8px auto;display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:flex-start';const avatar=document.createElement('div');avatar.style.cssText=`width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-weight:700;font-size:9px;${role==='assistant'?'background:#eaf5fd;color:#168eea':'background:#151a20;color:white'}`;avatar.innerHTML=role==='assistant'?'<i data-lucide="sparkles"></i>':'R';const bubble=document.createElement('div');bubble.style.cssText='font-size:10px;line-height:1.65;color:#4f5964;padding-top:2px';bubble.innerHTML=`<strong style="display:block;color:#1f252c;margin-bottom:3px">${role==='assistant'?'Syvora':'You'}</strong><p style="margin:0"></p>`;bubble.querySelector('p').textContent=text;row.append(avatar,bubble);messages.appendChild(row);messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});icons()}
function fakeReply(mode=document.getElementById('chatMode')?.value){setTimeout(()=>appendMessage(mode==='Workspace chat'?'I can use your project, GitHub repository, files, agents, and team context from this workspace. The real backend connection comes next.':mode==='Deep research'?'Deep Research mode is ready in the interface. Once the backend is connected, I can search, compare sources, and build a cited report here.':'Got it. The full AI Chat workspace is ready — normal chat, tools, context, files, web, code, and creative actions are all represented.','assistant'),360)}
function sendChat(){const text=chatInput?.value.trim();if(!text)return;appendMessage(text,'user');chatInput.value='';fakeReply()}
document.getElementById('chatSend')?.addEventListener('click',sendChat);
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}});
document.getElementById('newChat')?.addEventListener('click',()=>{if(messages)messages.innerHTML='<div class="empty-chat"><img src="assets/syvora-logo.svg" alt="Syvora" /><h2>What do you want to work on?</h2><p>Ask anything, research the web, analyze files, write code, generate creative work, or use your workspace context.</p><div class="starter-grid"><button><i data-lucide="telescope"></i><span><strong>Research a topic</strong><small>Search and compare sources</small></span></button><button><i data-lucide="code-2"></i><span><strong>Write or debug code</strong><small>Use repo context</small></span></button><button data-open-studio="Image Studio"><i data-lucide="image"></i><span><strong>Create an image</strong><small>Open Image Studio</small></span></button><button><i data-lucide="file-text"></i><span><strong>Analyze files</strong><small>Upload or choose from Files</small></span></button></div>';bindStudioOpeners();icons();notify('New chat started')});
document.querySelectorAll('.toggle').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));

const teamTextarea=document.querySelector('.team-composer textarea');
const teamFeed=document.querySelector('.message-feed');
function sendTeam(){const text=teamTextarea?.value.trim();if(!text)return;const article=document.createElement('article');article.className='team-message';article.innerHTML='<span class="member-avatar blue">R</span><div><div class="message-meta"><strong>Radin</strong><span>Now</span></div><p></p><div class="reactions"><button>🙂 1</button><button><i data-lucide="smile-plus"></i></button></div></div>';article.querySelector('p').textContent=text;teamFeed?.appendChild(article);teamTextarea.value='';teamFeed?.scrollTo({top:teamFeed.scrollHeight,behavior:'smooth'});icons()}
document.querySelector('.send-team')?.addEventListener('click',sendTeam);
teamTextarea?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendTeam()}});
document.querySelectorAll('.team-tabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.team-tabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');notify(`${btn.textContent.trim()} opened`)}));
document.querySelectorAll('.channel,.dm').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.channel,.dm').forEach(b=>b.classList.remove('active'));btn.classList.add('active');notify(`Opened ${btn.textContent.trim()}`)}));

const studioModal=document.getElementById('studioModal');
const studioTitle=document.getElementById('studioWorkspaceTitle');
const studioSubtitle=document.getElementById('studioWorkspaceSubtitle');
const studioCanvasTitle=document.getElementById('studioCanvasTitle');
const studioCanvasText=document.getElementById('studioCanvasText');
const studioPrompt=document.getElementById('studioPrompt');
const studioProfiles={
  'Image Studio':['Generate, edit and enhance images','Create your first image','Describe an image, upload a reference, or use editing tools.'],
  'Video Studio':['Generate and edit videos','Create your first video','Start from text, an image, or a clip, then edit it on the timeline.'],
  'UI Designer':['Design websites and apps','Design a new interface','Describe the product and Syvora will create an editable UI canvas.'],
  '3D Designer':['Create 3D objects and scenes','Create a 3D scene','Describe an object or scene, then adjust materials, lighting and cameras.'],
  'Website Builder':['Build and publish websites','Build a website','Describe the site you want and edit the responsive preview visually or in code.'],
  'App Builder':['Create full applications','Build an app','Describe your app, screens and functionality to create a working prototype.'],
  'Code Studio':['Write, debug and ship code','Start coding','Open a repository or describe what you want to build.'],
  'Brand Studio':['Create complete brand systems','Build a brand','Generate logos, colors, typography, brand rules and exportable assets.'],
  'Audio Studio':['Voice, sound and audio tools','Create audio','Generate narration, voices, sound effects, music ideas or clean up audio.'],
  'Presentation Studio':['Create polished slide decks','Create a presentation','Describe your topic and Syvora will structure, write and design the slides.'],
  'Document Studio':['Create reports and documents','Create a document','Generate reports, PDFs, briefs, notes, proposals and summaries.'],
  'Game Studio':['Design games and game assets','Create a game concept','Build maps, UI, scripts, concepts and Roblox-ready creative assets.'],
  'Agent Studio':['Build custom AI workers','Create an agent','Give your agent a role, instructions, tools, memory and permissions.'],
  'Automation Studio':['Create AI workflows','Build an automation','Choose a trigger and let Syvora connect actions, agents and apps.']
};
function openStudio(name){const profile=studioProfiles[name]||['Create with Syvora','Start creating','Describe what you want to make.'];if(studioTitle)studioTitle.textContent=name;if(studioSubtitle)studioSubtitle.textContent=profile[0];if(studioCanvasTitle)studioCanvasTitle.textContent=profile[1];if(studioCanvasText)studioCanvasText.textContent=profile[2];if(studioPrompt){studioPrompt.value='';studioPrompt.placeholder=`Describe what you want to make in ${name}...`;}studioModal?.classList.add('open');studioModal?.setAttribute('aria-hidden','false');icons()}
function closeStudio(){studioModal?.classList.remove('open');studioModal?.setAttribute('aria-hidden','true')}
function bindStudioOpeners(){document.querySelectorAll('[data-open-studio]').forEach(el=>{if(el.dataset.bound)return;el.dataset.bound='1';el.addEventListener('click',e=>{e.stopPropagation();openStudio(el.dataset.openStudio)})})}
bindStudioOpeners();
document.getElementById('closeStudio')?.addEventListener('click',closeStudio);
document.getElementById('studioGenerate')?.addEventListener('click',()=>{const name=studioTitle?.textContent||'Studio';const text=studioPrompt?.value.trim();if(!text){notify('Describe what you want to create first');return}if(studioCanvasTitle)studioCanvasTitle.textContent='Generating concept…';if(studioCanvasText)studioCanvasText.textContent=`${name} is preparing: “${text}”`;notify(`${name} generation started`);setTimeout(()=>{if(studioCanvasTitle)studioCanvasTitle.textContent='Concept ready';if(studioCanvasText)studioCanvasText.textContent='This is the design-phase prototype. Real generation will connect in the functionality phase.'},700)});
document.querySelectorAll('.studio-tools button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.studio-tools button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');notify(`${btn.textContent.trim()} tool selected`)}));

document.querySelectorAll('.primary-button').forEach(btn=>{if(!btn.dataset.pageLink)btn.addEventListener('click',()=>notify(`${btn.textContent.trim()} will connect in the functionality phase`))});
document.querySelectorAll('.studio-filter button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.studio-filter button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));
document.querySelectorAll('.task-row input').forEach(input=>input.addEventListener('change',()=>{input.closest('.task-row').style.opacity=input.checked?'.45':'1'}));
icons();