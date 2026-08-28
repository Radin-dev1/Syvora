const pages=document.querySelectorAll('.page');
const navItems=document.querySelectorAll('.nav-item[data-page]');
const pageTitle=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const pageNames={home:'Home',ai:'AI Chat',projects:'Projects',chat:'Team Chat',build:'Build',code:'Code',agents:'Agents',labs:'Labs',files:'Files',automations:'Automations'};

function icons(){if(window.lucide)lucide.createIcons()}
function notify(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),1700)}
function go(page){pages.forEach(p=>p.classList.toggle('active',p.id===`page-${page}`));navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===page));if(pageTitle)pageTitle.textContent=pageNames[page]||page;history.replaceState(null,'',page==='home'?location.pathname:`#${page}`);window.scrollTo({top:0,behavior:'smooth'});icons()}
navItems.forEach(n=>n.addEventListener('click',()=>go(n.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(b=>b.addEventListener('click',()=>{go(b.dataset.pageLink);closeCommand()}));
const hash=location.hash.slice(1);if(pageNames[hash])go(hash);

const commandModal=document.getElementById('commandModal');
const commandInput=document.getElementById('commandInput');
function openCommand(){commandModal?.classList.add('open');commandModal?.setAttribute('aria-hidden','false');setTimeout(()=>commandInput?.focus(),40)}
function closeCommand(){commandModal?.classList.remove('open');commandModal?.setAttribute('aria-hidden','true');if(commandInput){commandInput.value='';filterCommands('')}}
function filterCommands(q){document.querySelectorAll('.command-options button').forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q.toLowerCase())?'grid':'none')}
document.getElementById('commandButton')?.addEventListener('click',openCommand);
commandModal?.addEventListener('click',e=>{if(e.target===commandModal)closeCommand()});
commandInput?.addEventListener('input',e=>filterCommands(e.target.value));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}if(e.key==='Escape')closeCommand()});

const messages=document.getElementById('messages');
const chatInput=document.getElementById('chatInput');
function clearEmpty(){messages?.querySelector('.empty-chat')?.remove()}
function addMessage(text,assistant=false){if(!messages)return;clearEmpty();const row=document.createElement('div');row.className=`message ${assistant?'assistant':''}`;row.innerHTML=`<div class="message-avatar">${assistant?'<i data-lucide="sparkles"></i>':'R'}</div><div><strong>${assistant?'Syvora':'You'}</strong><p></p></div>`;row.querySelector('p').textContent=text;messages.appendChild(row);messages.scrollTop=messages.scrollHeight;icons()}
function fakeReply(){setTimeout(()=>addMessage(document.getElementById('chatMode')?.value==='Workspace Chat'?'I can work with your connected workspace context here. The real backend comes after the design phase.':'Absolutely — this is Syvora in normal chatbot mode. The real AI model comes after the design is locked.',true),350)}
document.getElementById('chatSend')?.addEventListener('click',()=>{const t=chatInput?.value.trim();if(!t)return;addMessage(t);chatInput.value='';fakeReply()});
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('chatSend')?.click()}});
document.querySelectorAll('.prompt-grid button').forEach(b=>b.addEventListener('click',()=>{if(chatInput){chatInput.value=b.textContent;chatInput.focus()}}));
document.getElementById('newChat')?.addEventListener('click',()=>{if(!messages)return;messages.innerHTML=`<div class="empty-chat"><div class="syvora-logo large-logo"><span class="hub"></span><span class="ray r1"></span><span class="ray r2"></span><span class="ray r3"></span><span class="ray r4"></span><span class="node n1"></span><span class="node n2"></span><span class="node n3"></span><span class="node n4"></span></div><h2>What can I help you with?</h2><p>Ask a question, brainstorm an idea, upload a file, write code, or switch to Workspace Chat.</p><div class="prompt-grid"><button>Plan a new product</button><button>Help me write code</button><button>Brainstorm content ideas</button><button>Summarize a document</button></div></div>`;document.querySelectorAll('.prompt-grid button').forEach(b=>b.addEventListener('click',()=>{chatInput.value=b.textContent;chatInput.focus()}));notify('New chat started')});

const homePrompt=document.getElementById('homePrompt');
const homeMode=document.getElementById('homeMode');
document.getElementById('homeSend')?.addEventListener('click',()=>{const t=homePrompt?.value.trim();if(!t){notify('Type something first');return}if(homeMode?.value==='Build Mode'){go('build');const bi=document.getElementById('buildInput');if(bi)bi.value=t}else{go('ai');const cm=document.getElementById('chatMode');if(cm&&homeMode)cm.value=homeMode.value;addMessage(t);fakeReply()}homePrompt.value=''});
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))document.getElementById('homeSend')?.click()});

const buildInput=document.getElementById('buildInput');
const buildLog=document.getElementById('buildLog');
function addBuild(text){if(!buildLog)return;buildLog.querySelector('.builder-empty')?.remove();const u=document.createElement('div');u.style.cssText='margin:12px 0;padding:10px 11px;border:1px solid var(--line);border-radius:11px;background:#f7f9fb;font-size:10px;line-height:1.5';u.textContent=text;buildLog.appendChild(u);setTimeout(()=>{const a=document.createElement('div');a.style.cssText='font-size:10px;line-height:1.6;color:var(--muted);margin:12px 0';a.innerHTML='<b style="color:var(--text)">Syvora</b><br>Draft created in the preview. Tell me what to change next.';buildLog.appendChild(a)},300)}
document.getElementById('buildSend')?.addEventListener('click',()=>{const t=buildInput?.value.trim();if(!t)return;addBuild(t);buildInput.value=''});
buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('buildSend')?.click()}});
document.querySelectorAll('.suggestion-chips button').forEach(b=>b.addEventListener('click',()=>{if(buildInput){buildInput.value=`Build me a ${b.textContent.toLowerCase()}`;buildInput.focus()}}));

let projectCount=0;
document.getElementById('newProjectBtn')?.addEventListener('click',()=>{projectCount++;const card=document.createElement('article');card.className='project-card';card.innerHTML=`<div><span class="project-mark blue">N${projectCount}</span><span class="mini-pill blue-pill">New</span></div><h3>New Project ${projectCount}</h3><p>A fresh Syvora project ready for planning, chat, code, files, and AI.</p><div class="project-meta"><span>0 tasks</span><span>1 member</span><b>0%</b></div><div class="bar"><i style="width:0%"></i></div>`;document.getElementById('projectCards')?.appendChild(card);notify('Project created')});

document.querySelectorAll('.toggle').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));
document.querySelectorAll('input[type="checkbox"]').forEach(c=>c.addEventListener('change',()=>{const label=c.closest('label');if(label)label.style.opacity=c.checked?'.45':'1'}));
document.querySelectorAll('.topbar .primary-button,.page-intro .primary-button').forEach(b=>{if(!b.dataset.pageLink)b.addEventListener('click',()=>notify('Functionality comes after the design phase'))});

// subtle premium motion without changing the logo design
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.quick-actions>button,.bento-card,.project-card,.kanban-col,.feature-grid article,.automation-card').forEach(el=>observer.observe(el));
icons();