const pages=[...document.querySelectorAll('.page')];
const navItems=[...document.querySelectorAll('.nav-item[data-page]')];
const pageTitle=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const names={home:'Home',ai:'AI chat',projects:'Projects',chat:'Team chat',build:'Build',code:'Code',agents:'Agents',labs:'Labs',files:'Files',automations:'Automations',settings:'Settings'};

function icons(){if(window.lucide)window.lucide.createIcons()}
function notify(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),1700)}
function openPage(name,push=true){if(!names[name])name='home';pages.forEach(p=>p.classList.toggle('active',p.id===`page-${name}`));navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===name));if(pageTitle)pageTitle.textContent=names[name];if(push)history.replaceState(null,'',name==='home'?location.pathname:`#${name}`);window.scrollTo({top:0,behavior:'smooth'});icons()}
navItems.forEach(n=>n.addEventListener('click',()=>openPage(n.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(el=>el.addEventListener('click',()=>openPage(el.dataset.pageLink)));
const first=location.hash.slice(1);if(names[first])openPage(first,false);
window.addEventListener('hashchange',()=>{const name=location.hash.slice(1)||'home';openPage(name,false)});

// Date label.
const todayLabel=document.getElementById('todayLabel');
if(todayLabel){const d=new Date();todayLabel.textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'}).toUpperCase()}

// Command palette.
const modal=document.getElementById('commandModal');
const commandInput=document.getElementById('commandInput');
function openCommand(){modal?.classList.add('open');modal?.setAttribute('aria-hidden','false');setTimeout(()=>commandInput?.focus(),50)}
function closeCommand(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');if(commandInput)commandInput.value='';filterCommands('')}
function filterCommands(q){document.querySelectorAll('.command-group button').forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q.toLowerCase())?'grid':'none')}
document.getElementById('commandButton')?.addEventListener('click',openCommand);
modal?.addEventListener('click',e=>{if(e.target===modal)closeCommand()});
commandInput?.addEventListener('input',e=>filterCommands(e.target.value));
document.querySelectorAll('[data-command-page]').forEach(b=>b.addEventListener('click',()=>{openPage(b.dataset.commandPage);closeCommand()}));
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape')closeCommand()});

// Home AI composer.
const homePrompt=document.getElementById('homePrompt');
const homeMode=document.getElementById('homeMode');
function submitHome(){const text=homePrompt?.value.trim();if(!text){notify('Type something first');return}const mode=homeMode?.value||'Normal chat';if(mode==='Build mode'){openPage('build');const field=document.getElementById('buildInput');if(field)field.value=text;appendBuild(text)}else{openPage('ai');const select=document.getElementById('chatMode');if(select)select.value=mode;appendMessage(text,'user');fakeReply(mode)}if(homePrompt)homePrompt.value=''}
document.getElementById('homeSend')?.addEventListener('click',submitHome);
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitHome()}});
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>{if(homePrompt){homePrompt.value=b.dataset.prompt;homePrompt.focus()}}));

