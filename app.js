// Force GitHub Pages and browsers to load the latest styles instead of stale cached copies.
const syvoraStyle=document.createElement('link');
syvoraStyle.rel='stylesheet';
syvoraStyle.href='./styles.css?v=20260828-1650';
document.head.appendChild(syvoraStyle);
const studiosStyle=document.createElement('link');
studiosStyle.rel='stylesheet';
studiosStyle.href='./studios.css?v=20260828-1650';
document.head.appendChild(studiosStyle);

// Upgrade Labs into Studios and expand chat products before event handlers are wired.
const labsNav=document.querySelector('.nav-item[data-page="labs"] span');
if(labsNav)labsNav.textContent='Studios';
const labsIcon=document.querySelector('.nav-item[data-page="labs"] i');
if(labsIcon)labsIcon.setAttribute('data-lucide','shapes');

const labsPage=document.getElementById('page-labs');
if(labsPage){labsPage.innerHTML=`
  <div class="studios-hero">
    <div><span class="eyebrow">CREATE WITH AI</span><h1>Syvora Studios</h1><p>Create images, videos, interfaces, 3D assets, websites, code, presentations, brands, audio, documents, games, agents, automations and more from one creative workspace.</p></div>
    <label class="studio-search"><i data-lucide="search"></i><input placeholder="Search studios..." id="studioSearch"></label>
  </div>
  <div class="studio-tabs"><button class="active">All</button><button>Visual</button><button>Build</button><button>Content</button><button>Automation</button></div>
  <div class="studios-grid" id="studiosGrid">
    <article class="studio-card image"><span class="studio-icon"><i data-lucide="image"></i></span><h3>Image Studio</h3><p>Generate, edit, restyle, upscale, remove backgrounds, make thumbnails, product art and game assets.</p><div class="studio-meta"><span>Images · Editing</span><b>Open →</b></div></article>
    <article class="studio-card video"><span class="studio-icon"><i data-lucide="clapperboard"></i></span><h3>Video Studio</h3><p>Text-to-video, image-to-video, cuts, captions, transitions, voiceovers and short-form content.</p><div class="studio-meta"><span>Video · Motion</span><b>Open →</b></div></article>
    <article class="studio-card ui"><span class="studio-icon"><i data-lucide="panel-top"></i></span><h3>UI Designer</h3><p>Design websites and apps visually with AI, responsive previews, components and export-ready code.</p><div class="studio-meta"><span>UI · UX</span><b>Open →</b></div></article>
    <article class="studio-card three"><span class="studio-icon"><i data-lucide="box"></i></span><h3>3D Designer</h3><p>Create 3D concepts, objects, scenes, materials, lighting setups and game-ready asset ideas.</p><div class="studio-meta"><span>3D · Assets</span><b>Open →</b></div></article>
    <article class="studio-card web"><span class="studio-icon"><i data-lucide="layout-template"></i></span><h3>Website Builder</h3><p>Vibe-code complete websites with live preview, visual editing, components and deployment flow.</p><div class="studio-meta"><span>Web · Builder</span><b>Open →</b></div></article>
    <article class="studio-card code"><span class="studio-icon"><i data-lucide="code-2"></i></span><h3>Code Studio</h3><p>Write, explain, debug and refactor code with repo context, files, terminal-style workflows and GitHub.</p><div class="studio-meta"><span>Code · Git</span><b>Open →</b></div></article>
    <article class="studio-card brand"><span class="studio-icon"><i data-lucide="badge"></i></span><h3>Brand Studio</h3><p>Create logos, brand kits, palettes, typography, social graphics and reusable visual systems.</p><div class="studio-meta"><span>Brand · Identity</span><b>Open →</b></div></article>
    <article class="studio-card audio"><span class="studio-icon"><i data-lucide="audio-waveform"></i></span><h3>Audio Studio</h3><p>Voiceovers, narration, sound cleanup, audio concepts, music direction and sound-effect generation.</p><div class="studio-meta"><span>Voice · Audio</span><b>Open →</b></div></article>
    <article class="studio-card slides"><span class="studio-icon"><i data-lucide="presentation"></i></span><h3>Presentation Studio</h3><p>Generate polished slide decks, pitch decks, school presentations and visual storytelling.</p><div class="studio-meta"><span>Slides · Story</span><b>Open →</b></div></article>
    <article class="studio-card docs"><span class="studio-icon"><i data-lucide="file-text"></i></span><h3>Document Studio</h3><p>Create reports, plans, proposals, PDFs, summaries and structured long-form documents.</p><div class="studio-meta"><span>Docs · PDF</span><b>Open →</b></div></article>
    <article class="studio-card game"><span class="studio-icon"><i data-lucide="gamepad-2"></i></span><h3>Game Studio</h3><p>Design game ideas, maps, UI, assets, mechanics and scripts with Roblox-friendly workflows.</p><div class="studio-meta"><span>Games · Roblox</span><b>Open →</b></div></article>
    <article class="studio-card agent"><span class="studio-icon"><i data-lucide="bot"></i></span><h3>Agent Studio</h3><p>Build custom AI workers with instructions, tools, memory, permissions, schedules and roles.</p><div class="studio-meta"><span>Agents · AI</span><b>Open →</b></div></article>
    <article class="studio-card auto"><span class="studio-icon"><i data-lucide="workflow"></i></span><h3>Automation Studio</h3><p>Create trigger-and-action workflows across projects, chat, GitHub, files and agents.</p><div class="studio-meta"><span>Flows · Actions</span><b>Open →</b></div></article>
    <article class="studio-card data"><span class="studio-icon"><i data-lucide="database"></i></span><h3>Data Studio</h3><p>Explore tables, generate dashboards, query data and turn raw information into useful views.</p><div class="studio-meta"><span>Data · Insights</span><b>Open →</b></div></article>
  </div>`}

