/* ==========================================================================
   CollabChord Mobile - Application State, Swipe Matcher, & Synth Engine
   ========================================================================== */

// --- Global Application State ---
const state = {
  currentUser: null,
  activeTab: 'matcher', // matcher, discover, project, messages, profile
  currentPlayingTrack: null,
  isPlaying: false,
  isMixerPlaying: false,
  
  // Simulated Creators (Industry Database)
  creators: [
    {
      id: 'marcus_keys',
      name: "Marcus 'Keys' Miller",
      avatar: 'https://raw.githubusercontent.com/ianosebe/CollabChord/master/assets/producer.jpg',
      skills: ['Producer', 'Keyboardist'],
      genres: ['Synthwave', 'Electronic', 'Hip-Hop'],
      bio: "Keyboardist and hardware synth collector. I produce high-energy synthwave, retro-cyberpunk tracks, and hip-hop beats. Looking for vocalists to write hook melodies and session guitarists.",
      needs: ['Vocalist', 'Guitarist'],
      influence: "12.4k plays",
      tracks: [
        { id: 'track_keys_1', title: 'Neon Drive', duration: '1:04', bpm: 115, style: 'synthwave', description: 'Retro 80s drive synth with fat bass and sharp synth snares.' },
        { id: 'track_keys_2', title: 'Midnight Lounge', duration: '1:20', bpm: 90, style: 'lofi', description: 'Chilled lofi hip hop beat with electric piano chords.' }
      ],
      workingStyle: 'Remote & Hybrid',
      commitment: 'EP Project',
      location: 'Los Angeles, CA'
    },
    {
      id: 'elena_rostova',
      name: "Elena Rostova",
      avatar: 'https://raw.githubusercontent.com/ianosebe/CollabChord/master/assets/vocalist.jpg',
      skills: ['Vocalist', 'Songwriter'],
      genres: ['Pop', 'R&B', 'Lo-Fi'],
      bio: "Songwriter and indie vocalist. I specialize in airy vocals, rich stacks, and melodic hooks. I need a producer to help co-create my upcoming ambient pop EP.",
      needs: ['Producer', 'Audio Engineer'],
      influence: "35.2k plays",
      tracks: [
        { id: 'track_elena_1', title: 'Dreamy Skies', duration: '1:12', bpm: 95, style: 'pop', description: 'Smooth, atmospheric ambient pop ballad with soft keyboard tones.' },
        { id: 'track_elena_2', title: 'Coffee & Rain', duration: '1:04', bpm: 85, style: 'lofi', description: 'Warm chillhop acoustic track with vocal melodies.' }
      ],
      workingStyle: 'Remote Only',
      commitment: 'Single Collaboration',
      location: 'Berlin, DE'
    },
    {
      id: 'dan_carter',
      name: "Dan Carter",
      avatar: 'https://raw.githubusercontent.com/ianosebe/CollabChord/master/assets/guitarist.jpg',
      skills: ['Guitarist', 'Audio Engineer'],
      genres: ['Rock', 'Cinematic', 'Electronic'],
      bio: "Guitarist and mix engineer. Heavy riffs, soaring solos, and clean mixes. Looking to collaborate on cinematic rock or electronic-rock hybrid projects.",
      needs: ['Vocalist', 'Keyboardist', 'Producer'],
      influence: "8.1k plays",
      tracks: [
        { id: 'track_dan_1', title: 'Thunderstorm', duration: '0:56', bpm: 120, style: 'rock', description: 'Energetic, detuned rhythm guitars and punching drums.' }
      ],
      workingStyle: 'In-Person Preferred',
      commitment: 'Jam Sessions',
      location: 'Austin, TX'
    },
    {
      id: 'chloe_vance',
      name: "Chloe Vance",
      avatar: 'https://raw.githubusercontent.com/ianosebe/CollabChord/master/assets/logo.jpg', // Fallback
      skills: ['Songwriter', 'Audio Engineer'],
      genres: ['Cinematic', 'Ambient', 'Rock'],
      bio: "Sound designer and soundscape composer. I design deep cinematic textures, reverbs, and slow-building instrumentals. Looking for vocalists and beatmakers.",
      needs: ['Producer', 'Vocalist'],
      influence: "15k plays",
      tracks: [
        { id: 'track_chloe_1', title: 'Echoes of Silence', duration: '1:28', bpm: 75, style: 'ambient', description: 'Slow ambient synth pad swell with long reverb trails.' }
      ],
      workingStyle: 'Remote Only',
      commitment: 'Commercial Licensing',
      location: 'London, UK'
    }
  ],

  // Open Collaboration Bulletin Board postings
  bulletins: [
    {
      id: 'bull_1',
      author: "Marcus 'Keys' Miller",
      text: "Need a session guitarist who can record clean rhythm tracks for an upcoming 80s synthwave EP. Sending midi tracks.",
      roleWanted: "Guitarist",
      genre: "Synthwave",
      date: "2h ago",
      creatorId: "marcus_keys"
    },
    {
      id: 'bull_2',
      author: "Elena Rostova",
      text: "Looking for a mixing engineer with experience in acoustic/ambient vocals to polish a 3-track EP. Stems are ready.",
      roleWanted: "Audio Engineer",
      genre: "Lo-Fi",
      date: "5h ago",
      creatorId: "elena_rostova"
    },
    {
      id: 'bull_3',
      author: "Dan Carter",
      text: "Need a vocalist (preferably rock voice) for a high-intensity action game theme track. Hit me up!",
      roleWanted: "Vocalist",
      genre: "Rock",
      date: "1d ago",
      creatorId: "dan_carter"
    }
  ],

  // Messaging System Database
  chats: {
    'marcus_keys': [
      { sender: 'marcus_keys', text: "Hey! Saw your music profile. We've got a killer match percentage. Love your style.", time: "10:30 AM" },
      { sender: 'marcus_keys', text: "I uploaded the stems for 'Summer Chill Vibes' to our project space. Let me know what you think of the synth line!", time: "10:31 AM" }
    ],
    'elena_rostova': [
      { sender: 'elena_rostova', text: "Hello! I'm planning my next single. Do you have any beats in the Pop/Lo-fi style ready?", time: "Yesterday" }
    ],
    'dan_carter': [],
    'chloe_vance': []
  },
  
  activeInboxCreatorId: null,

  // Active collaboration Project Space data
  activeProject: {
    id: 'proj_keys',
    trackName: "Summer Chill Vibes",
    collaboratorId: "marcus_keys",
    collaboratorName: "Marcus Keys",
    stems: {
      drums: { volume: 80, muted: false, solo: false },
      bass: { volume: 70, muted: false, solo: false },
      melody: { volume: 80, muted: false, solo: false }
    },
    timelineComments: [
      { id: 'tc1', time: '0:12', percent: 20, author: "Elena", body: "Drums should hit harder here. Can we EQ the sub-bass?" },
      { id: 'tc2', time: '0:33', percent: 55, author: "Marcus Keys", body: "Fabulous transition, love the bass drop! Synth needs minor reverb." }
    ]
  }
};

