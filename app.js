const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-item[data-page]');
const title = document.getElementById('pageTitle');
const toast = document.getElementById('toast');

const pageNames = {
  home:'Home', ai:'AI', projects:'Projects', chat:'Chat', build:'Build', code:'Code',
  agents:'Agents', labs:'Labs', files:'Files', automations:'Automations', settings:'Settings'
};

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove('show'),1800);
}

function goToPage(page){
  pages.forEach(p=>p.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  navItems.forEach(item=>item.classList.toggle('active', item.dataset.page === page));
  title.textContent = pageNames[page] || page;
  window.location.hash = page === 'home' ? '' : page;
  window.scrollTo({top:0,behavior:'smooth'});
}

navItems.forEach(item=>item.addEventListener('click',()=>goToPage(item.dataset.page)));
document.querySelectorAll('[data-page-link]').forEach(button=>button.addEventListener('click',()=>{
  goToPage(button.dataset.pageLink);
  closeCommand();
}));

const initialPage = window.location.hash.replace('#','');
if(pageNames[initialPage]) goToPage(initialPage);

// Theme
const themeToggle = document.getElementById('themeToggle');
const settingsTheme = document.getElementById('settingsTheme');
const savedTheme = localStorage.getItem('syvora-theme') || 'dark';
if(savedTheme === 'light') document.body.classList.add('light');
if(settingsTheme) settingsTheme.value = savedTheme === 'light' ? 'Light' : 'Dark';

function setTheme(theme){
  const isLight = theme.toLowerCase() === 'light';
  document.body.classList.toggle('light', isLight);
  localStorage.setItem('syvora-theme', isLight ? 'light' : 'dark');
  if(settingsTheme) settingsTheme.value = isLight ? 'Light' : 'Dark';
}

themeToggle?.addEventListener('click',()=>setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));
settingsTheme?.addEventListener('change',e=>setTheme(e.target.value));

// Command palette
const commandModal = document.getElementById('commandModal');
const commandButton = document.getElementById('commandButton');
const commandInput = document.getElementById('commandInput');
function openCommand(){ commandModal.classList.add('open'); commandModal.setAttribute('aria-hidden','false'); setTimeout(()=>commandInput.focus(),50); }
function closeCommand(){ commandModal.classList.remove('open'); commandModal.setAttribute('aria-hidden','true'); commandInput.value=''; filterCommands(''); }
function filterCommands(query){
  document.querySelectorAll('.command-options button').forEach(button=>{
    button.style.display = button.textContent.toLowerCase().includes(query.toLowerCase()) ? 'flex' : 'none';
  });
}
commandButton?.addEventListener('click',openCommand);
commandModal?.addEventListener('click',e=>{if(e.target===commandModal)closeCommand()});
commandInput?.addEventListener('input',e=>filterCommands(e.target.value));
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}
  if(e.key==='Escape') closeCommand();
});

// Home composer routes to the right experience
const homePrompt = document.getElementById('homePrompt');
const homeMode = document.getElementById('homeMode');
document.getElementById('homeSend')?.addEventListener('click',()=>{
  const text = homePrompt.value.trim();
  if(!text){showToast('Type something first');return;}
  if(homeMode.value==='Build Mode'){
    goToPage('build');
    document.getElementById('buildInput').value = text;
    addBuildMessage(text);
  } else {
    goToPage('ai');
    document.getElementById('chatMode').value = homeMode.value;
    addChatMessage(text,'user');
    fakeAIReply(text);
  }
  homePrompt.value='';
});
homePrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))document.getElementById('homeSend').click()});

// AI chat
const messages = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');
function addChatMessage(text,role='user'){
  const node = document.createElement('div');
  node.className = `message ${role==='assistant'?'assistant':''}`;
  node.innerHTML = `<div class="message-avatar">${role==='assistant'?'S':'R'}</div><div><strong>${role==='assistant'?'Syvora':'You'}</strong><p></p></div>`;
  node.querySelector('p').textContent = text;
  messages.appendChild(node);
  messages.scrollTop = messages.scrollHeight;
}
function fakeAIReply(input){
  const mode = document.getElementById('chatMode').value;
  const reply = mode==='Workspace Chat'
    ? `I can help with that using your Syvora workspace. V1 is currently a front-end prototype, so the next backend step is connecting projects, files, GitHub, and chat data to the AI.`
    : `Got it. In this V1, the chat experience is interactive, and the next step is connecting a real AI model so Syvora can answer anything like a normal chatbot.`;
  setTimeout(()=>addChatMessage(reply,'assistant'),350);
}
document.getElementById('chatSend')?.addEventListener('click',()=>{
  const text=chatInput.value.trim(); if(!text)return; addChatMessage(text); chatInput.value=''; fakeAIReply(text);
});
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('chatSend').click()}});
document.getElementById('newChat')?.addEventListener('click',()=>{
  messages.innerHTML='<div class="message assistant"><div class="message-avatar">S</div><div><strong>Syvora</strong><p>New chat started. What do you want to work on?</p></div></div>';
  showToast('New chat created');
});

// Build studio
const buildInput = document.getElementById('buildInput');
const buildLog = document.getElementById('buildLog');
function addBuildMessage(text){
  const item=document.createElement('div');
  item.style.cssText='margin:12px 0;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:var(--soft);font-size:12px;line-height:1.5';
  item.textContent=text;
  buildLog.appendChild(item);
  buildInput.value='';
  setTimeout(()=>{
    const response=document.createElement('div');
    response.style.cssText='margin:12px 0;color:var(--muted);font-size:12px;line-height:1.6';
    response.innerHTML='<strong style="color:var(--text)">Syvora</strong><br>I created a first-pass layout in the preview. Next I can refine the sections, styling, data, or interactions.';
    buildLog.appendChild(response);
  },300);
}
document.getElementById('buildSend')?.addEventListener('click',()=>{const t=buildInput.value.trim();if(t)addBuildMessage(t)});
buildInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('buildSend').click()}});
document.querySelectorAll('.suggestion-chips button').forEach(button=>button.addEventListener('click',()=>{buildInput.value=`Build me a ${button.textContent.toLowerCase()}`;buildInput.focus()}));

// New project demo
let projectCount=0;
document.getElementById('newProjectBtn')?.addEventListener('click',()=>{
  projectCount++;
  const card=document.createElement('article');
  card.className='project-card';
  card.innerHTML=`<div class="project-card-top"><span class="project-icon muted">N${projectCount}</span><span class="tiny-pill">New</span></div><h3>New Project ${projectCount}</h3><p>A fresh Syvora project ready for tasks, chat, code, files, and AI.</p><div class="card-meta"><span>0 tasks</span><span>1 member</span><span>0%</span></div><div class="progress"><i style="width:0%"></i></div>`;
  document.getElementById('projectCards').appendChild(card);
  showToast('New project created');
});

// Lightweight demo interactions
document.querySelectorAll('.toggle').forEach(toggle=>toggle.addEventListener('click',()=>toggle.classList.toggle('on')));
document.querySelectorAll('input[type="checkbox"]').forEach(box=>box.addEventListener('change',()=>{
  box.closest('.task-row').style.opacity=box.checked?'.45':'1';
}));
document.querySelectorAll('.builder-header .primary-button').forEach(b=>b.addEventListener('click',()=>showToast('Publish flow will connect in the backend phase')));
document.querySelectorAll('.git-panel .primary-button').forEach(b=>b.addEventListener('click',()=>showToast('GitHub commit action ready for backend integration')));
