/* CollabChord live Supabase integration.
   This module replaces demo collaboration data with authenticated database records. */
(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const client = () => window.ccSupabase;
  state.creators=[]; state.bulletins=[]; state.chats={}; state.activeProject=null;
  const currentId = () => window.ccAuthUser?.id || null;
  const notify = (message, type='info') => typeof window.showToast === 'function' ? window.showToast(message, type) : alert(message);
  const profileMap = new Map();
  let directMessages = [];
  let projectMessages = [];
  let projectComments = [];
  let projects = [];
  let bulletins = [];
  let activeProjectId = null;
  let activeProjectOwnerId = null;
  let refreshBusy = false;

  function mapProfile(p) {
    return {
      id:p.id, name:p.display_name || 'Artist', avatar:p.avatar_url || 'https://raw.githubusercontent.com/ianosebe/CollabChord/master/assets/logo.jpg',
      skills:Array.isArray(p.skills)?p.skills:[], genres:Array.isArray(p.genres)?p.genres:[],
      needs:Array.isArray(p.looking_for)?p.looking_for:[], bio:p.bio || 'Artist on CollabChord.',
      influence:'CollabChord member', tracks:[], workingStyle:'Remote', commitment:'Open to collaboration',
      location:'', matchPct:typeof window.calculateMatch==='function' && state.currentUser ? calculateMatch(state.currentUser,p) : 0
    };
  }
  function creatorById(id) { return state.creators.find(c=>c.id===id) || profileMap.get(id) || {id,name:'CollabChord member',avatar:'https://raw.githubusercontent.com/ianosebe/CollabChord/master/assets/logo.jpg',skills:[],genres:[],needs:[],bio:'',matchPct:0}; }
  function formatTime(v) { try { return new Date(v).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}); } catch { return ''; } }
  function formatSeconds(v) { const n=Math.max(0,Number(v)||0); return Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0'); }

  async function loadProfiles() {
    const {data,error}=await client().from('profiles').select('id,display_name,bio,skills,genres,looking_for,avatar_url,created_at').order('created_at',{ascending:false}).limit(250);
    if(error) throw error;
    profileMap.clear();
    (data||[]).forEach(p=>profileMap.set(p.id,mapProfile(p)));
    state.creators=[...profileMap.values()].filter(p=>p.id!==currentId());
    if(typeof updateAllMatches==='function') updateAllMatches();
  }
  async function loadBulletins() {
    const {data,error}=await client().from('bulletins').select('id,creator_id,title,description,role_needed,genre,status,created_at').eq('status','open').order('created_at',{ascending:false}).limit(100);
    if(error) throw error;
    bulletins=(data||[]).map(b=>({...b,author:profileMap.get(b.creator_id)?.name || 'CollabChord member',text:b.description,roleWanted:b.role_needed,date:formatTime(b.created_at),creatorId:b.creator_id}));
    state.bulletins=bulletins;
    window.renderBulletins();
  }
  async function loadDirectMessages() {
    const uid=currentId(); if(!uid) return;
    const {data,error}=await client().from('messages').select('id,sender_id,recipient_id,project_id,body,created_at').is('project_id',null).or('sender_id.eq.'+uid+',recipient_id.eq.'+uid).order('created_at',{ascending:true}).limit(500);
    if(error) throw error;
    directMessages=data||[];
    state.chats={};
    directMessages.forEach(m=>{
      const other=m.sender_id===uid?m.recipient_id:m.sender_id;
      if(!other) return;
      if(!state.chats[other]) state.chats[other]=[];
      state.chats[other].push({id:m.id,sender:m.sender_id===uid?'user':m.sender_id,text:m.body,time:formatTime(m.created_at),created_at:m.created_at});
    });
    if(!state.activeInboxCreatorId || !state.chats[state.activeInboxCreatorId]) state.activeInboxCreatorId=Object.keys(state.chats)[0]||null;
    window.renderInbox();
  }
  async function loadProjects() {
    const uid=currentId(); if(!uid) return;
    const {data,error}=await client().from('collaboration_projects').select('id,owner_id,title,description,status,created_at').order('created_at',{ascending:false}).limit(100);
    if(error) throw error;
    projects=data||[];
    if(!projects.some(p=>p.id===activeProjectId)) activeProjectId=projects[0]?.id||null;
    const selected=projects.find(p=>p.id===activeProjectId);
    activeProjectOwnerId=selected?.owner_id||null;
    if(selected) {
      const {data:members}=await client().from('project_members').select('user_id,member_role').eq('project_id',selected.id);
      const other=(members||[]).find(m=>m.user_id!==uid);
      const partner=other?creatorById(other.user_id):null;
      state.activeProject={id:selected.id,trackName:selected.title,collaboratorId:partner?.id||null,collaboratorName:partner?.name||'Your project',stems:{drums:{volume:80,muted:false,solo:false},bass:{volume:70,muted:false,solo:false},melody:{volume:80,muted:false,solo:false}},timelineComments:[]};
      await Promise.all([loadProjectMessages(selected.id),loadProjectComments(selected.id)]);
    } else {
      state.activeProject=null; projectMessages=[]; projectComments=[];
    }
    window.renderSidebarProjects();
    window.renderProjectChat();
    window.renderProjectComments();
    await loadStemFiles();
  }
  async function loadProjectMessages(projectId) {
    const {data,error}=await client().from('messages').select('id,sender_id,body,created_at').eq('project_id',projectId).order('created_at',{ascending:true}).limit(500);
    if(error) throw error; projectMessages=data||[]; window.renderProjectChat();
  }
  async function loadProjectComments(projectId) {
    const {data,error}=await client().from('timeline_comments').select('id,author_id,time_seconds,body,created_at').eq('project_id',projectId).order('time_seconds',{ascending:true}).limit(500);
    if(error) throw error; projectComments=data||[]; window.renderProjectComments();
  }
  async function loadStemFiles() {
    if(!activeProjectId) { window.renderStemFiles(); return; }
    const {data,error}=await client().from('stems').select('id,title,storage_path,duration_seconds,created_at,uploader_id').eq('project_id',activeProjectId).order('created_at',{ascending:false});
    if(error) throw error; window.renderStemFiles(data||[]);
  }
  async function refresh() {
    if(refreshBusy || !client() || !currentId()) return;
    refreshBusy=true;
    try {
      await loadProfiles();
      await loadBulletins();
      await loadDirectMessages();
      await loadProjects();
      window.renderDirectoryGrid();
      window.renderTopMatches();
      window.renderMyProfile();
    } catch(e) { console.error('CollabChord sync failed',e); notify('Some collaboration data could not load: '+(e.message||'Please refresh.'),'info'); }
    finally { refreshBusy=false; }
  }

  window.renderBulletins = function() {
    const container=document.getElementById('bulletin-postings'); if(!container) return;
    container.innerHTML='<div class="section-header" style="grid-column:1/-1;display:flex;justify-content:space-between;align-items:center"><h3>Open collaboration listings</h3><button class="btn btn-primary btn-sm" id="cc-create-bulletin">Post a listing</button></div>';
    const button=document.getElementById('cc-create-bulletin');
    button?.addEventListener('click',()=>{
      const old=document.getElementById('cc-bulletin-form'); if(old){old.remove();return;}
      const form=document.createElement('form'); form.id='cc-bulletin-form'; form.className='card'; form.style.cssText='grid-column:1/-1;padding:18px;display:grid;gap:10px';
      form.innerHTML='<h3>New collaboration listing</h3><label>Title <input name="title" required minlength="3" maxlength="120" style="width:100%"></label><label>Details <textarea name="description" required maxlength="3000" rows="3" style="width:100%"></textarea></label><label>Role needed <select name="role" required><option>Producer</option><option>Vocalist</option><option>Guitarist</option><option>Keyboardist</option><option>Bass Player</option><option>Songwriter</option><option>Audio Engineer</option><option>Drummer</option><option>Other</option></select></label><label>Genre <input name="genre" maxlength="80" style="width:100%"></label><button class="btn btn-primary" type="submit">Publish listing</button>';
      container.prepend(form);
      form.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(form);const {error}=await client().from('bulletins').insert({creator_id:currentId(),title:String(f.get('title')).trim(),description:String(f.get('description')).trim(),role_needed:String(f.get('role')),genre:String(f.get('genre')||'').trim()||null});if(error){notify(error.message,'info');return;}notify('Listing published.','success');await loadBulletins();});
    });
    if(!bulletins.length){const empty=document.createElement('p');empty.className='analyzer-placeholder';empty.textContent='No open listings yet. Be the first to post a collaboration call.';container.append(empty);return;}
    bulletins.forEach(b=>{const card=document.createElement('article');card.className='card bulletin-card';card.innerHTML='<div class="bulletin-header"><span class="bulletin-author">'+esc(b.author)+'</span><span class="bulletin-date">'+esc(b.date)+'</span></div><h3>'+esc(b.title)+'</h3><p class="bulletin-body">'+esc(b.text)+'</p><div class="bulletin-footer"><span class="bulletin-role-wanted">'+esc(b.roleWanted)+(b.genre?' · '+esc(b.genre):'')+'</span><button class="btn btn-primary btn-sm" data-pitch="'+esc(b.creatorId)+'">Message artist</button></div>';card.querySelector('[data-pitch]')?.addEventListener('click',()=>window.pitchToCreator(b.creatorId));container.append(card);});
  };
  window.renderSidebarProjects = function() {
    const c=document.getElementById('sidebar-projects-list'); if(!c)return;
    c.innerHTML='<button class="btn btn-primary btn-sm" id="cc-new-project" style="width:100%;margin-bottom:10px">+ New project</button>';
    c.querySelector('#cc-new-project')?.addEventListener('click',()=>window.createCollabProject());
    if(!projects.length){const p=document.createElement('p');p.className='analyzer-placeholder';p.textContent='No saved projects yet.';c.append(p);return;}
    projects.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='project-sidebar-item'+(p.id===activeProjectId?' active':'');b.style.cssText='width:100%;text-align:left;border:0;background:transparent;cursor:pointer';b.innerHTML='<div class="project-sidebar-art flex-center">♪</div><div class="project-sidebar-meta"><span class="project-sidebar-name">'+esc(p.title)+'</span><span class="project-sidebar-collab">'+esc(p.status.replace('_',' '))+'</span></div>';b.addEventListener('click',async()=>{activeProjectId=p.id;await loadProjects();switchTab('project');});c.append(b);});
  };
  window.renderInbox = function() {
    const list=document.getElementById('inbox-conversations');if(!list)return;list.innerHTML='';
    const keys=Object.keys(state.chats||{});
    if(!keys.length){list.innerHTML='<p class="analyzer-placeholder" style="padding:18px">No conversations yet. Discover an artist and send a message to start one.</p>';document.getElementById('no-chat-selected')?.classList.remove('hidden');document.getElementById('active-inbox-chat')?.classList.add('hidden');return;}
    keys.forEach(id=>{const p=creatorById(id),history=state.chats[id]||[],last=history[history.length-1];const item=document.createElement('button');item.type='button';item.className='conversation-item'+(state.activeInboxCreatorId===id?' active':'');item.style.cssText='width:100%;text-align:left;border:0;background:transparent;cursor:pointer';item.innerHTML='<img src="'+esc(p.avatar)+'" alt="" class="avatar-sm"><div class="conv-meta"><div class="conv-header"><span class="conv-name">'+esc(p.name)+'</span><span class="conv-time">'+esc(last?.time||'')+'</span></div><span class="conv-preview">'+esc(last?.text||'')+'</span></div>';item.addEventListener('click',()=>window.selectInboxConversation(id));list.append(item);});
    const id=state.activeInboxCreatorId,partner=creatorById(id);const no=document.getElementById('no-chat-selected'),pane=document.getElementById('active-inbox-chat');
    if(!id||!partner){no?.classList.remove('hidden');pane?.classList.add('hidden');return;}
    no?.classList.add('hidden');pane?.classList.remove('hidden');
    const avatar=document.getElementById('chat-partner-avatar');if(avatar)avatar.src=partner.avatar;
    document.getElementById('chat-partner-name').textContent=partner.name;
    document.getElementById('chat-partner-match-badge').textContent=(partner.matchPct||0)+'% Match';
    const msgs=document.getElementById('inbox-chat-messages');msgs.innerHTML='';
    (state.chats[id]||[]).forEach(m=>{const bubble=document.createElement('div');bubble.className='chat-bubble '+(m.sender==='user'?'sender':'recipient');bubble.innerHTML='<span class="chat-bubble-sender-name">'+esc(m.sender==='user'?(state.currentUser?.name||'Me'):partner.name)+'</span><span>'+esc(m.text)+'</span><span class="chat-bubble-time">'+esc(m.time)+'</span>';msgs.append(bubble);});
    msgs.scrollTop=msgs.scrollHeight;
  };
  window.selectInboxConversation = function(id){state.activeInboxCreatorId=id;window.renderInbox();};
  window.pitchToCreator = async function(id) {
    if(!currentId()){notify('Please sign in first.');return;}
    if(id===currentId()){notify('That is your own profile.');return;}
    const {error}=await client().from('messages').insert({sender_id:currentId(),recipient_id:id,body:'Hi! I found your profile on CollabChord and would like to discuss a possible collaboration.'});
    if(error){notify(error.message,'info');return;}
    state.activeInboxCreatorId=id;await loadDirectMessages();switchTab('messages');notify('Message sent.','success');
  };
  window.renderProjectChat = function() {
    const c=document.getElementById('project-chat-messages');if(!c)return;c.innerHTML='';
    if(!state.activeProject){c.innerHTML='<p class="analyzer-placeholder">Create a project or select one from your sidebar to start collaborating.</p>';document.querySelectorAll('.comment-pin').forEach(pin=>pin.remove());return;}
    if(!projectMessages.length){c.innerHTML='<p class="analyzer-placeholder">No project messages yet. Start the conversation below.</p>';return;}
    projectMessages.forEach(m=>{const own=m.sender_id===currentId(),bubble=document.createElement('div');bubble.className='chat-bubble '+(own?'sender':'recipient');bubble.innerHTML='<span class="chat-bubble-sender-name">'+esc(own?(state.currentUser?.name||'You'):(creatorById(m.sender_id).name))+'</span><span>'+esc(m.body)+'</span><span class="chat-bubble-time">'+esc(formatTime(m.created_at))+'</span>';c.append(bubble);});c.scrollTop=c.scrollHeight;
  };
  window.renderProjectComments = function() {
    const c=document.getElementById('waveform-comments-list');if(!c)return;c.innerHTML='';
    if(!state.activeProject){c.innerHTML='<p class="analyzer-placeholder">Timeline notes will appear when a project is selected.</p>';return;}
    document.querySelectorAll('.comment-pin').forEach(pin=>pin.remove());
    if(!projectComments.length){c.innerHTML='<p class="analyzer-placeholder">No timeline notes yet.</p>';return;}
    projectComments.forEach(n=>{const item=document.createElement('div');item.className='comment-card';item.innerHTML='<span class="comment-time">'+esc(formatSeconds(n.time_seconds))+'</span><span class="comment-body"><strong>'+esc(creatorById(n.author_id).name)+':</strong> '+esc(n.body)+'</span>';c.append(item);const pin=document.createElement('div');pin.className='comment-pin';pin.style.left=Math.min(100,(n.time_seconds/180)*100)+'%';pin.dataset.time=formatSeconds(n.time_seconds);pin.dataset.comment=n.body;document.querySelector('.timeline-visualizer-container')?.append(pin);});
  };
  window.renderStemFiles = function(rows) {
    let c=document.getElementById('cc-stem-files');
    if(!c){c=document.createElement('section');c.id='cc-stem-files';c.className='card';c.style.cssText='padding:16px;margin:16px 0';document.getElementById('view-project')?.prepend(c);}
    c.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><h3>Project audio stems</h3><p class="muted">Private files shared only with project members (max 50 MB per file).</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-secondary btn-sm" id="cc-invite-member" '+(!state.activeProject||activeProjectOwnerId!==currentId()?'disabled':'')+'>Invite collaborator</button><button class="btn btn-primary btn-sm" id="cc-upload-stem" '+(!state.activeProject?'disabled':'')+'>Upload audio</button></div><input id="cc-stem-file" type="file" accept="audio/*" hidden></div>';
    const invite=c.querySelector('#cc-invite-member');
    invite?.addEventListener('click',async()=>{
      if(!activeProjectId||activeProjectOwnerId!==currentId())return notify('Only the project owner can invite collaborators.');
      const available=state.creators.filter(p=>p.id!==currentId());
      if(!available.length)return notify('No other registered artists are available to invite yet.');
      const selectedName=prompt('Enter the exact artist name to invite:\n'+available.map(p=>p.name).join('\n'));
      if(!selectedName)return;
      const target=available.find(p=>p.name.toLowerCase()===selectedName.trim().toLowerCase());
      if(!target)return notify('Artist name not found. Copy a name from the list and try again.');
      const {error}=await client().from('project_members').insert({project_id:activeProjectId,user_id:target.id,member_role:'collaborator'});
      if(error)return notify(error.message,'info');
      notify(target.name+' added to the project.','success');
      await loadProjects();
    });
    const b=c.querySelector('#cc-upload-stem'),input=c.querySelector('#cc-stem-file');
    b?.addEventListener('click',()=>input.click());
    input?.addEventListener('change',async()=>{const file=input.files?.[0];if(!file)return;if(!file.type.startsWith('audio/')){notify('Choose an audio file.');return;}if(file.size>50*1024*1024){notify('Audio file exceeds the 50 MB limit.');return;}const path=activeProjectId+'/'+currentId()+'/'+Date.now()+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const {error:uploadError}=await client().storage.from('collabchord-stems').upload(path,file,{contentType:file.type,upsert:false});if(uploadError){notify(uploadError.message,'info');return;}const {error}=await client().from('stems').insert({project_id:activeProjectId,uploader_id:currentId(),title:file.name,storage_path:path});if(error){notify('Uploaded file but could not save its record: '+error.message,'info');return;}notify('Stem uploaded.','success');await loadStemFiles();});
    const list=document.createElement('div');list.style.cssText='display:grid;gap:8px;margin-top:12px';c.append(list);
    (rows||[]).forEach(stem=>{const row=document.createElement('div');row.className='comment-card';row.innerHTML='<span>♫ '+esc(stem.title)+'</span><button class="btn btn-secondary btn-sm">Download</button>';row.querySelector('button').addEventListener('click',async()=>{const {data,error}=await client().storage.from('collabchord-stems').createSignedUrl(stem.storage_path,60);if(error){notify(error.message,'info');return;}window.open(data.signedUrl,'_blank','noopener');});list.append(row);});
    if(!(rows||[]).length){const p=document.createElement('p');p.className='analyzer-placeholder';p.textContent=state.activeProject?'No audio files uploaded to this project yet.':'Create a project to upload audio stems.';list.append(p);}
  };
  window.createCollabProject = async function() {
    if(!currentId())return notify('Please sign in first.');
    const title=prompt('Project title (for example, “New single”):');if(!title||!title.trim())return;
    const description=prompt('Brief project description (optional):')||'';
    const {data,error}=await client().from('collaboration_projects').insert({owner_id:currentId(),title:title.trim(),description:description.trim()}).select().single();
    if(error)return notify(error.message,'info');
    const {error:memberError}=await client().from('project_members').insert({project_id:data.id,user_id:currentId(),member_role:'owner'});
    if(memberError){notify('Project created but membership setup failed: '+memberError.message,'info');}
    else notify('Project created.','success');
    activeProjectId=data.id;await loadProjects();switchTab('project');
  };
  async function sendDirectMessage() {
    const input=document.getElementById('inbox-chat-input'),body=input?.value.trim(),to=state.activeInboxCreatorId;
    if(!body||!to)return;
    const {error}=await client().from('messages').insert({sender_id:currentId(),recipient_id:to,body});
    if(error){notify(error.message,'info');return;}
    input.value='';await loadDirectMessages();
  }
  async function sendProjectMessage() {
    const input=document.getElementById('project-chat-input'),body=input?.value.trim();
    if(!body||!activeProjectId)return;
    const {error}=await client().from('messages').insert({sender_id:currentId(),project_id:activeProjectId,body});
    if(error){notify(error.message,'info');return;}
    input.value='';await loadProjectMessages(activeProjectId);
  }
  async function addTimelineComment() {
    const input=document.getElementById('new-timeline-comment'),body=input?.value.trim();
    if(!body||!activeProjectId)return;
    const pct=parseFloat(document.getElementById('waveform-scrubber')?.style.left)||0;
    const time=Math.round((pct/100)*180);
    const {error}=await client().from('timeline_comments').insert({project_id:activeProjectId,author_id:currentId(),time_seconds:time,body});
    if(error){notify(error.message,'info');return;}
    input.value='';await loadProjectComments(activeProjectId);
  }
  function bindEvents() {
    document.getElementById('inbox-chat-send')?.addEventListener('click',sendDirectMessage);
    document.getElementById('inbox-chat-input')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendDirectMessage();});
    document.getElementById('project-chat-send')?.addEventListener('click',sendProjectMessage);
    document.getElementById('project-chat-input')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendProjectMessage();});
    document.getElementById('submit-timeline-comment')?.addEventListener('click',addTimelineComment);
    document.getElementById('chat-open-project-btn')?.addEventListener('click',()=>{switchTab('project');});
    document.getElementById('stem-upload-sim')?.addEventListener('click',()=>{document.getElementById('cc-upload-stem')?.click();});
  }
  window.ccBackend={refresh,loadProfiles,loadBulletins,loadDirectMessages,loadProjects};
  document.addEventListener('DOMContentLoaded',async()=>{
    bindEvents();
    if(window.ccAuthReady) await window.ccAuthReady;
    if(!currentId())return;
    await refresh();
    try {
      client().channel('cc-live-messages').on('postgres_changes',{event:'*',schema:'public',table:'messages'},()=>{loadDirectMessages();if(activeProjectId)loadProjectMessages(activeProjectId);}).subscribe();
      client().channel('cc-live-bulletins').on('postgres_changes',{event:'*',schema:'public',table:'bulletins'},()=>loadBulletins()).subscribe();
      client().channel('cc-live-profiles').on('postgres_changes',{event:'*',schema:'public',table:'profiles'},()=>loadProfiles()).subscribe();
    } catch(e) { console.warn('Realtime unavailable; manual refresh remains available.',e); }
  });
})();