// --- Web Audio Synthesizer Class (The Engine) ---
class WebAudioSynthEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isPlayingMixer = false;
    
    // Web Audio Routing Nodes
    this.masterGain = null;
    this.analyser = null;
    
    // Synthesizer variables
    this.tempo = 100;
    this.nextNoteTime = 0.0;
    this.current16thNote = 0;
    this.schedulerTimerId = null;
    this.preset = 'synthwave'; // synthwave, lofi, pop, rock, ambient
    
    // Stem Mixer Nodes
    this.stemGains = {
      drums: null,
      bass: null,
      melody: null
    };
    
    // Waveform simulation
    this.waveformTimelinePosition = 0;
    this.timelineIntervalId = null;
  }

  init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Setup Master Nodes
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    
    // Setup Stems Gain Nodes
    this.stemGains.drums = this.ctx.createGain();
    this.stemGains.bass = this.ctx.createGain();
    this.stemGains.melody = this.ctx.createGain();
    
    this.stemGains.drums.connect(this.masterGain);
    this.stemGains.bass.connect(this.masterGain);
    this.stemGains.melody.connect(this.masterGain);
  }

  setPreset(style, bpm) {
    this.preset = style;
    this.tempo = bpm || 100;
  }

  updateStemMixerStates(stems) {
    if (!this.ctx) return;
    
    const anySolo = Object.values(stems).some(s => s.solo);

    for (const key of ['drums', 'bass', 'melody']) {
      const stem = stems[key];
      const gainNode = this.stemGains[key];
      
      if (!gainNode) continue;

      if (stem.muted) {
        gainNode.gain.value = 0;
      } else if (anySolo && !stem.solo) {
        gainNode.gain.value = 0;
      } else {
        gainNode.gain.value = stem.volume / 100;
      }
    }
  }

  scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.advanceNote();
    }
  }

  advanceNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    const secondsPer16th = secondsPerBeat / 4;
    this.nextNoteTime += secondsPer16th;
    this.current16thNote = (this.current16thNote + 1) % 64; 
  }

  scheduleNote(step, time) {
    if (this.isPlayingMixer) {
      this.playDrumsPattern(step, time, this.stemGains.drums);
      this.playBassPattern(step, time, this.stemGains.bass);
      this.playMelodyPattern(step, time, this.stemGains.melody);
    } else {
      this.playSoloTrackPattern(step, time, this.masterGain);
    }
  }

  playDrumsPattern(step, time, destGain) {
    const beat = step % 16;
    if (beat === 0 || beat === 8 || (this.preset === 'rock' && (beat === 6 || beat === 14))) {
      this.synthKick(time, destGain);
    }
    if (beat === 4 || beat === 12) {
      this.synthSnare(time, destGain);
    }
    if (beat % 2 === 0 && this.preset !== 'ambient') {
      this.synthHiHat(time, destGain);
    }
  }

  playBassPattern(step, time, destGain) {
    const beat = step % 16;
    const bar = Math.floor(step / 16) % 4;
    const roots = [110.00, 87.31, 130.81, 97.99]; // A2, F2, C3, G2
    const root = roots[bar];
    
    let playNote = false;
    let freq = root;
    
    if (this.preset === 'synthwave') {
      playNote = step % 2 === 0;
      if (step % 8 === 4) freq = root * 2;
    } else if (this.preset === 'lofi') {
      playNote = [0, 3, 6, 8, 11].includes(beat);
    } else {
      playNote = [0, 4, 8, 12].includes(beat);
    }
    
    if (playNote) {
      this.synthBassNote(freq, time, 0.15, destGain);
    }
  }

  playMelodyPattern(step, time, destGain) {
    const beat = step % 16;
    const bar = Math.floor(step / 16) % 4;
    
    // Notes in chord progression: Am, F, C, G
    const chords = [
      [220.00, 261.63, 329.63], // A3, C4, E4
      [174.61, 220.00, 261.63], // F3, A3, C4
      [261.63, 329.63, 392.00], // C4, E4, G4
      [196.00, 246.94, 293.66]  // G3, B3, D4
    ];
    
    const notes = chords[bar];
    let playNote = false;
    let freqIndex = 0;
    
    if (this.preset === 'synthwave') {
      playNote = [4, 6, 12, 14].includes(beat);
      freqIndex = (step % 3);
    } else if (this.preset === 'lofi' || this.preset === 'ambient') {
      playNote = beat === 2; // slow swells
      freqIndex = 1;
    } else {
      playNote = [0, 8].includes(beat);
      freqIndex = 2;
    }
    
    if (playNote) {
      const freq = notes[freqIndex];
      this.synthMelodyNote(freq, time, this.preset === 'ambient' ? 1.0 : 0.4, destGain);
    }
  }

  playSoloTrackPattern(step, time, destGain) {
    this.playDrumsPattern(step, time, destGain);
    this.playBassPattern(step, time, destGain);
    this.playMelodyPattern(step, time, destGain);
  }

  synthKick(time, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(dest);
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.25);
    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
    osc.start(time);
    osc.stop(time + 0.26);
  }

  synthHiHat(time, dest) {
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 8000;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    source.start(time);
    source.stop(time + 0.05);
  }

  synthSnare(time, dest) {
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);
    
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    oscGain.gain.setValueAtTime(0.18, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
    
    osc.connect(oscGain);
    oscGain.connect(dest);
    noise.start(time);
    noise.stop(time + 0.12);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  synthBassNote(freq, time, duration, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = this.preset === 'rock' ? 'sawtooth' : 'triangle';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.preset === 'synthwave' ? 400 : 200, time);
    filter.frequency.exponentialRampToValueAtTime(80, time + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.frequency.setValueAtTime(freq / 2, time); 
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    
    osc.start(time);
    osc.stop(time + duration);
  }

  synthMelodyNote(freq, time, duration, dest) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    if (this.preset === 'rock') {
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc2.detune.value = 16;
    } else if (this.preset === 'ambient') {
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc2.detune.value = 4;
    } else {
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc2.detune.value = 8;
    }
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);
    
    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc1.start(time);
    osc1.stop(time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  }

  startPlaying() {
    this.init();
    if (this.isPlaying || this.isPlayingMixer) this.stopPlaying();
    
    this.ctx.resume();
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.current16thNote = 0;
    
    this.schedulerTimerId = setInterval(() => this.scheduler(), 25);
  }

  startPlayingMixer() {
    this.init();
    if (this.isPlaying || this.isPlayingMixer) this.stopPlaying();
    
    this.ctx.resume();
    this.isPlayingMixer = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.current16thNote = 0;
    this.preset = 'synthwave'; 
    this.tempo = 110;
    
    this.schedulerTimerId = setInterval(() => this.scheduler(), 25);
    
    this.waveformTimelinePosition = 0;
    this.timelineIntervalId = setInterval(() => {
      this.waveformTimelinePosition += 0.5;
      if (this.waveformTimelinePosition > 100) this.waveformTimelinePosition = 0;
      
      const scrubber = document.getElementById('mob-waveform-scrubber');
      if (scrubber) scrubber.style.left = `${this.waveformTimelinePosition}%`;
      
      const totalSec = Math.floor((this.waveformTimelinePosition / 100) * 64);
      
      const elapsedMin = Math.floor(totalSec / 60);
      const elapsedSec = String(totalSec % 60).padStart(2, '0');
      
      const timeMarker = document.getElementById('mob-mixer-time');
      if (timeMarker) timeMarker.textContent = `${elapsedMin}:${elapsedSec}`;
      
      // Update sheets & mini player scrubbers if active
      const miniProgress = document.getElementById('mini-player-progress');
      if (miniProgress) miniProgress.style.width = `${this.waveformTimelinePosition}%`;
      
      const sheetProgress = document.getElementById('sheet-progress-bar');
      if (sheetProgress) sheetProgress.style.width = `${this.waveformTimelinePosition}%`;
      
      const sheetElapsed = document.getElementById('sheet-time-elapsed');
      if (sheetElapsed) sheetElapsed.textContent = `${elapsedMin}:${elapsedSec}`;
      
    }, 100);
  }

  stopPlaying() {
    if (this.schedulerTimerId) {
      clearInterval(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }
    if (this.timelineIntervalId) {
      clearInterval(this.timelineIntervalId);
      this.timelineIntervalId = null;
    }
    this.isPlaying = false;
    this.isPlayingMixer = false;
  }
}

