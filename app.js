const premiumStyles=document.createElement('link');premiumStyles.rel='stylesheet';premiumStyles.href='premium.css';document.head.appendChild(premiumStyles);

const pages=document.querySelectorAll('.page');
const navItems=document.querySelectorAll('.nav-item[data-page]');
const title=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const pageNames={home:'Home',ai:'AI',projects:'Projects',chat:'Chat',build:'Build',code:'Code',agents:'Agents',labs:'Labs',files:'Files',automations:'Automations',settings:'Settings'};

function refreshIcons(){if(window.lucide)lucide.createIcons()}
function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),1800)}
function goToPage(page){pages.forEach(p=>p.classList.remove('active'));document.getElementById(`page-${page}`)?.classList.add('active');navItems.forEach(item=>item.classList.toggle('active',item.dataset.page===page));if(title)title.textContent=pageNames[page]||page;window.location.hash=page==='home'?'':page;window.scrollTo({top:0,behavior:'smooth'});refreshIcons()}
navItems.forEach(item=>item.addEventListener('click',()=>goToPage(item.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(button=>button.addEventListener('click',()=>{goToPage(button.dataset.pageLink);closeCommand()}));
const initialPage=window.location.hash.replace('#','');if(pageNames[initialPage])goToPage(initialPage);

// Light mode is the Syvora visual direction for V1.
document.body.classList.add('light');localStorage.setItem('syvora-theme','light');
const settingsTheme=document.getElementById('settingsTheme');if(settingsTheme)settingsTheme.value='Light';

// Command palette.
const commandModal=document.getElementById('commandModal');
const commandButton=document.getElementById('commandButton');
const commandInput=document.getElementById('commandInput');
function openCommand(){if(!commandModal)return;commandModal.classList.add('open');commandModal.setAttribute('aria-hidden','false');setTimeout(()=>commandInput?.focus(),50)}
function closeCommand(){if(!commandModal)return;commandModal.classList.remove('open');commandModal.setAttribute('aria-hidden','true');if(commandInput){commandInput.value='';filterCommands('')}}
function filterCommands(query){document.querySelectorAll('.command-options button').forEach(button=>button.style.display=button.textContent.toLowerCase().includes(query.toLowerCase())?'grid':'none')}
commandButton?.addEventListener('click',openCommand);
commandModal?.addEventListener('click',e=>{if(e.target===commandModal)closeCommand()});
commandInput?.addEventListener('input',e=>filterCommands(e.target.value));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape')closeCommand()});

// AI home composer.
const homePrompt=document.getElementById('homePrompt');
const homeMode=document.getElementById('homeMode');
document.getElementById('homeSend')?.addEventListener('click',()=>{const text=homePrompt.value.trim();if(!text){showToast('Type something first');return}if(homeMode?.value==='Build Mode'){goToPage('build');const buildInput=document.getElementById('buildInput');if(buildInput)buildInput.value=text;addBuildMessage(text)}else{goToPage('ai');const mode=document.getElementById('chatMode');if(mode&&homeMode)mode.value=homeMode.value;clearEmptyChat();addChatMessage(text,'user');fakeAIReply()}homePrompt.value=''});
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))document.getElementById('homeSend')?.click()});

// Normal + workspace chat prototype.
const messages=document.getElementById('messages');
const chatInput=document.getElementById('chatInput');
function clearEmptyChat(){messages?.querySelector('.empty-chat')?.remove()}
function addChatMessage(text,role='user'){if(!messages)return;clearEmptyChat();const node=document.createElement('div');node.className=`message ${role==='assistant'?'assistant':''}`;node.innerHTML=`<div class="message-avatar ${role==='assistant'?'sy-avatar':''}">${role==='assistant'?'<i data-lucide="sparkles"></i>':'R'}</div><div><strong>${role==='assistant'?'Syvora':'You'}</strong><p></p></div>`;node.querySelector('p').textContent=text;messages.appendChild(node);messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});refreshIcons()}
function fakeAIReply(){const mode=document.getElementById('chatMode')?.value;const reply=mode==='Workspace Chat'?'I can help with that using your Syvora workspace. The design is ready for real connected actions in the functionality phase.':'Got it. Syvora is in its design-first V1 right now, so this chat is a polished prototype until the real AI backend is connected.';setTimeout(()=>addChatMessage(reply,'assistant'),420)}
document.getElementById('chatSend')?.addEventListener('click',()=>{const text=chatInput?.value.trim();if(!text)return;addChatMessage(text);chatInput.value='';fakeAIReply()});
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('chatSend')?.click()}});
document.getElementById('newChat')?.addEventListener('click',()=>{if(!messages)return;messages.innerHTML='<div class="empty-chat"><div class="syvora-logo chat-logo"><span class="hub"></span><span class="ray r1"></span><span class="ray r2"></span><span class="ray r3"></span><span class="ray r4"></span><span class="node n1"></span><span class="node n2"></span><span class="node n3"></span><span class="node n4"></span></div><h2>What can I help with?</h2><p>Ask anything, upload files, write code, brainstorm, research, or connect the conversation to your workspace.</p></div>';showToast('New chat created')});
document.querySelectorAll('.prompt-grid button').forEach(button=>button.addEventListener('click',()=>{if(chatInput){chatInput.value=button.textContent;chatInput.focus()}}));

