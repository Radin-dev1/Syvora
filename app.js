const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-item[data-page]');
const title = document.getElementById('pageTitle');
const toast = document.getElementById('toast');
const pageNames = {home:'Home',ai:'AI',projects:'Projects',chat:'Chat',build:'Build',code:'Code',agents:'Agents',labs:'Labs',files:'Files',automations:'Automations',settings:'Settings'};

function refreshIcons(){ if(window.lucide) lucide.createIcons(); }
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),1800)}
function goToPage(page){pages.forEach(p=>p.classList.remove('active'));document.getElementById(`page-${page}`)?.classList.add('active');navItems.forEach(item=>item.classList.toggle('active',item.dataset.page===page));title.textContent=pageNames[page]||page;window.location.hash=page==='home'?'':page;window.scrollTo({top:0,behavior:'smooth'});refreshIcons()}
navItems.forEach(item=>item.addEventListener('click',()=>goToPage(item.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(button=>button.addEventListener('click',()=>{goToPage(button.dataset.pageLink);closeCommand()}));
const initialPage=window.location.hash.replace('#','');if(pageNames[initialPage])goToPage(initialPage);

// Syvora is intentionally light-first for the design phase.
document.body.classList.add('light');localStorage.setItem('syvora-theme','light');
const settingsTheme=document.getElementById('settingsTheme');if(settingsTheme)settingsTheme.value='Light';

const commandModal=document.getElementById('commandModal');const commandButton=document.getElementById('commandButton');const commandInput=document.getElementById('commandInput');
function openCommand(){commandModal.classList.add('open');commandModal.setAttribute('aria-hidden','false');setTimeout(()=>commandInput.focus(),50)}
function closeCommand(){commandModal.classList.remove('open');commandModal.setAttribute('aria-hidden','true');commandInput.value='';filterCommands('')}
function filterCommands(query){document.querySelectorAll('.command-options button').forEach(button=>button.style.display=button.textContent.toLowerCase().includes(query.toLowerCase())?'grid':'none')}
commandButton?.addEventListener('click',openCommand);commandModal?.addEventListener('click',e=>{if(e.target===commandModal)closeCommand()});commandInput?.addEventListener('input',e=>filterCommands(e.target.value));document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape')closeCommand()});

const homePrompt=document.getElementById('homePrompt');const homeMode=document.getElementById('homeMode');
document.getElementById('homeSend')?.addEventListener('click',()=>{const text=homePrompt.value.trim();if(!text){showToast('Type something first');return}if(homeMode.value==='Build Mode'){goToPage('build');document.getElementById('buildInput').value=text;addBuildMessage(text)}else{goToPage('ai');document.getElementById('chatMode').value=homeMode.value;clearEmptyChat();addChatMessage(text,'user');fakeAIReply(text)}homePrompt.value=''});
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))document.getElementById('homeSend').click()});

const messages=document.getElementById('messages');const chatInput=document.getElementById('chatInput');
function clearEmptyChat(){messages?.querySelector('.empty-chat')?.remove()}
function addChatMessage(text,role='user'){clearEmptyChat();const node=document.createElement('div');node.className=`message ${role==='assistant'?'assistant':''}`;node.innerHTML=`<div class="message-avatar ${role==='assistant'?'sy-avatar':''}">${role==='assistant'?'<i data-lucide="sparkles"></i>':'R'}</div><div><strong>${role==='assistant'?'Syvora':'You'}</strong><p></p></div>`;node.querySelector('p').textContent=text;messages.appendChild(node);messages.scrollTop=messages.scrollHeight;refreshIcons()}
function fakeAIReply(){const mode=document.getElementById('chatMode').value;const reply=mode==='Workspace Chat'?'I can help with that using your Syvora workspace. During this design-first phase, the connected actions are still prototype interactions.':'Got it. Syvora is currently in its design-first V1, so this chat is a polished prototype until we connect the real AI backend.';setTimeout(()=>addChatMessage(reply,'assistant'),350)}
document.getElementById('chatSend')?.addEventListener('click',()=>{const text=chatInput.value.trim();if(!text)return;addChatMessage(text);chatInput.value='';fakeAIReply(text)});chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('chatSend').click()}});
document.getElementById('newChat')?.addEventListener('click',()=>{messages.innerHTML='<div class="empty-chat"><div class="syvora-logo chat-logo"><span class="hub"></span><span class="ray r1"></span><span class="ray r2"></span><span class="ray r3"></span><span class="ray r4"></span><span class="node n1"></span><span class="node n2"></span><span class="node n3"></span><span class="node n4"></span></div><h2>What can I help with?</h2><p>Ask anything, upload files, write code, brainstorm, research, or connect the conversation to your workspace.</p></div>';showToast('New chat created')});

document.querySelectorAll('.prompt-grid button').forEach(button=>button.addEventListener('click',()=>{chatInput.value=button.textContent;chatInput.focus()}));
const buildInput=document.getElementById('buildInput');const buildLog=document.getElementById('buildLog');
function addBuildMessage(text){const item=document.createElement('div');item.style.cssText='margin:10px 0;padding:10px 11px;border:1px solid var(--line);border-radius:11px;background:#f8fafc;font-size:10.5px;line-height:1.5';item.textContent=text;buildLog.appendChild(item);buildInput.value='';setTimeout(()=>{const response=document.createElement('div');response.style.cssText='margin:10px 0;color:var(--muted);font-size:10.5px;line-height:1.6';response.innerHTML='<strong style="color:var(--text)">Syvora</strong><br>I created a first-pass layout in the preview. Tell me what you want changed next.';buildLog.appendChild(response)},300)}
document.getElementById('buildSend')?.addEventListener('click',()=>{const t=buildInput.value.trim();if(t)addBuildMessage(t)});buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('buildSend').click()}});document.querySelectorAll('.suggestion-chips button').forEach(button=>button.addEventListener('click',()=>{buildInput.value=`Build me a ${button.textContent.toLowerCase()}`;buildInput.focus()}));

let projectCount=0;document.getElementById('newProjectBtn')?.addEventListener('click',()=>{projectCount++;const card=document.createElement('article');card.className='project-card';card.innerHTML=`<div class="project-card-top"><span class="project-icon sy">N${projectCount}</span><span class="new-pill">New</span></div><h3>New Project ${projectCount}</h3><p>A fresh Syvora project ready for tasks, chat, code, files, and AI.</p><div class="card-meta"><span>0 tasks</span><span>1 member</span><b>0%</b></div><div class="progress"><i style="width:0%"></i></div>`;document.getElementById('projectCards').appendChild(card);showToast('New project created')});
document.querySelectorAll('.toggle').forEach(toggle=>toggle.addEventListener('click',()=>toggle.classList.toggle('on')));document.querySelectorAll('input[type="checkbox"]').forEach(box=>box.addEventListener('change',()=>{box.closest('.task-row').style.opacity=box.checked?'.45':'1'}));document.querySelectorAll('.builder-header .primary-button').forEach(b=>b.addEventListener('click',()=>showToast('Publish flow comes in the functionality phase')));document.querySelectorAll('.git-panel .primary-button').forEach(b=>b.addEventListener('click',()=>showToast('GitHub actions come in the functionality phase')));
refreshIcons();