// Instantiate Global Synthesizer
const audioEngine = new WebAudioSynthEngine();

// --- Realtime Clock Ticker ---
function startClock() {
  const clockEl = document.getElementById('status-time');
  const tick = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${h}:${m}`;
  };
  tick();
  setInterval(tick, 1000);
}

// --- Notification Toast Helper ---
function showToast(text, duration = 3000) {
  const container = document.getElementById('mob-toast-box');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'mob-toast';
  toast.innerHTML = `<i data-lucide="info" size="14"></i><span>${text}</span>`;
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- Card Matching Calculator ---
function calculateMatchPercent(creator) {
  if (!state.currentUser) return 50; // guest base
  
  let score = 30; // base floor
  
  // 1. Skill overlap check:
  // Does their skillset contain what the USER needs?
  const matchedNeeds = creator.skills.some(s => state.currentUser.needs.includes(s));
  if (matchedNeeds) score += 30;
  
  // Does the USER's skills contain what they need?
  const matchedTheirNeeds = state.currentUser.skills.some(s => creator.needs.includes(s));
  if (matchedTheirNeeds) score += 20;
  
  // 2. Genre overlap:
  const sharedGenres = creator.genres.filter(g => state.currentUser.genres.includes(g));
  score += sharedGenres.length * 8;
  
  return Math.min(99, score);
}

// --- UI Rendering Helpers ---

// Render Browse Directory List
function renderDiscoverCreatorsList() {
  const container = document.getElementById('discover-creators-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Filter active states
  const roleFilter = document.getElementById('mob-filter-role').value;
  const genreFilter = document.getElementById('mob-filter-genre').value;
  const query = document.getElementById('mobile-search-input').value.toLowerCase();
  
  // Sort creators by match percent
  const matchedList = state.creators
    .map(c => ({ ...c, matchPercent: calculateMatchPercent(c) }))
    .sort((a,b) => b.matchPercent - a.matchPercent);
    
  let matchesCount = 0;
  
  matchedList.forEach(creator => {
    // Filter check
    if (roleFilter !== 'all' && !creator.skills.includes(roleFilter)) return;
    if (genreFilter !== 'all' && !creator.genres.includes(genreFilter)) return;
    
    if (query) {
      const matchName = creator.name.toLowerCase().includes(query);
      const matchSkills = creator.skills.some(s => s.toLowerCase().includes(query));
      const matchGenres = creator.genres.some(g => g.toLowerCase().includes(query));
      if (!matchName && !matchSkills && !matchGenres) return;
    }
    
    matchesCount++;
    
    const card = document.createElement('div');
    card.className = 'creator-list-card';
    card.dataset.id = creator.id;
    card.innerHTML = `
      <img src="${creator.avatar}" alt="${creator.name}" class="creator-list-avatar">
      <div class="creator-list-info">
        <h4>${creator.name}</h4>
        <p class="creator-list-sub">${creator.skills.join(' • ')} • ${creator.location}</p>
      </div>
      <div class="creator-list-right">
        <span class="creator-list-match">${creator.matchPercent}% Match</span>
        <button class="icon-btn btn-sm list-play-btn" data-track-id="${creator.tracks[0].id}"><i data-lucide="play" size="12"></i></button>
      </div>
    `;
    
    // Add Click listener to show details sheets
    card.addEventListener('click', (e) => {
      if (e.target.closest('.list-play-btn')) return;
      openAnalyzerSheet(creator);
    });
    
    // Play preview track
    card.querySelector('.list-play-btn').addEventListener('click', () => {
      playPreviewTrack(creator.tracks[0], creator);
    });
    
    container.appendChild(card);
  });
  
  lucide.createIcons();
  document.getElementById('discover-matches-count').textContent = `${matchesCount} Match${matchesCount !== 1 ? 'es' : ''}`;
}

// Render Conversations Inbox Lists
function renderConversationsList() {
  const container = document.getElementById('mob-inbox-conversations');
  if (!container) return;
  
  container.innerHTML = '';
  
  const creatorMap = {};
  state.creators.forEach(c => { creatorMap[c.id] = c; });
  
  Object.keys(state.chats).forEach(creatorId => {
    const chatArr = state.chats[creatorId];
    const creator = creatorMap[creatorId];
    if (!creator) return;
    
    // Default preview if empty
    let lastMsg = "Tap to pitch a project splits negotiation...";
    let lastTime = "";
    
    if (chatArr.length > 0) {
      const last = chatArr[chatArr.length - 1];
      lastMsg = last.sender === 'me' ? `You: ${last.text}` : last.text;
      lastTime = last.time;
    }
    
    const matchVal = calculateMatchPercent(creator);
    
    const row = document.createElement('div');
    row.className = 'inbox-item-row';
    row.dataset.id = creatorId;
    row.innerHTML = `
      <img src="${creator.avatar}" alt="${creator.name}" class="inbox-avatar">
      <div class="inbox-item-content">
        <div class="inbox-item-header">
          <h3>${creator.name}</h3>
          <span class="inbox-item-time">${lastTime}</span>
        </div>
        <p class="inbox-item-msg">${lastMsg}</p>
      </div>
      <div class="inbox-item-right">
        <span class="inbox-match-badge">${matchVal}% Match</span>
        ${chatArr.length > 0 && chatArr[chatArr.length - 1].sender !== 'me' ? `<span class="inbox-dot"></span>` : ''}
      </div>
    `;
    
    row.addEventListener('click', () => {
      openChatPane(creatorId);
    });
    
    container.appendChild(row);
  });
}

// Render Chat Messages
function renderChatMessages(creatorId) {
  const container = document.getElementById('mob-chat-messages');
  if (!container) return;
  
  container.innerHTML = '';
  
  const messages = state.chats[creatorId] || [];
  
  if (messages.length === 0) {
    container.innerHTML = `
      <div class="text-center p-4" style="color: var(--color-text-dimmed); font-size: 11px;">
        <i data-lucide="send" size="24" style="margin-bottom: 8px;"></i>
        <p>No messages yet. Send a collaboration proposal message to start matching splits!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  messages.forEach(msg => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.sender === 'me' ? 'me' : 'partner'}`;
    bubble.textContent = msg.text;
    container.appendChild(bubble);
  });
  
  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Render Stem comments list
function renderTimelineComments() {
  const container = document.getElementById('mob-comments-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  state.activeProject.timelineComments.forEach(c => {
    const row = document.createElement('div');
    row.className = 'comment-row-card';
    row.innerHTML = `
      <span class="comment-row-time">${c.time}</span>
      <div class="comment-row-body">
        <strong>${c.author}:</strong> ${c.body}
      </div>
    `;
    container.appendChild(row);
  });
}

// --- Waveform Canvas Render ---
function drawWaveformCanvas() {
  const canvas = document.getElementById('mob-project-waveform');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  
  ctx.clearRect(0, 0, w, h);
  
  const bars = 80;
  const spacing = 2;
  const barW = (w / bars) - spacing;
  
  const heightFn = (i) => {
    const s = Math.sin(i * 0.08) * 0.35 + Math.sin(i * 0.3) * 0.25;
    return Math.max(0.1, Math.abs(s));
  };
  
  for (let i = 0; i < bars; i++) {
    const heightPercent = heightFn(i);
    const barH = heightPercent * h * 0.75;
    const x = i * (barW + spacing);
    const y = (h - barH) / 2;
    
    const fillPercent = (x / w) * 100;
    if (fillPercent < audioEngine.waveformTimelinePosition && audioEngine.isPlayingMixer) {
      ctx.fillStyle = 'var(--color-secondary)';
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
    }
    
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 1.5);
    ctx.fill();
  }
}

// Real-time mini audio spectrum visualizer in player sheet
let renderingVisualsId = null;
function setupPlayerVisuals() {
  const canvas = document.getElementById('sheet-mini-visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  if (renderingVisualsId) cancelAnimationFrame(renderingVisualsId);
  
  const renderFrame = () => {
    renderingVisualsId = requestAnimationFrame(renderFrame);
    
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, w, h);
    
    if (!audioEngine.analyser || (!audioEngine.isPlaying && !audioEngine.isPlayingMixer)) {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      return;
    }
    
    const bins = audioEngine.analyser.frequencyBinCount;
    const frequencies = new Uint8Array(bins);
    audioEngine.analyser.getByteFrequencyData(frequencies);
    
    const barW = (w / bins) * 1.5;
    let x = 0;
    
    for (let i = 0; i < bins; i++) {
      const bh = (frequencies[i] / 255) * h * 0.8;
      
      const r = 138 + (i * 2);
      const g = 43 + (i * 3);
      const b = 255;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      
      ctx.fillRect(x, h - bh, barW - 0.5, bh);
      x += barW;
    }
  };
  
  renderFrame();
}

// --- Player Engine Triggers ---

function playPreviewTrack(track, creator) {
  // Update state
  state.currentPlayingTrack = track;
  
  // Set synthesizer preset
  audioEngine.setPreset(track.style || 'synthwave', track.bpm || 100);
  audioEngine.startPlaying();
  
  state.isPlaying = true;
  state.isMixerPlaying = false;
  
  // Update UI Elements
  updatePlayerUI(track, creator);
  showToast(`Playing ${track.title} preview by ${creator.name}`);
}

function updatePlayerUI(track, creator) {
  // Set titles
  document.getElementById('mini-player-title').textContent = track.title;
  document.getElementById('mini-player-artist').textContent = creator.name;
  
  document.getElementById('sheet-track-title').textContent = track.title;
  document.getElementById('sheet-track-artist').textContent = creator.name;
  
  // Calculate match percentage
  const match = calculateMatchPercent(creator);
  const badgeMini = document.getElementById('mini-player-match-wrap');
  const badgeMiniVal = document.getElementById('mini-player-match-badge');
  badgeMini.classList.remove('hidden');
  badgeMiniVal.textContent = `${match}%`;
  
  const badgeSheet = document.getElementById('sheet-match-wrap');
  const badgeSheetVal = document.getElementById('sheet-match-badge');
  badgeSheet.classList.remove('hidden');
  badgeSheetVal.textContent = `${match}% Match`;
  
  // Update cover art
  const coverMini = document.getElementById('mini-player-cover');
  const coverSheet = document.getElementById('sheet-cover-art');
  coverMini.innerHTML = `<img src="${creator.avatar}" alt="Avatar">`;
  coverSheet.innerHTML = `<img src="${creator.avatar}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
  
  // Adjust play icons
  const iconMini = document.getElementById('mini-player-btn-play').querySelector('i');
  iconMini.setAttribute('data-lucide', 'pause');
  
  const iconSheet = document.getElementById('sheet-play-icon');
  iconSheet.setAttribute('data-lucide', 'pause');
  
  // Spinning animations
  coverSheet.classList.add('playing');
  
  // Duration display
  document.getElementById('sheet-time-duration').textContent = track.duration;
  
  // Reset scrubber lines
  document.getElementById('mini-player-progress').style.width = '0%';
  document.getElementById('sheet-progress-bar').style.width = '0%';
  document.getElementById('sheet-time-elapsed').textContent = '0:00';
  
  lucide.createIcons();
}