const aiPage=document.getElementById('page-ai');
if(aiPage){aiPage.innerHTML=`
  <div class="full-workspace">
    <aside class="full-rail">
      <button class="rail-action" id="newChat"><i data-lucide="plus"></i> New chat</button>
      <label class="rail-search"><i data-lucide="search"></i><input placeholder="Search chats"></label>
      <div class="rail-title">Today</div>
      <button class="rail-item active"><i data-lucide="message-square"></i><span><b>Syvora product design</b><small>Just now</small></span></button>
      <button class="rail-item"><i data-lucide="message-square"></i><span><b>Image ideas</b><small>18 min</small></span></button>
      <div class="rail-title">Previous</div>
      <button class="rail-item"><i data-lucide="code-2"></i><span><b>Fix website CSS</b><small>Yesterday</small></span></button>
      <button class="rail-item"><i data-lucide="brain"></i><span><b>Game concept research</b><small>2 days</small></span></button>
      <div class="rail-spacer"></div>
      <button class="rail-item"><i data-lucide="archive"></i><span><b>Archived chats</b><small>12 conversations</small></span></button>
    </aside>
    <main class="full-main">
      <header class="workspace-head"><div class="workspace-head-left"><img src="assets/syvora-logo.svg" alt="Syvora"><span><strong>Syvora AI</strong><small>Ask, research, create, code and work with your workspace</small></span></div><div class="workspace-actions"><button title="Share"><i data-lucide="share-2"></i></button><button title="More"><i data-lucide="more-horizontal"></i></button><select id="chatMode"><option>Normal chat</option><option>Workspace chat</option><option>Build mode</option></select></div></header>
      <div class="feature-strip"><button><i data-lucide="globe-2"></i> Web search</button><button><i data-lucide="paperclip"></i> Files</button><button><i data-lucide="image"></i> Images</button><button><i data-lucide="code-2"></i> Code</button><button><i data-lucide="bar-chart-3"></i> Analyze</button><button><i data-lucide="folder-kanban"></i> Projects</button><button><i data-lucide="github"></i> GitHub</button><button><i data-lucide="bot"></i> Agents</button></div>
      <div class="full-messages" id="messages"><div class="full-empty empty-chat"><img src="assets/syvora-logo.svg" alt="Syvora"><h2>What do you want to do?</h2><p>Talk normally, search the web, upload files, generate ideas, write code, analyze data, create content, or switch to Workspace chat so Syvora can work with your projects and tools.</p><div class="full-starters starter-grid"><button>Design a complete app idea</button><button>Research something deeply</button><button>Help me build and debug code</button><button>Create an image or video concept</button></div></div></div>
      <div class="full-compose-wrap"><div class="full-compose"><textarea id="chatInput" rows="2" placeholder="Message Syvora..."></textarea><div class="compose-foot"><div class="compose-tools"><button title="Attach"><i data-lucide="paperclip"></i></button><button title="Web"><i data-lucide="globe-2"></i></button><button title="Image"><i data-lucide="image"></i></button><button title="Voice"><i data-lucide="mic"></i></button><button title="Tools"><i data-lucide="wrench"></i></button></div><div class="compose-send"><button title="Voice mode"><i data-lucide="audio-lines"></i></button><button class="send-button" id="chatSend"><i data-lucide="arrow-up"></i></button></div></div></div></div>
    </main>
    <aside class="context-panel"><div class="context-block"><h4>Workspace context</h4><div class="context-item"><i data-lucide="folder-kanban"></i><span><b>Syvora project</b><small>6 tasks · 3 files</small></span></div><div class="context-item"><i data-lucide="github"></i><span><b>Radin-dev1/Syvora</b><small>main branch</small></span></div></div><div class="context-block"><h4>Tools available</h4><div class="context-item"><i data-lucide="globe-2"></i><span><b>Web search</b><small>Find current information</small></span></div><div class="context-item"><i data-lucide="image"></i><span><b>Image tools</b><small>Create and edit visuals</small></span></div><div class="context-item"><i data-lucide="code-2"></i><span><b>Code tools</b><small>Files and repositories</small></span></div></div><div class="context-block"><h4>Conversation</h4><div class="context-item"><i data-lucide="pin"></i><span><b>Pinned context</b><small>2 items</small></span></div><div class="context-item"><i data-lucide="download"></i><span><b>Export chat</b><small>Markdown or PDF</small></span></div></div></aside>
  </div>`}