// Chat prototype.
const messages=document.getElementById('messages');
const chatInput=document.getElementById('chatInput');
function clearEmpty(){messages?.querySelector('.empty-state')?.remove()}
function appendMessage(text,role='user'){if(!messages)return;clearEmpty();const row=document.createElement('div');row.className=`message ${role==='assistant'?'assistant':''}`;row.innerHTML=`<div class="message-avatar">${role==='assistant'?'<i data-lucide="sparkles"></i>':'R'}</div><div><strong>${role==='assistant'?'Syvora':'You'}</strong><p></p></div>`;row.querySelector('p').textContent=text;messages.appendChild(row);messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});icons()}
function fakeReply(mode=document.getElementById('chatMode')?.value){setTimeout(()=>appendMessage(mode==='Workspace chat'?'I can work with your projects, files, code and conversations from here. The connected actions will come in the functionality phase.':'Got it. This is the normal Syvora chat experience — the real AI backend comes after the design is locked in.','assistant'),420)}
function sendChat(){const text=chatInput?.value.trim();if(!text)return;appendMessage(text);chatInput.value='';fakeReply()}
document.getElementById('chatSend')?.addEventListener('click',sendChat);
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}});
document.querySelectorAll('.starter-grid button').forEach(b=>b.addEventListener('click',()=>{if(chatInput){chatInput.value=b.textContent;chatInput.focus()}}));
document.getElementById('newChat')?.addEventListener('click',()=>{if(!messages)return;messages.innerHTML='<div class="empty-state"><div class="large-mark"><span class="large-core"></span><i class="ray-a"></i><i class="ray-b"></i><i class="ray-c"></i><i class="ray-d"></i><b class="node-a"></b><b class="node-b"></b><b class="node-c"></b><b class="node-d"></b></div><h2>How can I help?</h2><p>Chat normally, work with your files and projects, or ask Syvora to build something.</p><div class="starter-grid"><button>Help me plan a project</button><button>Explain something complex</button><button>Build a landing page</button><button>Review my code</button></div></div>';document.querySelectorAll('.starter-grid button').forEach(b=>b.addEventListener('click',()=>{if(chatInput){chatInput.value=b.textContent;chatInput.focus()}}));notify('New chat started')});

// Build prototype.
const buildInput=document.getElementById('buildInput');
const buildLog=document.getElementById('buildLog');
function appendBuild(text){if(!buildLog)return;buildLog.querySelector('.build-welcome')?.remove();const user=document.createElement('div');user.style.cssText='margin:10px 0 10px auto;max-width:88%;padding:9px 10px;border-radius:9px 9px 3px 9px;background:#202423;color:white;font-size:9px;line-height:1.5';user.textContent=text;buildLog.appendChild(user);if(buildInput)buildInput.value='';setTimeout(()=>{const ai=document.createElement('div');ai.style.cssText='margin:10px 0;max-width:90%;padding:9px 10px;border:1px solid #e2e2de;border-radius:3px 9px 9px 9px;background:#fafaf9;font-size:9px;line-height:1.55;color:#626864';ai.innerHTML='<b style="color:#252927">Syvora</b><br>I updated the preview. Tell me what you want to change next.';buildLog.appendChild(ai);buildLog.scrollTop=buildLog.scrollHeight},350)}
function sendBuild(){const text=buildInput?.value.trim();if(text)appendBuild(text)}
document.getElementById('buildSend')?.addEventListener('click',sendBuild);
buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendBuild()}});
document.querySelectorAll('.build-chips button').forEach(b=>b.addEventListener('click',()=>{if(buildInput){buildInput.value=`Build me a ${b.textContent.toLowerCase()}`;buildInput.focus()}}));

// Project prototype.
document.getElementById('newProjectBtn')?.addEventListener('click',()=>notify('New project flow comes in the functionality phase'));
document.querySelector('.new-project-tile')?.addEventListener('click',()=>notify('New project flow comes in the functionality phase'));

// Task checks.
document.querySelectorAll('.task-stack input').forEach(input=>input.addEventListener('change',()=>{const row=input.closest('label');if(row)row.style.opacity=input.checked?'.45':'1'}));

// Toggles.
document.querySelectorAll('.toggle').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));

// Stage tabs / simple prototype states.
document.querySelectorAll('.stage-tabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.stage-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');notify(`${btn.textContent.trim()} view selected`)}));
document.querySelectorAll('.publish-button').forEach(b=>b.addEventListener('click',()=>notify('Publish will connect in the functionality phase')));
document.querySelectorAll('.commit-button').forEach(b=>b.addEventListener('click',()=>notify('GitHub commit action will connect in the functionality phase')));

// Small UI affordances.
document.getElementById('newMenuButton')?.addEventListener('click',()=>notify('Create menu coming next'));
document.querySelectorAll('.lab-card>button').forEach(b=>b.addEventListener('click',()=>notify('Labs are design prototypes for now')));
document.querySelectorAll('.automation-create').forEach(b=>b.addEventListener('click',()=>notify('Automation builder comes in the functionality phase')));

icons();