function toggleGlobalPlayback() {
  if (!state.currentPlayingTrack && !state.isMixerPlaying) {
    // default play Marcus keys track if nothing is active
    const creator = state.creators[0];
    playPreviewTrack(creator.tracks[0], creator);
    return;
  }
  
  if (state.isPlaying || state.isMixerPlaying) {
    // Pause
    audioEngine.stopPlaying();
    state.isPlaying = false;
    state.isMixerPlaying = false;
    
    // Icons edit
    document.getElementById('mini-player-btn-play').querySelector('i').setAttribute('data-lucide', 'play');
    document.getElementById('sheet-play-icon').setAttribute('data-lucide', 'play');
    document.getElementById('sheet-cover-art').classList.remove('playing');
    document.getElementById('mob-mixer-play-btn').innerHTML = `<i data-lucide="play" size="16"></i> Play Mix`;
    document.getElementById('mob-project-waveform').closest('.project-info-card').querySelector('.project-pulse-disc').classList.remove('playing');
  } else {
    // Play back
    if (state.currentPlayingTrack) {
      audioEngine.startPlaying();
      state.isPlaying = true;
      document.getElementById('sheet-cover-art').classList.add('playing');
    } else {
      audioEngine.startPlayingMixer();
      state.isMixerPlaying = true;
      document.getElementById('mob-mixer-play-btn').innerHTML = `<i data-lucide="pause" size="16"></i> Pause Mix`;
      document.getElementById('mob-project-waveform').closest('.project-info-card').querySelector('.project-pulse-disc').classList.add('playing');
    }
    document.getElementById('mini-player-btn-play').querySelector('i').setAttribute('data-lucide', 'pause');
    document.getElementById('sheet-play-icon').setAttribute('data-lucide', 'pause');
  }
  lucide.createIcons();
}