const teamPage=document.getElementById('page-chat');
if(teamPage){teamPage.innerHTML=`
  <div class="full-workspace team-workspace">
    <aside class="full-rail"><button class="rail-action"><i data-lucide="plus"></i> New message</button><label class="rail-search"><i data-lucide="search"></i><input placeholder="Search team"></label><div class="rail-title">Channels</div><button class="rail-item active"><i data-lucide="hash"></i><span><b>general</b><small>8 new messages</small></span></button><button class="rail-item"><i data-lucide="hash"></i><span><b>syvora-design</b><small>3 new</small></span></button><button class="rail-item"><i data-lucide="hash"></i><span><b>development</b><small>GitHub linked</small></span></button><button class="rail-item"><i data-lucide="hash"></i><span><b>ai-research</b><small>Agents active</small></span></button><div class="rail-title">Direct messages</div><button class="rail-item"><span class="avatar">A</span><span><b>Alex</b><small>Online</small></span></button><button class="rail-item"><span class="avatar">M</span><span><b>Maya</b><small>12m ago</small></span></button><div class="rail-spacer"></div><button class="rail-item"><i data-lucide="plus-circle"></i><span><b>Add channel</b><small>Create a space</small></span></button></aside>
    <main class="full-main"><header class="workspace-head"><div class="workspace-head-left"><span class="avatar">#</span><span><strong>general</strong><small>Company-wide updates and collaboration</small></span></div><div class="workspace-actions"><button title="Search"><i data-lucide="search"></i></button><button title="Start huddle"><i data-lucide="headphones"></i></button><button title="Video call"><i data-lucide="video"></i></button><button title="Members"><i data-lucide="users"></i></button><button title="More"><i data-lucide="more-horizontal"></i></button></div></header>
      <div class="feature-strip"><button><i data-lucide="pin"></i> 4 pinned</button><button><i data-lucide="file"></i> Files</button><button><i data-lucide="list-checks"></i> Tasks</button><button><i data-lucide="bot"></i> Ask AI</button><button><i data-lucide="bell"></i> Notifications</button><button><i data-lucide="bookmark"></i> Saved</button></div>
      <div class="full-messages"><div class="team-message"><div class="team-avatar">A</div><div><header><strong>Alex</strong><time>10:32 AM</time></header><p>The new Syvora studios direction looks much stronger. <span class="mention">@Radin</span> I added notes for Image Studio and Video Studio.</p><div class="reaction-row"><button>🔥 4</button><button>✅ 2</button><button>+ Add</button></div><button class="thread-link">3 replies · View thread</button></div></div><div class="team-message"><div class="team-avatar">M</div><div><header><strong>Maya</strong><time>10:41 AM</time></header><p>I uploaded the UI references and linked them to the design project. The AI can summarize them from this channel too.</p><div class="reaction-row"><button>👀 3</button><button>💙 2</button></div></div></div><div class="team-message"><div class="team-avatar">S</div><div><header><strong>Syvora AI</strong><time>10:42 AM</time></header><p><b>Channel summary:</b> The team wants Studios to become a core product area, with larger AI and team-chat workspaces and stronger creative tools.</p><div class="reaction-row"><button>✨ AI summary</button><button>Turn into tasks</button></div></div></div></div>
      <div class="full-compose-wrap"><div class="full-compose"><textarea rows="2" placeholder="Message #general"></textarea><div class="compose-foot"><div class="compose-tools"><button title="Attach"><i data-lucide="plus"></i></button><button title="Emoji"><i data-lucide="smile"></i></button><button title="Mention"><i data-lucide="at-sign"></i></button><button title="File"><i data-lucide="paperclip"></i></button><button title="Record clip"><i data-lucide="video"></i></button><button title="Ask AI"><i data-lucide="sparkles"></i></button></div><div class="compose-send"><button title="Schedule send"><i data-lucide="clock-3"></i></button><button class="send-button"><i data-lucide="send"></i></button></div></div></div></div>
    </main>
    <aside class="context-panel"><div class="context-block"><h4>#general members</h4><div class="member-stack"><span>R</span><span>A</span><span>M</span><span>+5</span></div></div><div class="context-block"><h4>Channel tools</h4><div class="context-item"><i data-lucide="sparkles"></i><span><b>AI summary</b><small>Summarize unread messages</small></span></div><div class="context-item"><i data-lucide="list-checks"></i><span><b>Create tasks</b><small>From any message</small></span></div><div class="context-item"><i data-lucide="workflow"></i><span><b>Automations</b><small>3 active rules</small></span></div></div><div class="context-block"><h4>Pinned</h4><div class="context-item"><i data-lucide="file-text"></i><span><b>Syvora design brief</b><small>Updated today</small></span></div><div class="context-item"><i data-lucide="github"></i><span><b>Syvora repository</b><small>main</small></span></div></div></aside>
  </div>`}

