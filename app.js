// Force GitHub Pages and browsers to load the latest stylesheet instead of a stale cached copy.
const syvoraStyle=document.createElement('link');
syvoraStyle.rel='stylesheet';
syvoraStyle.href='./styles.css?v=20260828-0438';
document.head.appendChild(syvoraStyle);

const pages=[...document.querySelectorAll('.page')];
const navItems=[...document.querySelectorAll('.nav-item[data-page]')];
const pageTitle=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const names={home:'Home',ai:'AI Chat',projects:'Projects',chat:'Team chat',build:'Build',code:'Code',agents:'Agents',labs:'Labs',files:'Files',automations:'Automations',settings:'Settings'};

function icons(){if(window.lucide)window.lucide.createIcons()}
function notify(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),1600)}
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
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape')closeCommand()});
commandInput?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.command-list button').forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?'flex':'none')});
document.querySelectorAll('[data-command-page]').forEach(b=>b.addEventListener('click',()=>{openPage(b.dataset.commandPage);closeCommand()}));

const homePrompt=document.getElementById('homePrompt');
const homeMode=document.getElementById('homeMode');
function submitHome(){const text=homePrompt?.value.trim();if(!text){notify('Type something first');return}const mode=homeMode?.value||'Normal chat';if(mode==='Build mode'){openPage('build');const input=document.getElementById('buildInput');if(input)input.value=text;appendBuild(text)}else{openPage('ai');const modeSelect=document.getElementById('chatMode');if(modeSelect)modeSelect.value=mode;appendMessage(text,'user');fakeReply(mode)}if(homePrompt)homePrompt.value=''}
document.getElementById('homeSend')?.addEventListener('click',submitHome);
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitHome()}});
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>{if(homePrompt){homePrompt.value=b.dataset.prompt;homePrompt.focus()}}));

const messages=document.getElementById('messages');
const chatInput=document.getElementById('chatInput');
function clearEmpty(){messages?.querySelector('.empty-chat')?.remove()}
function appendMessage(text,role='user'){if(!messages)return;clearEmpty();const row=document.createElement('div');row.className=`message ${role==='assistant'?'assistant':''}`;row.innerHTML=`<div class="message-avatar">${role==='assistant'?'<i data-lucide="sparkles"></i>':'R'}</div><div><strong>${role==='assistant'?'Syvora':'You'}</strong><p></p></div>`;row.querySelector('p').textContent=text;messages.appendChild(row);messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});icons()}
function fakeReply(mode=document.getElementById('chatMode')?.value){setTimeout(()=>appendMessage(mode==='Workspace chat'?'I can use your projects, files, code, and conversations here once the backend is connected.':'Got it. This is the normal Syvora chat experience — the real model connection comes after the design is locked in.','assistant'),350)}
function sendChat(){const text=chatInput?.value.trim();if(!text)return;appendMessage(text);chatInput.value='';fakeReply()}
document.getElementById('chatSend')?.addEventListener('click',sendChat);
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}});
document.querySelectorAll('.starter-grid button').forEach(b=>b.addEventListener('click',()=>{if(chatInput){chatInput.value=b.textContent;chatInput.focus()}}));
document.getElementById('newChat')?.addEventListener('click',()=>{if(!messages)return;messages.innerHTML='<div class="empty-chat"><img src="assets/syvora-logo.svg" alt="Syvora"><h2>What can I help with?</h2><p>Ask a question, brainstorm, upload files, write code, or connect this chat to your workspace.</p><div class="starter-grid"><button>Plan a product</button><button>Help me write code</button><button>Research competitors</button><button>Summarize a document</button></div></div>';document.querySelectorAll('.starter-grid button').forEach(b=>b.addEventListener('click',()=>{if(chatInput){chatInput.value=b.textContent;chatInput.focus()}}));notify('New chat started')});

const buildInput=document.getElementById('buildInput');
const buildLog=document.getElementById('buildLog');
function appendBuild(text){if(!buildLog)return;const user=document.createElement('div');user.style.cssText='margin:10px 0 10px auto;max-width:88%;padding:9px 10px;border-radius:11px 11px 3px 11px;background:#151a20;color:#fff;font-size:9.5px;line-height:1.55';user.textContent=text;buildLog.appendChild(user);if(buildInput)buildInput.value='';setTimeout(()=>{const ai=document.createElement('div');ai.style.cssText='margin:10px 0;max-width:90%;padding:9px 10px;border:1px solid #e6e9ee;border-radius:3px 11px 11px 11px;background:#f8fafc;font-size:9.5px;line-height:1.6;color:#616974';ai.innerHTML='<b style="color:#20242a">Syvora</b><br>I updated the preview. Tell me what you want changed next.';buildLog.appendChild(ai);buildLog.scrollTop=buildLog.scrollHeight},300)}
function sendBuild(){const text=buildInput?.value.trim();if(text)appendBuild(text)}
document.getElementById('buildSend')?.addEventListener('click',sendBuild);
buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendBuild()}});
document.querySelectorAll('.build-chips button').forEach(b=>b.addEventListener('click',()=>{if(buildInput){buildInput.value=`Build me a ${b.textContent.toLowerCase()}`;buildInput.focus()}}));

document.getElementById('newProjectBtn')?.addEventListener('click',()=>notify('Project creation comes in the functionality phase'));
document.querySelectorAll('.task input').forEach(input=>input.addEventListener('change',()=>{const row=input.closest('.task');if(row)row.style.opacity=input.checked?'.5':'1'}));
document.querySelectorAll('.toggle').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));
document.querySelectorAll('.view-tabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.view-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}));
document.querySelectorAll('.labs-grid article button').forEach(b=>b.addEventListener('click',()=>notify('Labs are visual prototypes for now')));
document.querySelectorAll('.primary-button').forEach(b=>{if(!b.dataset.pageLink&&!['newChat','newProjectBtn'].includes(b.id))b.addEventListener('click',()=>{if(b.closest('#page-build'))notify('Publish comes in the functionality phase');if(b.closest('#page-code'))notify('Commit action comes in the functionality phase')})});

icons();