// --- Tinder swipe deck builder ---

let activeDragCard = null;
let dragStartX = 0;
let dragStartY = 0;
let dragCurrentX = 0;
let dragCurrentY = 0;
let isDraggingCard = false;

function buildSwipeDeck() {
  const deck = document.getElementById('swipe-deck');
  if (!deck) return;
  
  deck.innerHTML = '';
  document.querySelector('.deck-empty-state').classList.add('hidden');
  
  // Get creators not yet swiped
  state.creators.forEach((creator, index) => {
    const card = document.createElement('div');
    card.className = 'swipe-card';
    card.dataset.id = creator.id;
    
    const match = calculateMatchPercent(creator);
    
    card.innerHTML = `
      <!-- Stamps -->
      <div class="card-stamp card-stamp-like">LIKE</div>
      <div class="card-stamp card-stamp-nope">NOPE</div>
      
      <div class="swipe-card-media">
        <img src="${creator.avatar}" alt="${creator.name}" class="card-bg-img">
        <div class="card-gradient-overlay"></div>
        <span class="card-match-badge">${match}% Match</span>
        <button class="icon-btn card-audio-preview play-card-track" data-track-id="${creator.tracks[0].id}">
          <i data-lucide="play" size="18" fill="currentColor"></i>
        </button>
      </div>
      <div class="swipe-card-info">
        <div class="card-title-row">
          <div>
            <h3>${creator.name}</h3>
            <span class="card-location"><i data-lucide="map-pin" size="10"></i> ${creator.location}</span>
          </div>
          <span class="card-influence">${creator.influence}</span>
        </div>
        
        <div class="card-skills-row">
          ${creator.skills.map(s => `<span class="chip chip-skill">${s}</span>`).join('')}
          ${creator.genres.slice(0,2).map(g => `<span class="chip chip-genre">${g}</span>`).join('')}
          ${creator.needs.map(n => `<span class="chip chip-need">Need: ${n}</span>`).join('')}
        </div>
        <p class="card-bio">${creator.bio}</p>
      </div>
    `;
    
    // Play button on card preview
    card.querySelector('.play-card-track').addEventListener('click', (e) => {
      e.stopPropagation();
      playPreviewTrack(creator.tracks[0], creator);
    });
    
    deck.appendChild(card);
  });
  
  lucide.createIcons();
  setupCardGestures();
}

function setupCardGestures() {
  const cards = document.querySelectorAll('.swipe-card');
  if (cards.length === 0) {
    document.querySelector('.deck-empty-state').classList.remove('hidden');
    return;
  }
  
  // Attach gesture to the TOP card in the deck (last child)
  const topCard = cards[cards.length - 1];
  
  const dragStart = (e) => {
    if (e.target.closest('.icon-btn')) return; // ignore play button
    
    activeDragCard = topCard;
    isDraggingCard = true;
    
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    dragStartX = clientX;
    dragStartY = clientY;
    
    activeDragCard.style.transition = 'none';
  };
  
  const dragMove = (e) => {
    if (!isDraggingCard || !activeDragCard) return;
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    dragCurrentX = clientX - dragStartX;
    dragCurrentY = clientY - dragStartY;
    
    const rot = dragCurrentX / 15;
    activeDragCard.style.transform = `translate(${dragCurrentX}px, ${dragCurrentY}px) rotate(${rot}deg)`;
    
    // Stamps opacity
    const likeStamp = activeDragCard.querySelector('.card-stamp-like');
    const nopeStamp = activeDragCard.querySelector('.card-stamp-nope');
    
    if (dragCurrentX > 20) {
      likeStamp.style.opacity = Math.min(1, dragCurrentX / 80);
      nopeStamp.style.opacity = 0;
    } else if (dragCurrentX < -20) {
      nopeStamp.style.opacity = Math.min(1, -dragCurrentX / 80);
      likeStamp.style.opacity = 0;
    } else {
      likeStamp.style.opacity = 0;
      nopeStamp.style.opacity = 0;
    }
  };
  
  const dragEnd = () => {
    if (!isDraggingCard || !activeDragCard) return;
    isDraggingCard = false;
    
    activeDragCard.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)';
    
    const swipeThreshold = 110;
    if (dragCurrentX > swipeThreshold) {
      // Swipe Right (LIKE)
      swipeCardRight(activeDragCard);
    } else if (dragCurrentX < -swipeThreshold) {
      // Swipe Left (NOPE)
      swipeCardLeft(activeDragCard);
    } else {
      // Return to center
      activeDragCard.style.transform = 'translate(0, 0) rotate(0)';
      activeDragCard.querySelector('.card-stamp-like').style.opacity = 0;
      activeDragCard.querySelector('.card-stamp-nope').style.opacity = 0;
    }
  };
  
  // Mouse listeners
  topCard.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);
  
  // Touch listeners
  topCard.addEventListener('touchstart', dragStart);
  window.addEventListener('touchmove', dragMove);
  window.addEventListener('touchend', dragEnd);
}

function swipeCardRight(card) {
  card.style.transform = `translate(${window.innerWidth}px, ${dragCurrentY}px) rotate(${dragCurrentX / 10}deg)`;
  card.style.opacity = 0;
  
  const creatorId = card.dataset.id;
  const creator = state.creators.find(c => c.id === creatorId);
  
  setTimeout(() => {
    card.remove();
    // Trigger sound match pop-up if skills match
    if (creator) {
      showMatchPopup(creator);
    }
    setupCardGestures();
  }, 350);
}

function swipeCardLeft(card) {
  card.style.transform = `translate(${-window.innerWidth}px, ${dragCurrentY}px) rotate(${dragCurrentX / 10}deg)`;
  card.style.opacity = 0;
  
  setTimeout(() => {
    card.remove();
    setupCardGestures();
  }, 350);
}

function showMatchPopup(creator) {
  const overlay = document.getElementById('match-popup-overlay');
  document.getElementById('matched-artist-name').textContent = creator.name;
  document.getElementById('matched-artist-avatar').src = creator.avatar;
  
  overlay.classList.remove('hidden');
  
  // Auto add proposal connection in chat database
  if (state.chats[creator.id].length === 0) {
    state.chats[creator.id].push({
      sender: creator.id,
      text: `Hey! Thanks for connecting. I noticed our music credentials align on ${creator.genres.filter(g => state.currentUser.genres.includes(g)).join(', ') || 'beats'}. What are you working on?`,
      time: "Just now"
    });
  }
}