const pages=[...document.querySelectorAll('.page')];
const navItems=[...document.querySelectorAll('.nav-item[data-page]')];
const pageTitle=document.getElementById('pageTitle');
const toast=document.getElementById('toast');
const names={home:'Home',ai:'AI Chat',projects:'Projects',chat:'Team chat',build:'Build',code:'Code',agents:'Agents',labs:'Studios',files:'Files',automations:'Automations',settings:'Settings'};

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
function fakeReply(mode=document.getElementById('chatMode')?.value){setTimeout(()=>appendMessage(mode==='Workspace chat'?'I can use your projects, files, code, channels and tools here once the backend is connected.':'Got it. Syvora chat now has the full workspace UI — the real model connection comes after the design is locked in.','assistant'),350)}
function sendChat(){const text=chatInput?.value.trim();if(!text)return;appendMessage(text);chatInput.value='';fakeReply()}
document.getElementById('chatSend')?.addEventListener('click',sendChat);
chatInput?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}});
document.querySelectorAll('.starter-grid button').forEach(b=>b.addEventListener('click',()=>{if(chatInput){chatInput.value=b.textContent;chatInput.focus()}}));
document.getElementById('newChat')?.addEventListener('click',()=>{if(!messages)return;messages.innerHTML='<div class="full-empty empty-chat"><img src="assets/syvora-logo.svg" alt="Syvora"><h2>What do you want to do?</h2><p>Ask a question, research, upload files, create something, write code, or connect this chat to your workspace.</p><div class="full-starters starter-grid"><button>Plan a product</button><button>Help me write code</button><button>Research competitors</button><button>Create visual ideas</button></div></div>';document.querySelectorAll('.starter-grid button').forEach(b=>b.addEventListener('click',()=>{if(chatInput){chatInput.value=b.textContent;chatInput.focus()}}));notify('New chat started')});

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

document.querySelectorAll('.studio-card').forEach(card=>card.addEventListener('click',()=>notify(`${card.querySelector('h3')?.textContent} is ready for the functionality phase`)));
const studioSearch=document.getElementById('studioSearch');studioSearch?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.studio-card').forEach(card=>card.style.display=card.textContent.toLowerCase().includes(q)?'flex':'none')});
document.querySelectorAll('.studio-tabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.studio-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}));

document.querySelectorAll('.primary-button').forEach(b=>{if(!b.dataset.pageLink&&!['newChat','newProjectBtn'].includes(b.id))b.addEventListener('click',()=>{if(b.closest('#page-build'))notify('Publish comes in the functionality phase');if(b.closest('#page-code'))notify('Commit action comes in the functionality phase')})});

icons();