// Build prototype.
const buildInput=document.getElementById('buildInput');
const buildLog=document.getElementById('buildLog');
function addBuildMessage(text){if(!buildLog)return;const item=document.createElement('div');item.className='build-user-message';item.style.cssText='margin:10px 0;padding:11px 12px;border:1px solid var(--line);border-radius:12px;background:#f8fafc;font-size:10.5px;line-height:1.55;animation:messageIn .25s var(--ease) both';item.textContent=text;buildLog.appendChild(item);if(buildInput)buildInput.value='';setTimeout(()=>{const response=document.createElement('div');response.style.cssText='margin:10px 0;color:var(--muted);font-size:10.5px;line-height:1.65;animation:messageIn .25s var(--ease) both';response.innerHTML='<strong style="color:var(--text)">Syvora</strong><br>I created a first-pass layout in the preview. Tell me what you want changed next.';buildLog.appendChild(response);buildLog.scrollTop=buildLog.scrollHeight},350)}
document.getElementById('buildSend')?.addEventListener('click',()=>{const t=buildInput?.value.trim();if(t)addBuildMessage(t)});
buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('buildSend')?.click()}});
document.querySelectorAll('.suggestion-chips button').forEach(button=>button.addEventListener('click',()=>{if(buildInput){buildInput.value=`Build me a ${button.textContent.toLowerCase()}`;buildInput.focus()}}));

// Demo project creation.
let projectCount=0;
document.getElementById('newProjectBtn')?.addEventListener('click',()=>{projectCount++;const card=document.createElement('article');card.className='project-card';card.innerHTML=`<div class="project-card-top"><span class="project-icon sy">N${projectCount}</span><span class="new-pill">New</span></div><h3>New Project ${projectCount}</h3><p>A fresh Syvora project ready for tasks, chat, code, files, and AI.</p><div class="card-meta"><span>0 tasks</span><span>1 member</span><b>0%</b></div><div class="progress"><i style="width:0%"></i></div>`;document.getElementById('projectCards')?.appendChild(card);showToast('New project created')});

// Small interactions.
document.querySelectorAll('.toggle').forEach(toggle=>toggle.addEventListener('click',()=>toggle.classList.toggle('on')));
document.querySelectorAll('input[type="checkbox"]').forEach(box=>box.addEventListener('change',()=>{const row=box.closest('.task-row');if(row)row.style.opacity=box.checked?'.45':'1'}));
document.querySelectorAll('.builder-header .primary-button').forEach(b=>b.addEventListener('click',()=>showToast('Publish flow comes in the functionality phase')));
document.querySelectorAll('.git-panel .primary-button').forEach(b=>b.addEventListener('click',()=>showToast('GitHub actions come in the functionality phase')));

// Premium motion: soft cursor glow and responsive orbit movement.
const glow=document.createElement('div');glow.className='cursor-glow';document.body.appendChild(glow);
let glowFrame;
document.addEventListener('pointermove',e=>{if(window.innerWidth<900)return;glow.classList.add('visible');cancelAnimationFrame(glowFrame);glowFrame=requestAnimationFrame(()=>{glow.style.left=`${e.clientX}px`;glow.style.top=`${e.clientY}px`});const hero=document.querySelector('.hero-orbit');if(hero){const rect=hero.getBoundingClientRect();const x=(e.clientX-(rect.left+rect.width/2))/rect.width;const y=(e.clientY-(rect.top+rect.height/2))/rect.height;hero.style.transform=`translate(${x*8}px,${y*8}px)`}});
document.addEventListener('pointerleave',()=>glow.classList.remove('visible'));

// Elevated-card tilt.
document.querySelectorAll('.project-card,.agent-card,.lab-grid article,.quick-grid>button').forEach(card=>{card.addEventListener('pointermove',e=>{if(window.innerWidth<900)return;const r=card.getBoundingClientRect();const rx=((e.clientY-r.top)/r.height-.5)*-1.7;const ry=((e.clientX-r.left)/r.width-.5)*1.7;card.style.transform=`translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

// Reveal cards when they enter the viewport.
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target)}}),{threshold:.15});
document.querySelectorAll('.panel,.project-card,.agent-card,.lab-grid article,.task-card').forEach(el=>revealObserver.observe(el));

// Premium click ripple on important controls without changing logo artwork.
document.querySelectorAll('.primary-button,.ghost-button,.quick-grid>button,.nav-item,.command-button,.prompt-grid button,.suggestion-chips button').forEach(button=>{button.style.position=button.style.position||'relative';button.style.overflow='hidden';button.addEventListener('pointerdown',e=>{const r=button.getBoundingClientRect();const dot=document.createElement('span');dot.className='premium-ripple';dot.style.left=`${e.clientX-r.left}px`;dot.style.top=`${e.clientY-r.top}px`;dot.style.width=dot.style.height='34px';button.appendChild(dot);setTimeout(()=>dot.remove(),680)})});

// Add a subtle scroll state to the topbar.
const topbar=document.querySelector('.topbar');
window.addEventListener('scroll',()=>{if(!topbar)return;topbar.style.boxShadow=window.scrollY>16?'0 10px 28px rgba(31,41,55,.045)':'none'},{passive:true});

refreshIcons();