// --- Sheets Trigger Panels ---

function openAnalyzerSheet(creator) {
  const sheet = document.getElementById('analyzer-sheet');
  sheet.classList.add('active');
  
  const match = calculateMatchPercent(creator);
  document.getElementById('analyzer-match-percentage').textContent = `${match}%`;
  document.getElementById('analyzer-partner-name').textContent = creator.name;
  
  // Set radial progress stroke offset
  const circle = document.getElementById('analyzer-match-ring');
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (match / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  
  // Breakdown scores calculation
  const skillsScore = creator.skills.some(s => state.currentUser.needs.includes(s)) ? 90 : 35;
  const genresCount = creator.genres.filter(g => state.currentUser.genres.includes(g)).length;
  const genresScore = genresCount === 0 ? 30 : (genresCount === 1 ? 70 : 95);
  const needsScore = state.currentUser.skills.some(s => creator.needs.includes(s)) ? 90 : 45;
  
  document.getElementById('analyzer-val-skills').textContent = `${skillsScore}%`;
  document.getElementById('analyzer-fill-skills').style.width = `${skillsScore}%`;
  
  document.getElementById('analyzer-val-genres').textContent = `${genresScore}%`;
  document.getElementById('analyzer-fill-genres').style.width = `${genresScore}%`;
  
  document.getElementById('analyzer-val-needs').textContent = `${needsScore}%`;
  document.getElementById('analyzer-fill-needs').style.width = `${needsScore}%`;
  
  document.getElementById('analyzer-engine-text').innerHTML = `
    Overlap details: <strong>${creator.name}</strong> offers <strong>${creator.skills.join(', ')}</strong> matching your search parameters. 
    You both share interest in <strong>${creator.genres.filter(g => state.currentUser.genres.includes(g)).join(', ') || 'beats'}</strong> music.
  `;
}

function openChatPane(creatorId) {
  state.activeInboxCreatorId = creatorId;
  const pane = document.getElementById('mob-chat-pane');
  const creator = state.creators.find(c => c.id === creatorId);
  
  if (creator) {
    document.getElementById('mob-chat-partner-name').textContent = creator.name;
    document.getElementById('mob-chat-partner-avatar').src = creator.avatar;
    renderChatMessages(creatorId);
    pane.classList.add('active');
  }
}

function closeChatPane() {
  document.getElementById('mob-chat-pane').classList.remove('active');
  state.activeInboxCreatorId = null;
  renderConversationsList();
}

function sendChatMessage() {
  const input = document.getElementById('mob-chat-input');
  const txt = input.value.trim();
  if (!txt || !state.activeInboxCreatorId) return;
  
  // Append user message
  state.chats[state.activeInboxCreatorId].push({
    sender: 'me',
    text: txt,
    time: "Just now"
  });
  
  input.value = '';
  renderChatMessages(state.activeInboxCreatorId);
  
  // Simulated partner reply after 1.5s
  const partnerId = state.activeInboxCreatorId;
  setTimeout(() => {
    if (state.activeInboxCreatorId === partnerId) {
      state.chats[partnerId].push({
        sender: partnerId,
        text: "That sounds like a vibe! I'm down to review splits or Jam in the Project Space mixer. Let's record stems.",
        time: "Just now"
      });
      renderChatMessages(partnerId);
      showToast(`New message from ${state.creators.find(c => c.id === partnerId).name}`);
    }
  }, 1500);
}

// Add Timeline comments note
function saveWaveformComment() {
  const input = document.getElementById('comment-sheet-input');
  const txt = input.value.trim();
  if (!txt) return;
  
  const pct = audioEngine.waveformTimelinePosition;
  const min = Math.floor(((pct / 100) * 64) / 60);
  const sec = String(Math.floor(((pct / 100) * 64) % 60)).padStart(2, '0');
  
  const newComment = {
    id: 'tc_' + Date.now(),
    time: `${min}:${sec}`,
    percent: pct,
    author: state.currentUser ? state.currentUser.name : "Guest",
    body: txt
  };
  
  state.activeProject.timelineComments.push(newComment);
  
  // Render comment dot pin overlay
  const waveArea = document.querySelector('.mobile-waveform-area');
  const pin = document.createElement('div');
  pin.className = 'mob-comment-pin';
  pin.style.left = `${pct}%`;
  pin.dataset.comment = `${newComment.author}: ${txt}`;
  pin.dataset.time = newComment.time;
  
  pin.addEventListener('click', () => {
    showToast(`Note at ${newComment.time} - ${txt}`, 4000);
  });
  
  waveArea.appendChild(pin);
  
  input.value = '';
  document.getElementById('comment-add-sheet').classList.remove('active');
  
  renderTimelineComments();
  showToast("Feedback comment pin saved to project mixer!");
}

// --- Initializer Event Registrations ---

document.addEventListener('DOMContentLoaded', () => {
  // 1. Clock
  startClock();
  
  // 2. Navigation router tabs
  document.querySelectorAll('.mobile-tab-bar .tab-item').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = tab.dataset.tab;
      
      // Update Tab bar selection
      document.querySelectorAll('.mobile-tab-bar .tab-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Switch screen overlays
      document.querySelectorAll('.mobile-screen').forEach(s => s.classList.remove('active'));
      document.getElementById(`screen-${tabName}`).classList.add('active');
      
      // Tab actions
      state.activeTab = tabName;
      if (tabName === 'discover') {
        renderDiscoverCreatorsList();
      } else if (tabName === 'project') {
        drawWaveformCanvas();
        renderTimelineComments();
        // Remove badge notification dots
        document.getElementById('mixer-tab-dot').classList.add('hidden');
      } else if (tabName === 'messages') {
        renderConversationsList();
        document.getElementById('inbox-tab-dot').classList.add('hidden');
      }
    });
  });

  // 3. Onboarding Slide Carousel Controls
  const nextSlideButtons = document.querySelectorAll('.next-slide-btn');
  nextSlideButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeSlide = document.querySelector('.onboarding-slide.active');
      const nextIdx = parseInt(activeSlide.dataset.slide) + 1;
      const nextSlide = document.querySelector(`.onboarding-slide[data-slide="${nextIdx}"]`);
      
      if (nextSlide) {
        activeSlide.classList.remove('active');
        nextSlide.classList.add('active');
      }
    });
  });

  // Multi select chips picker logic
  const handleChipSelection = (containerId, maxSelect = 2) => {
    const chips = document.querySelectorAll(`#${containerId} .chip-item`);
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const activeCount = document.querySelectorAll(`#${containerId} .chip-item.active`).length;
        if (chip.classList.contains('active')) {
          chip.classList.remove('active');
        } else if (activeCount < maxSelect) {
          chip.classList.add('active');
        } else {
          showToast(`Choose up to ${maxSelect} choices`);
        }
      });
    });
  };
  
  handleChipSelection('mob-skills-selection', 2);
  handleChipSelection('mob-genres-selection', 2);
  handleChipSelection('mob-needs-selection', 1);

  // 4. Setup profile form submission
  document.getElementById('mobile-setup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const stageName = document.getElementById('mob-user-name').value.trim();
    
    const selectedSkills = Array.from(document.querySelectorAll('#mob-skills-selection .chip-item.active')).map(c => c.dataset.val);
    const selectedGenres = Array.from(document.querySelectorAll('#mob-genres-selection .chip-item.active')).map(c => c.dataset.val);
    const selectedNeeds = Array.from(document.querySelectorAll('#mob-needs-selection .chip-item.active')).map(c => c.dataset.val);
    
    if (selectedSkills.length === 0 || selectedGenres.length === 0 || selectedNeeds.length === 0) {
      showToast("Please choose skills, genres, and needs parameters.");
      return;
    }
    
    // Save profile
    state.currentUser = {
      name: stageName,
      skills: selectedSkills,
      genres: selectedGenres,
      needs: selectedNeeds
    };
    
    // Update profile displays
    document.getElementById('mob-profile-name').textContent = stageName;
    document.getElementById('mob-edit-name').value = stageName;
    
    const initials = stageName.slice(0,2).toUpperCase();
    document.getElementById('mob-profile-avatar-initials').textContent = initials;
    document.querySelector('.user-avatar-placeholder').textContent = initials;
    
    // Render tag chips
    const tagsContainer = document.getElementById('mob-profile-skills-tags');
    tagsContainer.innerHTML = '';
    selectedSkills.forEach(s => {
      tagsContainer.innerHTML += `<span class="chip chip-skill">${s}</span>`;
    });
    selectedGenres.forEach(g => {
      tagsContainer.innerHTML += `<span class="chip chip-genre">${g}</span>`;
    });
    
    // Close overlay
    document.getElementById('mobile-onboarding-overlay').classList.remove('active');
    
    // Pop match deck
    buildSwipeDeck();
    
    showToast(`Profile entered: Welcome, ${stageName}!`);
  });

  // 5. Swipe Match Popup Close/Pitch buttons
  document.getElementById('match-popup-close-btn').addEventListener('click', () => {
    document.getElementById('match-popup-overlay').classList.add('hidden');
  });
  
  document.getElementById('match-popup-chat-btn').addEventListener('click', () => {
    document.getElementById('match-popup-overlay').classList.add('hidden');
    // Switch to messages tab
    const tabEl = document.querySelector('.mobile-tab-bar [data-tab="messages"]');
    if (tabEl) tabEl.click();
    
    // Get last swiped ID to open chat
    const deck = document.getElementById('swipe-deck');
    const topCard = deck.querySelector('.swipe-card:last-child');
    const partnerId = topCard ? topCard.dataset.id : 'marcus_keys';
    
    setTimeout(() => {
      openChatPane(partnerId);
    }, 300);
  });

  // 6. Action buttons underneath deck swiper
  document.getElementById('swipe-btn-dislike').addEventListener('click', () => {
    const card = document.querySelector('.swipe-card:last-child');
    if (card) {
      dragCurrentX = -150;
      dragCurrentY = -20;
      swipeCardLeft(card);
    }
  });

  document.getElementById('swipe-btn-like').addEventListener('click', () => {
    const card = document.querySelector('.swipe-card:last-child');
    if (card) {
      dragCurrentX = 150;
      dragCurrentY = -20;
      swipeCardRight(card);
    }
  });
  
  document.getElementById('swipe-btn-info').addEventListener('click', () => {
    const card = document.querySelector('.swipe-card:last-child');
    if (card) {
      const creator = state.creators.find(c => c.id === card.dataset.id);
      if (creator) openAnalyzerSheet(creator);
    }
  });

  document.getElementById('reload-cards-btn').addEventListener('click', () => {
    buildSwipeDeck();
  });

  // 7. Directory Filters and Searches
  document.getElementById('mob-filter-role').addEventListener('change', renderDiscoverCreatorsList);
  document.getElementById('mob-filter-genre').addEventListener('change', renderDiscoverCreatorsList);
  document.getElementById('mobile-search-input').addEventListener('input', renderDiscoverCreatorsList);

  // 8. Sliding audio player sheets
  const playerSheet = document.getElementById('audio-player-sheet');
  document.getElementById('mini-player-expand-btn').addEventListener('click', () => {
    playerSheet.classList.add('active');
    setupPlayerVisuals();
  });
  
  document.getElementById('audio-sheet-close').addEventListener('click', () => {
    playerSheet.classList.remove('active');
  });

  document.getElementById('audio-sheet-handle').addEventListener('click', () => {
    playerSheet.classList.remove('active');
  });

  // 9. Playback Controllers in Sheets
  document.getElementById('mini-player-btn-play').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleGlobalPlayback();
  });

  document.getElementById('sheet-btn-play').addEventListener('click', toggleGlobalPlayback);
  
  // 10. Volume Scrubber inside audio sheet
  const volBar = document.getElementById('sheet-volume-container');
  volBar.addEventListener('click', (e) => {
    const rect = volBar.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    
    document.getElementById('sheet-volume-bar').style.width = `${pct}%`;
    if (audioEngine.masterGain) {
      audioEngine.masterGain.gain.value = (pct / 100) * 0.8;
    }
  });

  // 11. Timeline player scrubber inside audio sheet
  const timelineBar = document.getElementById('sheet-progress-container');
  timelineBar.addEventListener('click', (e) => {
    if (!state.currentPlayingTrack) return;
    
    const rect = timelineBar.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    
    audioEngine.waveformTimelinePosition = pct;
    document.getElementById('sheet-progress-bar').style.width = `${pct}%`;
    document.getElementById('mini-player-progress').style.width = `${pct}%`;
    
    audioEngine.nextNoteTime = audioEngine.ctx.currentTime;
  });

  // 12. Audio Sheet Match Analyzer toggle link
  document.getElementById('audio-sheet-analyzer-btn').addEventListener('click', () => {
    if (state.currentPlayingTrack) {
      const creator = state.creators.find(c => c.tracks.some(t => t.id === state.currentPlayingTrack.id));
      if (creator) {
        playerSheet.classList.remove('active');
        setTimeout(() => openAnalyzerSheet(creator), 300);
      }
    } else {
      showToast("Play a creator's profile track first to analyze.");
    }
  });
  
  document.getElementById('analyzer-sheet-close').addEventListener('click', () => {
    document.getElementById('analyzer-sheet').classList.remove('active');
  });
  document.getElementById('analyzer-sheet-handle').addEventListener('click', () => {
    document.getElementById('analyzer-sheet').classList.remove('active');
  });

  // 13. Project Mixer play trigger
  document.getElementById('mob-mixer-play-btn').addEventListener('click', () => {
    if (audioEngine.isPlaying) {
      audioEngine.stopPlaying();
      state.isPlaying = false;
    }
    
    if (audioEngine.isPlayingMixer) {
      audioEngine.stopPlaying();
      state.isMixerPlaying = false;
      document.getElementById('mob-mixer-play-btn').innerHTML = `<i data-lucide="play" size="16"></i> Play Mix`;
      document.getElementById('mini-player-btn-play').querySelector('i').setAttribute('data-lucide', 'play');
      document.getElementById('mob-project-waveform').closest('.project-info-card').querySelector('.project-pulse-disc').classList.remove('playing');
    } else {
      audioEngine.startPlayingMixer();
      state.isMixerPlaying = true;
      document.getElementById('mob-mixer-play-btn').innerHTML = `<i data-lucide="pause" size="16"></i> Pause Mix`;
      document.getElementById('mini-player-btn-play').querySelector('i').setAttribute('data-lucide', 'pause');
      document.getElementById('mob-project-waveform').closest('.project-info-card').querySelector('.project-pulse-disc').classList.add('playing');
      
      // Update player titles to Mixer
      document.getElementById('mini-player-title').textContent = "Mix: Summer Chill Vibes";
      document.getElementById('mini-player-artist').textContent = "Me & Marcus Keys";
      document.getElementById('mini-player-match-wrap').classList.add('hidden');
      
      document.getElementById('sheet-track-title').textContent = "Mix: Summer Chill Vibes";
      document.getElementById('sheet-track-artist').textContent = "Me & Marcus Keys";
      document.getElementById('sheet-match-wrap').classList.add('hidden');
    }
    lucide.createIcons();
  });

  // 14. Project Mixer Faders Input level changes
  const bindFader = (stemName) => {
    const slider = document.getElementById(`mob-vol-${stemName}`);
    const label = document.getElementById(`mob-lbl-${stemName}`);
    
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      label.textContent = `${v}%`;
      
      // Update state
      state.activeProject.stems[stemName].volume = v;
      audioEngine.updateStemMixerStates(state.activeProject.stems);
    });
    
    // Mute buttons
    const muteBtn = document.getElementById(`mob-mute-${stemName}`);
    muteBtn.addEventListener('click', () => {
      const isMuted = !state.activeProject.stems[stemName].muted;
      state.activeProject.stems[stemName].muted = isMuted;
      
      if (isMuted) muteBtn.classList.add('active');
      else muteBtn.classList.remove('active');
      
      audioEngine.updateStemMixerStates(state.activeProject.stems);
    });

    // Solo buttons
    const soloBtn = document.getElementById(`mob-solo-${stemName}`);
    soloBtn.addEventListener('click', () => {
      const isSolo = !state.activeProject.stems[stemName].solo;
      state.activeProject.stems[stemName].solo = isSolo;
      
      if (isSolo) soloBtn.classList.add('active');
      else soloBtn.classList.remove('active');
      
      audioEngine.updateStemMixerStates(state.activeProject.stems);
    });
  };
  
  bindFader('drums');
  bindFader('bass');
  bindFader('melody');

  // Waveform timeline scrubber clicks inside Project view
  const projectWaveform = document.getElementById('mob-project-waveform');
  projectWaveform.addEventListener('click', (e) => {
    const rect = projectWaveform.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    
    audioEngine.waveformTimelinePosition = pct;
    document.getElementById('mob-waveform-scrubber').style.left = `${pct}%`;
    
    audioEngine.nextNoteTime = audioEngine.ctx.currentTime;
  });

  // Comment overlay Pins loading
  document.querySelectorAll('.mob-comment-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      showToast(`Note at ${pin.dataset.time} - ${pin.dataset.comment}`, 4000);
    });
  });

  // Slide up comment creation bottom sheet
  document.getElementById('mob-add-comment-trigger').addEventListener('click', () => {
    const sheet = document.getElementById('comment-add-sheet');
    const pct = audioEngine.waveformTimelinePosition;
    
    const min = Math.floor(((pct / 100) * 64) / 60);
    const sec = String(Math.floor(((pct / 100) * 64) % 60)).padStart(2, '0');
    
    document.getElementById('comment-sheet-time').textContent = `${min}:${sec}`;
    sheet.classList.add('active');
  });

  document.getElementById('comment-sheet-close').addEventListener('click', () => {
    document.getElementById('comment-add-sheet').classList.remove('active');
  });

  document.getElementById('comment-sheet-submit-btn').addEventListener('click', saveWaveformComment);

  // 15. Inbox Chat Back overlay trigger
  document.getElementById('mob-chat-back-btn').addEventListener('click', closeChatPane);
  
  // Chat direct project mixer link button
  document.getElementById('mob-chat-project-btn').addEventListener('click', () => {
    closeChatPane();
    // Click Mixer Tab
    const tabEl = document.querySelector('.mobile-tab-bar [data-tab="project"]');
    if (tabEl) tabEl.click();
  });
  
  // Chat message sending
  document.getElementById('mob-chat-send').addEventListener('click', sendChatMessage);
  document.getElementById('mob-chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Quick reply suggestions chips click
  document.querySelectorAll('.chat-suggestions-bar .suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent;
      document.getElementById('mob-chat-input').value = text;
      sendChatMessage();
    });
  });

  // 16. Profile updates Form
  document.getElementById('mob-profile-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedName = document.getElementById('mob-edit-name').value.trim();
    if (!updatedName) return;
    
    state.currentUser.name = updatedName;
    document.getElementById('mob-profile-name').textContent = updatedName;
    document.getElementById('mob-profile-avatar-initials').textContent = updatedName.slice(0,2).toUpperCase();
    
    showToast("Artist settings updated successfully.");
  });

  // Log out reset profile flow trigger
  document.getElementById('mob-logout-btn').addEventListener('click', () => {
    audioEngine.stopPlaying();
    document.getElementById('mobile-onboarding-overlay').classList.add('active');
    
    // Reset inputs
    document.getElementById('mob-user-name').value = '';
    document.querySelectorAll('.chip-item.active').forEach(c => c.classList.remove('active'));
    
    const slideWelcome = document.querySelector('.onboarding-slide[data-slide="0"]');
    document.querySelectorAll('.onboarding-slide').forEach(s => s.classList.remove('active'));
    slideWelcome.classList.add('active');
  });

  // 17. Simulator Wrapper Controls
  document.getElementById('toggle-device-shell').addEventListener('click', () => {
    document.body.classList.toggle('fullscreen-mode');
  });
  
  document.getElementById('reset-simulator-profile').addEventListener('click', () => {
    document.getElementById('mob-logout-btn').click();
  });

  // Volume key clicks
  document.querySelector('.volume-up').addEventListener('click', () => {
    showToast("Volume Increased");
  });
  document.querySelector('.volume-down').addEventListener('click', () => {
    showToast("Volume Decreased");
  });
  
  // Power key reset screen
  document.querySelector('.device-power').addEventListener('click', () => {
    showToast("Device Restarting...");
    setTimeout(() => {
      location.reload();
    }, 1000);
  });

  // Waveform canvas redraw loop
  setInterval(() => {
    if (state.activeTab === 'project') {
      drawWaveformCanvas();
    }
  }, 100);

  // Parse icons
  lucide.createIcons();
});
