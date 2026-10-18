/* ==========================================================================
   CollabChord Core Application Logic - Industry Matching Engine & Web Synth
   ========================================================================== */

// --- Global Application State ---
const state = {
  currentUser: null,
  activeTab: 'home',
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
      influence: "12.4k monthly plays",
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
      influence: "35.2k monthly plays",
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
      influence: "8.1k monthly plays",
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
      avatar: 'https://raw.githubusercontent.com/ianosebe/CollabChord/master/assets/logo.jpg', // Fallback avatar
      skills: ['Songwriter', 'Audio Engineer'],
      genres: ['Cinematic', 'Ambient', 'Rock'],
      bio: "Sound designer and soundscape composer. I design deep cinematic textures, reverbs, and slow-building instrumentals. Looking for vocalists and beatmakers.",
      needs: ['Producer', 'Vocalist'],
      influence: "15k monthly plays",
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
      text: "Need a vocalist (preferably raspy/rock voice) for a high-intensity action game theme track. Hit me up with demos!",
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
    ]
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

  // Set preset styles for songs
  setPreset(style, bpm) {
    this.preset = style;
    this.tempo = bpm || 100;
  }

  // Update Stem Volume / Mute state based on activeProject
  updateStemMixerStates(stems) {
    if (!this.ctx) return;
    
    // Check if any track is soloed
    const anySolo = Object.values(stems).some(s => s.solo);

    for (const key of ['drums', 'bass', 'melody']) {
      const stem = stems[key];
      const gainNode = this.stemGains[key];
      
      if (!gainNode) continue;

      if (stem.muted) {
        gainNode.gain.value = 0;
      } else if (anySolo && !stem.solo) {
        gainNode.gain.value = 0; // Other tracks muted during solo
      } else {
        // Normal volume conversion from 0-100 to 0-1
        gainNode.gain.value = stem.volume / 100;
      }
    }
  }

  // Master Clock Scheduler
  scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.advanceNote();
    }
  }

  advanceNote() {
    // 16th notes per beat = 4
    const secondsPerBeat = 60.0 / this.tempo;
    const secondsPer16th = secondsPerBeat / 4;
    this.nextNoteTime += secondsPer16th;
    
    this.current16thNote = (this.current16thNote + 1) % 64; // 4 bars = 64 16th notes
  }

  scheduleNote(step, time) {
    if (this.isPlayingMixer) {
      // playing multi-track mixer - all stems play
      this.playDrumsPattern(step, time, this.stemGains.drums);
      this.playBassPattern(step, time, this.stemGains.bass);
      this.playMelodyPattern(step, time, this.stemGains.melody);
    } else {
      // playing single solo track, route through melody node for convenience
      this.playSoloTrackPattern(step, time, this.masterGain);
    }
  }

  // Audio Synth Sounds
  playDrumsPattern(step, time, destGain) {
    const beat = step % 16;
    
    // Kick: 1, 5, 9, 13
    if (beat === 0 || beat === 8 || (this.preset === 'rock' && (beat === 6 || beat === 14))) {
      this.synthKick(time, destGain);
    }
    // Snare: 4, 12
    if (beat === 4 || beat === 12) {
      this.synthSnare(time, destGain);
    }
    // Hats: every 8th note (0, 2, 4, 6...)
    if (beat % 2 === 0 && this.preset !== 'ambient') {
      this.synthHiHat(time, destGain);
    }
  }

  playBassPattern(step, time, destGain) {
    const beat = step % 16;
    const bar = Math.floor(step / 16) % 4;
    
    // Chords: Am (A), F (F), C (C), G (G)
    const roots = [110.00, 87.31, 130.81, 97.99]; // A2, F2, C3, G2
    const root = roots[bar];
    
    // Pulsing rhythm
    let playNote = false;
    let freq = root;
    
    if (this.preset === 'synthwave') {
      // constant eighth notes pulsing
      playNote = step % 2 === 0;
      // octave jump sometimes
      if (step % 8 === 4) freq = root * 2;
    } else if (this.preset === 'lofi') {
      // syncopated bass
      playNote = [0, 3, 6, 8, 11].includes(beat);
    } else {
      // standard driving bass
      playNote = [0, 4, 8, 12].includes(beat);
    }
    
    if (playNote) {
      this.synthBassNote(freq, time, 0.15, destGain);
    }
  }

  playMelodyPattern(step, time, destGain) {
    const beat = step % 16;
    const bar = Math.floor(step / 16) % 4;
    
    // Triads: Am, F, C, G
    const chords = [
      [220.00, 261.63, 329.63], // A3, C4, E4
      [174.61, 220.00, 261.63], // F3, A3, C4
      [261.63, 329.63, 392.00], // C4, E4, G4
      [196.00, 246.94, 293.66]  // G3, B3, D4
    ];
    
    const chord = chords[bar];
    
    // Arpeggio scheduler
    let playMel = false;
    let noteIndex = 0;
    
    if (this.preset === 'synthwave') {
      playMel = [0, 3, 6, 8, 11, 14].includes(beat);
      noteIndex = beat % 3;
    } else if (this.preset === 'lofi') {
      // chords pads on beat 1
      playMel = beat === 0;
      if (playMel) {
        // play full chord
        chord.forEach(freq => this.synthMelodyNote(freq * 1.5, time, 0.8, destGain));
        return;
      }
    } else if (this.preset === 'ambient') {
      playMel = beat === 0 && step % 32 === 0; // very slow swells
      if (playMel) {
        chord.forEach(freq => this.synthMelodyNote(freq, time, 2.5, destGain));
        return;
      }
    } else {
      playMel = [0, 4, 8, 12].includes(beat);
      noteIndex = beat / 4;
    }
    
    if (playMel) {
      const freq = chord[noteIndex] * 2; // play an octave higher
      this.synthMelodyNote(freq, time, 0.2, destGain);
    }
  }

  playSoloTrackPattern(step, time, destGain) {
    // Just combine them all into the master out when previewing individual tracks
    this.playDrumsPattern(step, time, destGain);
    this.playBassPattern(step, time, destGain);
    this.playMelodyPattern(step, time, destGain);
  }

  // --- Oscillator / Node Synthesisers ---
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
    gain.gain.setValueAtTime(0.12, time);
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
    noiseGain.gain.setValueAtTime(0.35, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);
    
    // Snare shell oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    oscGain.gain.setValueAtTime(0.25, time);
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
    
    osc.frequency.setValueAtTime(freq / 2, time); // deep sub
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.5, time + 0.01);
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
    gain.gain.linearRampToValueAtTime(0.18, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc1.start(time);
    osc1.stop(time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  }

  // --- Transport controls ---
  startPlaying() {
    this.init();
    if (this.isPlaying || this.isPlayingMixer) this.stopPlaying();
    
    this.ctx.resume();
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.current16thNote = 0;
    
    // Poll scheduler
    this.schedulerTimerId = setInterval(() => this.scheduler(), 25);
  }

  startPlayingMixer() {
    this.init();
    if (this.isPlaying || this.isPlayingMixer) this.stopPlaying();
    
    this.ctx.resume();
    this.isPlayingMixer = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.current16thNote = 0;
    this.preset = 'synthwave'; // Mixer default style
    this.tempo = 110;
    
    this.schedulerTimerId = setInterval(() => this.scheduler(), 25);
    
    // Move project scrubber visualizer
    this.waveformTimelinePosition = 0;
    this.timelineIntervalId = setInterval(() => {
      this.waveformTimelinePosition += 0.5;
      if (this.waveformTimelinePosition > 100) this.waveformTimelinePosition = 0;
      
      const scrubber = document.getElementById('waveform-scrubber');
      if (scrubber) scrubber.style.left = `${this.waveformTimelinePosition}%`;
      
      // Update mixer time values
      const totalSec = Math.floor((this.waveformTimelinePosition / 100) * 64);
      const elapsedEl = document.getElementById('player-time-elapsed');
      if (elapsedEl) {
        const m = Math.floor(totalSec / 60);
        const s = String(totalSec % 60).padStart(2, '0');
        elapsedEl.textContent = `${m}:${s}`;
      }
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

const audioEngine = new WebAudioSynthEngine();

// --- Core Matching Engine Algorithm ---
function calculateMatch(user, creator) {
  if (!user) return 50; // default baseline

  // 1. Skill complementarity (45% weight)
  // Check if creator has skills user needs AND user has skills creator needs
  let skillScore = 0;
  
  const creatorHasSkillsNeeded = creator.skills.some(skill => user.needs.includes(skill));
  const userHasSkillsNeeded = user.skills.some(skill => creator.needs.includes(skill));
  
  if (creatorHasSkillsNeeded) skillScore += 22.5;
  if (userHasSkillsNeeded) skillScore += 22.5;
  
  // Partial matches if they have overlapping skills (which could imply working on same stems)
  const sharedSkills = creator.skills.filter(skill => user.skills.includes(skill));
  if (sharedSkills.length > 0 && skillScore < 45) {
    skillScore += Math.min(10, sharedSkills.length * 5); // minor bonus
  }

  // 2. Genre Alignment (35% weight)
  // Jaccard similarity between user genres and creator genres
  const union = new Set([...user.genres, ...creator.genres]);
  const intersection = user.genres.filter(genre => creator.genres.includes(genre));
  
  let genreScore = 0;
  if (union.size > 0) {
    genreScore = (intersection.length / union.size) * 35;
  }

  // 3. Goals & Logistics Match (20% weight)
  let logisticsScore = 15; // baseline
  // match working styles and location
  if (user.genres.some(g => creator.genres.includes(g))) {
    logisticsScore += 5; // genre affinity bonus
  }

  const finalScore = Math.round(skillScore + genreScore + logisticsScore);
  
  // Bound score realistically between 35% and 99%
  return Math.max(35, Math.min(99, finalScore));
}

// Update match percentages across all creator models based on current user
function updateAllMatches() {
  if (!state.currentUser) return;
  
  state.creators.forEach(creator => {
    creator.matchPct = calculateMatch(state.currentUser, creator);
  });
  
  // Sort creators by match percentage
  state.creators.sort((a, b) => b.matchPct - a.matchPct);
}


// --- UI Rendering Engines ---

// Trigger elegant custom Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = document.createElement('i');
  icon.setAttribute('data-lucide', type === 'success' ? 'check-circle' : 'info');
  icon.setAttribute('size', '16');
  
  const text = document.createElement('span');
  text.textContent = message;
  
  const close = document.createElement('span');
  close.className = 'toast-close';
  close.innerHTML = '&times;';
  close.onclick = () => toast.remove();
  
  toast.appendChild(icon);
  toast.appendChild(text);
  toast.appendChild(close);
  
  container.appendChild(toast);
  lucide.createIcons();
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Render Top Matches on Home Feed
function renderTopMatches() {
  const grid = document.getElementById('top-matches-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  // Top 3 creators
  const topMatches = state.creators.slice(0, 3);
  
  topMatches.forEach(creator => {
    const card = document.createElement('div');
    card.className = 'card creator-card';
    card.onclick = () => openArtistModal(creator.id);
    
    card.innerHTML = `
      <div class="creator-card-avatar-wrap">
        <img src="${creator.avatar}" alt="${creator.name}" class="creator-card-avatar">
        <span class="creator-match-badge">${creator.matchPct}% Match</span>
      </div>
      <h3 class="creator-name">${creator.name}</h3>
      <div class="creator-roles">
        ${creator.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        ${creator.genres.slice(0, 2).map(g => `<span class="skill-tag genre-tag">${g}</span>`).join('')}
      </div>
      <p class="creator-reqs">Requires: ${creator.needs.join(', ')}</p>
      <button class="btn btn-secondary btn-sm btn-full">View Details</button>
    `;
    grid.appendChild(card);
  });
}

// Render Bulletin Postings
function renderBulletins() {
  const container = document.getElementById('bulletin-postings');
  if (!container) return;
  
  container.innerHTML = '';
  state.bulletins.forEach(bull => {
    const card = document.createElement('div');
    card.className = 'card bulletin-card';
    
    card.innerHTML = `
      <div class="bulletin-header">
        <span class="bulletin-author">${bull.author}</span>
        <span class="bulletin-date">${bull.date}</span>
      </div>
      <p class="bulletin-body">"${bull.text}"</p>
      <div class="bulletin-footer">
        <span class="bulletin-role-wanted"><i data-lucide="music-2" size="14"></i> Needed: ${bull.roleWanted}</span>
        <button class="btn btn-primary btn-sm" onclick="pitchToCreator('${bull.creatorId}', event)">Apply Now</button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// Render Discover Directory Grid
function renderDirectoryGrid() {
  const container = document.getElementById('creators-directory-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Apply filtering states
  const roleVal = document.getElementById('filter-role').value;
  const genreVal = document.getElementById('filter-genre').value;
  const minMatch = parseInt(document.getElementById('filter-match').value);
  
  const filtered = state.creators.filter(c => {
    const roleMatch = roleVal === 'all' || c.skills.includes(roleVal);
    const genreMatch = genreVal === 'all' || c.genres.includes(genreVal);
    const pctMatch = c.matchPct >= minMatch;
    return roleMatch && genreMatch && pctMatch;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-selection flex-column flex-center" style="grid-column: 1/-1; padding: 40px 0;">
        <i data-lucide="slash" size="48"></i>
        <h3>No creators match your current filter settings.</h3>
        <p>Try resetting filters or adjusting requirements on your profile.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  filtered.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card directory-card';
    
    card.innerHTML = `
      <div class="directory-card-header">
        <img src="${c.avatar}" alt="${c.name}" class="directory-card-avatar">
        <div class="directory-meta">
          <h3 class="directory-name">${c.name}</h3>
          <span class="directory-badge-match">${c.matchPct}% Collab Match</span>
        </div>
      </div>
      <div class="directory-body">
        <p class="directory-bio">${c.bio}</p>
        <div class="directory-tags-section">
          <div>
            <span class="tags-label">Skills:</span>
            <div class="tags-row">${c.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
          </div>
          <div>
            <span class="tags-label">Looking for:</span>
            <div class="tags-row">${c.needs.map(n => `<span class="skill-tag genre-tag">${n}</span>`).join('')}</div>
          </div>
        </div>
      </div>
      <div class="directory-footer-actions">
        <button class="btn btn-secondary" onclick="openArtistModal('${c.id}')">View Studio</button>
        <button class="btn btn-primary" onclick="pitchToCreator('${c.id}', event)">Pitch</button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// Render active Project list in sidebar
function renderSidebarProjects() {
  const container = document.getElementById('sidebar-projects-list');
  if (!container) return;
  
  container.innerHTML = `
    <div class="project-sidebar-item active" data-proj-id="proj_keys" onclick="switchTab('project')">
      <div class="project-sidebar-art flex-center">SC</div>
      <div class="project-sidebar-meta">
        <span class="project-sidebar-name">${state.activeProject.trackName}</span>
        <span class="project-sidebar-collab">with ${state.activeProject.collaboratorName}</span>
      </div>
    </div>
  `;
}

// Render Chat messages inside Project Space
function renderProjectChat() {
  const container = document.getElementById('project-chat-messages');
  if (!container) return;
  
  container.innerHTML = '';
  const chatPartnerId = state.activeProject.collaboratorId;
  const history = state.chats[chatPartnerId] || [];
  
  if (history.length === 0) {
    container.innerHTML = `<p class="analyzer-placeholder">No messages yet. Send a greeting to start collaborating.</p>`;
    return;
  }
  
  history.forEach(msg => {
    const isMe = msg.sender === 'user';
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isMe ? 'sender' : 'recipient'}`;
    
    const senderName = isMe ? (state.currentUser ? state.currentUser.name : 'Me') : state.activeProject.collaboratorName;
    
    bubble.innerHTML = `
      <span class="chat-bubble-sender-name">${senderName}</span>
      <span>${msg.text}</span>
      <span class="chat-bubble-time">${msg.time}</span>
    `;
    container.appendChild(bubble);
  });
  
  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Render Inbox (Messages Tab)
function renderInbox() {
  const listContainer = document.getElementById('inbox-conversations');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  // Loop through creators that have chat histories
  Object.keys(state.chats).forEach(creatorId => {
    const creator = state.creators.find(c => c.id === creatorId);
    if (!creator) return;
    
    const history = state.chats[creatorId];
    const lastMsg = history[history.length - 1];
    const isActive = state.activeInboxCreatorId === creatorId;
    
    const item = document.createElement('div');
    item.className = `conversation-item ${isActive ? 'active' : ''}`;
    item.onclick = () => selectInboxConversation(creatorId);
    
    item.innerHTML = `
      <img src="${creator.avatar}" alt="${creator.name}" class="avatar-sm">
      <div class="conv-meta">
        <div class="conv-header">
          <span class="conv-name">${creator.name}</span>
          <span class="conv-time">${lastMsg ? lastMsg.time : ''}</span>
        </div>
        <span class="conv-preview">${lastMsg ? lastMsg.text : 'Start proposal...'}</span>
      </div>
    `;
    listContainer.appendChild(item);
  });
  
  // Render active chat pane
  const noSelection = document.getElementById('no-chat-selected');
  const chatPane = document.getElementById('active-inbox-chat');
  
  if (state.activeInboxCreatorId) {
    noSelection.classList.add('hidden');
    chatPane.classList.remove('hidden');
    
    const partner = state.creators.find(c => c.id === state.activeInboxCreatorId);
    document.getElementById('chat-partner-avatar').src = partner.avatar;
    document.getElementById('chat-partner-name').textContent = partner.name;
    document.getElementById('chat-partner-match-badge').textContent = `${partner.matchPct}% Match`;
    
    const msgContainer = document.getElementById('inbox-chat-messages');
    msgContainer.innerHTML = '';
    
    const history = state.chats[state.activeInboxCreatorId] || [];
    history.forEach(msg => {
      const isMe = msg.sender === 'user';
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${isMe ? 'sender' : 'recipient'}`;
      
      const senderName = isMe ? (state.currentUser ? state.currentUser.name : 'Me') : partner.name;
      
      bubble.innerHTML = `
        <span class="chat-bubble-sender-name">${senderName}</span>
        <span>${msg.text}</span>
        <span class="chat-bubble-time">${msg.time}</span>
      `;
      msgContainer.appendChild(bubble);
    });
    
    msgContainer.scrollTop = msgContainer.scrollHeight;
  } else {
    noSelection.classList.remove('hidden');
    chatPane.classList.add('hidden');
  }
}

// Render Profile details
function renderMyProfile() {
  if (!state.currentUser) return;
  
  // Sidebar bottom update
  document.getElementById('user-display-name').textContent = state.currentUser.name;
  document.getElementById('user-display-roles').textContent = state.currentUser.skills.join(' • ');
  
  // Profile view updates
  document.getElementById('profile-name-display').textContent = state.currentUser.name;
  
  const skillsDisplay = document.getElementById('profile-skills-tags-display');
  skillsDisplay.innerHTML = '';
  state.currentUser.skills.forEach(s => {
    skillsDisplay.innerHTML += `<span class="skill-tag">${s}</span>`;
  });
  state.currentUser.genres.forEach(g => {
    skillsDisplay.innerHTML += `<span class="skill-tag genre-tag">${g}</span>`;
  });
  
  document.getElementById('profile-stat-matches').textContent = state.creators.filter(c => c.matchPct >= 70).length;
}

// Render the detailed comparison inside the Match Analyzer right-side panel
function renderMatchAnalyzer(creatorId) {
  const panel = document.getElementById('active-match-analyzer');
  if (!panel) return;
  
  const creator = state.creators.find(c => c.id === creatorId);
  if (!creator) {
    panel.innerHTML = `
      <div class="analyzer-placeholder flex-column flex-center">
        <i data-lucide="bar-chart-2" size="32"></i>
        <p>Select a creator or play a song to show real-time match breakdown.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  // calculate breakdown details
  const skillMatch = state.currentUser ? (creator.skills.some(s => state.currentUser.needs.includes(s)) ? 90 : 40) : 50;
  const genreMatch = state.currentUser ? Math.round((creator.genres.filter(g => state.currentUser.genres.includes(g)).length / Math.max(1, state.currentUser.genres.length)) * 100) : 50;
  const deliveryMatch = 85; // baseline logistic score
  
  panel.innerHTML = `
    <div class="analyzer-score-circle">
      <svg class="progress-ring" width="90" height="90">
        <circle class="progress-ring-circle-bg" stroke="rgba(255,255,255,0.05)" stroke-width="6" fill="transparent" r="38" cx="45" cy="45"/>
        <circle class="progress-ring-circle" id="analyzer-ring" stroke="var(--color-secondary)" stroke-width="6" fill="transparent" r="38" cx="45" cy="45"
          style="stroke-dasharray: 238.76; stroke-dashoffset: ${238.76 - (238.76 * creator.matchPct) / 100};"/>
      </svg>
      <div class="analyzer-score-text">${creator.matchPct}%</div>
    </div>
    
    <div class="analyzer-metrics">
      <div class="analyzer-metric-row">
        <div class="metric-label-row">
          <span class="metric-name">Skill Complementarity</span>
          <span class="metric-pct">${skillMatch}%</span>
        </div>
        <div class="metric-track-bg">
          <div class="metric-track-fill" style="width: ${skillMatch}%; background: var(--color-primary);"></div>
        </div>
      </div>
      
      <div class="analyzer-metric-row">
        <div class="metric-label-row">
          <span class="metric-name">Genre Alignment</span>
          <span class="metric-pct">${genreMatch}%</span>
        </div>
        <div class="metric-track-bg">
          <div class="metric-track-fill" style="width: ${genreMatch}%; background: var(--color-secondary);"></div>
        </div>
      </div>

      <div class="analyzer-metric-row">
        <div class="metric-label-row">
          <span class="metric-name">Logistics & Availability</span>
          <span class="metric-pct">${deliveryMatch}%</span>
        </div>
        <div class="metric-track-bg">
          <div class="metric-track-fill" style="width: ${deliveryMatch}%; background: var(--color-accent);"></div>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div style="font-size:12px; color:var(--color-text-muted); line-height:1.4;">
      <strong>Analysis:</strong> ${creator.name} is looking for <strong>${creator.needs.join(', ')}</strong>. Your profiles overlap on genres: <strong>${creator.genres.filter(g => state.currentUser.genres.includes(g)).join(', ') || 'None'}</strong>.
    </div>
  `;
}


// --- Waveform Canvas Renderers ---

// Draw realistic multi-beat visual waveforms on Project Canvas
function drawProjectWaveform() {
  const canvas = document.getElementById('project-waveform-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  
  ctx.clearRect(0, 0, width, height);
  
  // Set up visual bars representing waveform
  const numBars = 120;
  const spacing = 3;
  const barWidth = (width / numBars) - spacing;
  
  // Pseudo-random wave generator seeded to look like a chill pop song
  const seedWave = (i) => {
    const scale = Math.sin(i * 0.05) * 0.4 + Math.sin(i * 0.2) * 0.3 + Math.sin(i * 0.5) * 0.2;
    return Math.max(0.05, Math.abs(scale));
  };
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  
  for (let i = 0; i < numBars; i++) {
    const val = seedWave(i);
    const barHeight = val * (height * 0.8);
    const x = i * (barWidth + spacing);
    const y = (height - barHeight) / 2;
    
    // Highlight played portion
    const fillPercent = (x / width) * 100;
    if (fillPercent < audioEngine.waveformTimelinePosition) {
      ctx.fillStyle = 'var(--color-secondary)';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    }
    
    // Draw rounded bars
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 2);
    ctx.fill();
  }
}

// Master Output Real-time Canvas Frequency Visualizer in player bar
function setupRealTimeVisualizer() {
  const canvas = document.getElementById('mini-visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const renderFrame = () => {
    requestAnimationFrame(renderFrame);
    
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    if (!audioEngine.analyser || (!audioEngine.isPlaying && !audioEngine.isPlayingMixer)) {
      // Draw idle flatline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }
    
    const bufferLength = audioEngine.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    audioEngine.analyser.getByteFrequencyData(dataArray);
    
    const barWidth = (width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * height * 0.8;
      
      const r = 138 + (i * 2);
      const g = 43 + (i * 5);
      const b = 226;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  };
  
  renderFrame();
}


// --- Action Handlers ---

// Switch view tab (SPA routing)
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // update menu highlights
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    }
  });
  
  // switch visible section
  document.querySelectorAll('.content-view').forEach(view => {
    view.classList.add('hidden');
  });
  
  const activeView = document.getElementById(`view-${tabId}`);
  if (activeView) activeView.classList.remove('hidden');
  
  // Setup sub-components based on view
  if (tabId === 'discover') {
    renderDirectoryGrid();
  } else if (tabId === 'project') {
    renderProjectChat();
    drawProjectWaveform();
  } else if (tabId === 'messages') {
    renderInbox();
  }
}

// Select Inbox Conversation
function selectInboxConversation(creatorId) {
  state.activeInboxCreatorId = creatorId;
  renderInbox();
  
  // Clear notification indicator
  if (creatorId === 'marcus_keys') {
    document.getElementById('chat-notif-dot').classList.add('hidden');
  }
}

// Open detailed modal for artist studio details
function openArtistModal(creatorId) {
  const creator = state.creators.find(c => c.id === creatorId);
  if (!creator) return;
  
  // Setup fields
  document.getElementById('modal-avatar').src = creator.avatar;
  document.getElementById('modal-name').textContent = creator.name;
  document.getElementById('modal-bio').textContent = creator.bio;
  
  // Skill tags
  const rolesDiv = document.getElementById('modal-roles');
  rolesDiv.innerHTML = creator.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
  
  const genresDiv = document.getElementById('modal-genres');
  genresDiv.innerHTML = creator.genres.map(g => `<span class="skill-tag genre-tag">${g}</span>`).join('');
  
  // Requirements details
  const reqsDiv = document.getElementById('modal-requirements');
  reqsDiv.innerHTML = `
    <p><strong>Required Skills:</strong> ${creator.needs.join(', ')}</p>
    <p style="margin-top:6px;"><strong>Co-Working Style:</strong> ${creator.workingStyle}</p>
    <p><strong>Goal Commitment:</strong> ${creator.commitment}</p>
    <p><strong>Location Focus:</strong> ${creator.location}</p>
  `;
  
  // Match circle ring
  document.getElementById('modal-match-text').textContent = `${creator.matchPct}%`;
  const ring = document.getElementById('modal-match-ring');
  const radius = ring.r.baseVal.value;
  const circumference = 2 * Math.PI * radius; // 213.6
  ring.style.strokeDasharray = circumference;
  const offset = circumference - (creator.matchPct / 100) * circumference;
  ring.style.strokeDashoffset = offset;
  
  // Tracks playlist
  const tracksDiv = document.getElementById('modal-tracks-list');
  tracksDiv.innerHTML = '';
  creator.tracks.forEach(track => {
    const item = document.createElement('div');
    item.className = 'modal-track-item';
    item.onclick = (e) => {
      e.stopPropagation();
      playTrack(creator, track);
    };
    
    item.innerHTML = `
      <div class="modal-track-info">
        <button class="modal-track-play-btn"><i data-lucide="play" size="14"></i></button>
        <div>
          <span class="modal-track-name">${track.title}</span>
          <span style="display:block; font-size:10px; color:var(--color-text-dimmed);">${track.description}</span>
        </div>
      </div>
      <span class="modal-track-dur">${track.duration}</span>
    `;
    tracksDiv.appendChild(item);
  });
  
  // Setup button action hooks
  document.getElementById('modal-pitch-btn').onclick = () => {
    closeArtistModal();
    pitchToCreator(creator.id);
  };
  
  document.getElementById('modal-jam-btn').onclick = () => {
    closeArtistModal();
    // Load this creator as active project collaborator
    state.activeProject.collaboratorId = creator.id;
    state.activeProject.collaboratorName = creator.name;
    document.getElementById('project-collaborator-name').textContent = creator.name;
    document.getElementById('project-track-name').textContent = `${creator.name.split(' ')[0]}'s Demo Session`;
    
    switchTab('project');
    showToast(`Loaded live jam session with ${creator.name}!`, 'success');
  };

  // Open modal view
  document.getElementById('artist-modal').classList.add('active');
  lucide.createIcons();
  
  renderMatchAnalyzer(creatorId);
}

function closeArtistModal() {
  document.getElementById('artist-modal').classList.remove('active');
}

// Initiate Pitch/Message sequence
function pitchToCreator(creatorId, event) {
  if (event) event.stopPropagation(); // prevent card click
  
  // Initialize chat history if not exist
  if (!state.chats[creatorId]) {
    state.chats[creatorId] = [];
  }
  
  // Open messages tab
  switchTab('messages');
  selectInboxConversation(creatorId);
  
  // If first chat, send introductory proposal suggestion
  if (state.chats[creatorId].length === 0) {
    state.chats[creatorId].push({
      sender: 'user',
      text: `Hey! Pitching a collaboration proposal based on our ${state.creators.find(c => c.id === creatorId).matchPct}% Collab Match! Let's build some tracks together.`,
      time: "Just now"
    });
    renderInbox();
    
    // Simulate auto-respond after 2.5 seconds
    setTimeout(() => {
      const partner = state.creators.find(c => c.id === creatorId);
      state.chats[creatorId].push({
        sender: creatorId,
        text: `Yo! Stoked to hear from you. Our skillsets complement perfectly. Head over to the Project Space, I loaded up some baseline stems we can jam on!`,
        time: "Just now"
      });
      renderInbox();
      showToast(`New message received from ${partner.name}!`, 'info');
      // trigger sound blip or visual notifications
    }, 2500);
  }
}

// Play standard profile demo track (Spotify Player Integration)
function playTrack(creator, track) {
  // Update state
  state.currentPlayingTrack = { creator, track };
  state.isPlaying = true;
  state.isMixerPlaying = false;
  
  audioEngine.stopPlaying();
  
  // Setup audio preset
  audioEngine.setPreset(track.style, track.bpm);
  audioEngine.startPlaying();
  
  // Update player UI elements
  document.getElementById('player-title').textContent = track.title;
  document.getElementById('player-artist').textContent = creator.name;
  document.getElementById('player-cover-art').innerHTML = `<img src="${creator.avatar}" alt="${creator.name}">`;
  document.getElementById('player-match-badge-wrap').classList.remove('hidden');
  document.getElementById('player-match-badge').textContent = `${creator.matchPct}% Match`;
  
  // Timeline durations
  document.getElementById('player-time-duration').textContent = track.duration;
  
  // Toggle Play Button Icon
  const playBtn = document.getElementById('player-btn-play');
  playBtn.innerHTML = `<i data-lucide="pause" size="20" fill="currentColor"></i>`;
  lucide.createIcons();
  
  // Reset scrubber timeline
  const fill = document.getElementById('player-progress-bar');
  fill.style.width = '0%';
  
  // Start linear track length simulation (UI progress)
  let percent = 0;
  const durationSec = parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]);
  
  if (state.playTimerInterval) clearInterval(state.playTimerInterval);
  
  state.playTimerInterval = setInterval(() => {
    if (!state.isPlaying) return;
    percent += (1 / durationSec) * 100;
    
    if (percent >= 100) {
      percent = 0;
      audioEngine.stopPlaying();
      state.isPlaying = false;
      playBtn.innerHTML = `<i data-lucide="play" size="20" fill="currentColor"></i>`;
      lucide.createIcons();
      clearInterval(state.playTimerInterval);
    }
    
    fill.style.width = `${percent}%`;
    
    // Update timeline elapsed seconds
    const elapsedSecs = Math.floor((percent / 100) * durationSec);
    const m = Math.floor(elapsedSecs / 60);
    const s = String(elapsedSecs % 60).padStart(2, '0');
    document.getElementById('player-time-elapsed').textContent = `${m}:${s}`;
  }, 1000);
  
  showToast(`Streaming "${track.title}" by ${creator.name}...`, 'info');
  renderMatchAnalyzer(creator.id);
}

// Toggle master playback controls
function togglePlayback() {
  const playBtn = document.getElementById('player-btn-play');
  
  if (state.isMixerPlaying) {
    // mixer override
    const mixerPlayBtn = document.getElementById('mixer-play-btn');
    if (audioEngine.isPlayingMixer) {
      audioEngine.stopPlaying();
      state.isPlaying = false;
      mixerPlayBtn.innerHTML = `<i data-lucide="play" size="16"></i> Play Mix`;
      playBtn.innerHTML = `<i data-lucide="play" size="20" fill="currentColor"></i>`;
    } else {
      audioEngine.startPlayingMixer();
      state.isPlaying = true;
      mixerPlayBtn.innerHTML = `<i data-lucide="pause" size="16"></i> Pause Mix`;
      playBtn.innerHTML = `<i data-lucide="pause" size="20" fill="currentColor"></i>`;
    }
  } else if (state.currentPlayingTrack) {
    if (state.isPlaying) {
      audioEngine.stopPlaying();
      state.isPlaying = false;
      playBtn.innerHTML = `<i data-lucide="play" size="20" fill="currentColor"></i>`;
    } else {
      audioEngine.startPlaying();
      state.isPlaying = true;
      playBtn.innerHTML = `<i data-lucide="pause" size="20" fill="currentColor"></i>`;
    }
  } else {
    // load first creator track as default if nothing loaded
    const defaultCreator = state.creators[0];
    playTrack(defaultCreator, defaultCreator.tracks[0]);
    return;
  }
  lucide.createIcons();
}

// Handle Form setups
async function handleOnboardingSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('user-name').value;
  
  // Get multiple checkbox values
  const skills = Array.from(document.querySelectorAll('#skills-grid input:checked')).map(el => el.value);
  const genres = Array.from(document.querySelectorAll('#genres-grid input:checked')).map(el => el.value);
  const needs = Array.from(document.querySelectorAll('#needs-grid input:checked')).map(el => el.value);
  
  if (skills.length === 0 || genres.length === 0 || needs.length === 0) {
    alert("Please select at least one skill, genre, and collaboration requirement.");
    return;
  }
  
  state.currentUser = { name, skills, genres, needs };
  localStorage.setItem('cc_user_profile', JSON.stringify(state.currentUser));
  if (window.ccSupabase && window.ccAuthUser) {
    const { error } = await window.ccSupabase.from('profiles').upsert({
      id: window.ccAuthUser.id,
      display_name: name,
      skills, genres, looking_for: needs
    });
    if (error) { showToast('Profile could not be saved: ' + error.message, 'info'); return; }
    if (window.ccBackend) await window.ccBackend.refresh();
  }
  
  // Run match calculations
  updateAllMatches();
  
  // Close onboarding overlay
  document.getElementById('onboarding-overlay').classList.remove('active');
  
  // Render main panels
  renderMyProfile();
  renderTopMatches();
  renderBulletins();
  renderSidebarProjects();
  
  showToast("Musical requirements matched! Feed populated.", "success");
}

async function handleProfileEditSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('edit-name').value.trim();
  const skills = Array.from(document.querySelectorAll('#edit-skills-grid input:checked')).map(el => el.value);
  const genres = Array.from(document.querySelectorAll('#edit-genres-grid input:checked')).map(el => el.value);
  const needs = Array.from(document.querySelectorAll('#edit-needs-grid input:checked')).map(el => el.value);
  if (!skills.length || !genres.length || !needs.length) {
    showToast("Choose at least one skill, genre, and collaboration requirement.", "info");
    return;
  }
  state.currentUser = { name, skills, genres, needs };
  localStorage.setItem('cc_user_profile', JSON.stringify(state.currentUser));
  if (window.ccSupabase && window.ccAuthUser) {
    const { error } = await window.ccSupabase.from('profiles').upsert({
      id: window.ccAuthUser.id, display_name: name, skills, genres, looking_for: needs
    });
    if (error) { showToast("Profile could not be saved: " + error.message, "info"); return; }
    if (window.ccBackend) await window.ccBackend.refresh();
  }
  updateAllMatches();
  renderMyProfile();
  renderTopMatches();
  if (state.activeTab === 'discover') renderDirectoryGrid();
  showToast("Profile details saved! Industry match percentages recalculated.", "success");
}
// Append this routing action inside your core UI event listeners 
function handleUserLogout() {
  // 1. Flush volatile frontend credentials or tokens
  state.currentUser = null;
  localStorage.removeItem('collabchord_session_token');
  localStorage.removeItem('cc_user_profile');

  // 2. Route the window directly out to the safe transition screen
  window.location.href = 'logout.html';
}

// Event delegation targeting your existing sidebar/profile layout dropdowns
document.getElementById('logout-action-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  handleUserLogout();
});

// Setup Checkboxes dynamically on Edit Profile tab
function setupEditProfileForm() {
  if (!state.currentUser) return;
  
  document.getElementById('edit-name').value = state.currentUser.name;
  
  const skillsList = ['Producer', 'Vocalist', 'Guitarist', 'Keyboardist', 'Bass Player', 'Songwriter', 'Audio Engineer', 'Drummer'];
  const genresList = ['Synthwave', 'Pop', 'Hip-Hop', 'Rock', 'Lo-Fi', 'Cinematic', 'R&B', 'Electronic'];
  const needsList = ['Producer', 'Vocalist', 'Guitarist', 'Keyboardist', 'Songwriter', 'Audio Engineer'];
  
  const sGrid = document.getElementById('edit-skills-grid');
  sGrid.innerHTML = '';
  skillsList.forEach(s => {
    const checked = state.currentUser.skills.includes(s) ? 'checked' : '';
    sGrid.innerHTML += `<label class="chip-checkbox"><input type="checkbox" name="edit-skills" value="${s}" ${checked}><span>${s}</span></label>`;
  });
  
  const gGrid = document.getElementById('edit-genres-grid');
  gGrid.innerHTML = '';
  genresList.forEach(g => {
    const checked = state.currentUser.genres.includes(g) ? 'checked' : '';
    gGrid.innerHTML += `<label class="chip-checkbox"><input type="checkbox" name="edit-genres" value="${g}" ${checked}><span>${g}</span></label>`;
  });
  
  const nGrid = document.getElementById('edit-needs-grid');
  nGrid.innerHTML = '';
  needsList.forEach(n => {
    const checked = state.currentUser.needs.includes(n) ? 'checked' : '';
    nGrid.innerHTML += `<label class="chip-checkbox"><input type="checkbox" name="edit-needs" value="${n}" ${checked}><span>${n}</span></label>`;
  });
}


// --- Event Listeners and Initialisation ---

document.addEventListener('DOMContentLoaded', async () => {
  if (window.ccAuthReady) await window.ccAuthReady;
  if (window.ccSupabase && !window.ccAuthUser) return;
  // Try loading profile from localstorage
  const stored = localStorage.getItem('cc_user_profile');
  if (stored) {
    state.currentUser = JSON.parse(stored);
    document.getElementById('onboarding-overlay').classList.remove('active');
    updateAllMatches();
    renderMyProfile();
    renderTopMatches();
    renderBulletins();
    renderSidebarProjects();
  } else {
    // Show onboarding flow
    document.getElementById('onboarding-overlay').classList.add('active');
  }

  // Navigation switching
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
      if (tabId === 'profile') setupEditProfileForm();
    });
  });

  // Modal close listeners
  document.getElementById('close-artist-modal').addEventListener('click', closeArtistModal);
  document.getElementById('artist-modal').addEventListener('click', (e) => {
    if (e.target.id === 'artist-modal') closeArtistModal();
  });

  // Main Onboarding and Edit form submit
  document.getElementById('onboarding-form').addEventListener('submit', handleOnboardingSubmit);
  document.getElementById('profile-edit-form').addEventListener('submit', handleProfileEditSubmit);

  // Player controls
  document.getElementById('player-btn-play').addEventListener('click', togglePlayback);
  
  // Player Progress clicks (Scrubbing)
  document.getElementById('player-progress-container').addEventListener('click', (e) => {
    const bar = document.getElementById('player-progress-container');
    const fill = document.getElementById('player-progress-bar');
    const pct = (e.offsetX / bar.offsetWidth) * 100;
    fill.style.width = `${pct}%`;
    
    if (state.currentPlayingTrack) {
      const dur = state.currentPlayingTrack.track.duration;
      const totalSec = parseInt(dur.split(':')[0]) * 60 + parseInt(dur.split(':')[1]);
      const currentSec = Math.floor((pct / 100) * totalSec);
      
      const m = Math.floor(currentSec / 60);
      const s = String(currentSec % 60).padStart(2, '0');
      document.getElementById('player-time-elapsed').textContent = `${m}:${s}`;
      
      // Update synthesizer note schedule position
      if (audioEngine.ctx) {
        audioEngine.nextNoteTime = audioEngine.ctx.currentTime;
      }
    }
  });

  // Volume Bar
  document.getElementById('player-volume-container').addEventListener('click', (e) => {
    const bar = document.getElementById('player-volume-container');
    const fill = document.getElementById('player-volume-bar');
    const pct = Math.max(0, Math.min(100, (e.offsetX / bar.offsetWidth) * 100));
    fill.style.width = `${pct}%`;
    
    // adjust master synth engine gain
    if (audioEngine.masterGain) {
      audioEngine.masterGain.gain.value = pct / 100;
    }
  });

  // Mute volume button click
  let lastVolume = 80;
  document.getElementById('player-btn-volume').addEventListener('click', () => {
    const fill = document.getElementById('player-volume-bar');
    const icon = document.getElementById('player-btn-volume').querySelector('i');
    
    if (audioEngine.masterGain && audioEngine.masterGain.gain.value > 0) {
      lastVolume = parseFloat(fill.style.width) || 80;
      audioEngine.masterGain.gain.value = 0;
      fill.style.width = '0%';
      icon.setAttribute('data-lucide', 'volume-x');
    } else {
      audioEngine.masterGain.gain.value = lastVolume / 100;
      fill.style.width = `${lastVolume}%`;
      icon.setAttribute('data-lucide', 'volume-2');
    }
    lucide.createIcons();
  });

  // Discovery Filter bindings
  document.getElementById('filter-role').addEventListener('change', renderDirectoryGrid);
  document.getElementById('filter-genre').addEventListener('change', renderDirectoryGrid);
  
  const minMatchSlider = document.getElementById('filter-match');
  minMatchSlider.addEventListener('input', (e) => {
    document.getElementById('filter-match-val').textContent = `${e.target.value}%`;
    renderDirectoryGrid();
  });
  
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('filter-role').value = 'all';
    document.getElementById('filter-genre').value = 'all';
    minMatchSlider.value = 30;
    document.getElementById('filter-match-val').textContent = '30%';
    renderDirectoryGrid();
  });

  // Project Stem Mixer Volume bars
  document.querySelectorAll('.stem-volume').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const stemName = e.target.id.replace('volume-', '');
      if (!state.activeProject || !state.activeProject.stems[stemName]) return;
      state.activeProject.stems[stemName].volume = parseInt(e.target.value);
      audioEngine.updateStemMixerStates(state.activeProject.stems);
    });
  });

  // Mute stem buttons
  document.querySelectorAll('.mute-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stemName = btn.id.replace('mute-', '');
      if (!state.activeProject || !state.activeProject.stems[stemName]) return;
      const stateObj = state.activeProject.stems[stemName];
      stateObj.muted = !stateObj.muted;
      
      btn.classList.toggle('active', stateObj.muted);
      btn.closest('.mixer-track-row').classList.toggle('muted-active', stateObj.muted);
      
      audioEngine.updateStemMixerStates(state.activeProject.stems);
    });
  });

  // Solo stem buttons
  document.querySelectorAll('.solo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stemName = btn.id.replace('solo-', '');
      if (!state.activeProject || !state.activeProject.stems[stemName]) return;
      const stateObj = state.activeProject.stems[stemName];
      stateObj.solo = !stateObj.solo;
      
      btn.classList.toggle('active', stateObj.solo);
      btn.closest('.mixer-track-row').classList.toggle('solo-active', stateObj.solo);
      
      audioEngine.updateStemMixerStates(state.activeProject.stems);
    });
  });

  // Mixer play button handler
  document.getElementById('mixer-play-btn').addEventListener('click', () => {
    if (!state.activeProject) { showToast('Create or select a project before starting the mixer.', 'info'); return; }
    state.isMixerPlaying = true;
    state.currentPlayingTrack = null;
    
    // Toggle player status
    const playBtn = document.getElementById('player-btn-play');
    const mixerPlayBtn = document.getElementById('mixer-play-btn');
    
    if (audioEngine.isPlayingMixer) {
      audioEngine.stopPlaying();
      state.isPlaying = false;
      mixerPlayBtn.innerHTML = `<i data-lucide="play" size="16"></i> Play Mix`;
      playBtn.innerHTML = `<i data-lucide="play" size="20" fill="currentColor"></i>`;
    } else {
      // Apply active volumes
      audioEngine.updateStemMixerStates(state.activeProject.stems);
      audioEngine.startPlayingMixer();
      state.isPlaying = true;
      mixerPlayBtn.innerHTML = `<i data-lucide="pause" size="16"></i> Pause Mix`;
      playBtn.innerHTML = `<i data-lucide="pause" size="20" fill="currentColor"></i>`;
      
      // Update player labels
      document.getElementById('player-title').textContent = state.activeProject.trackName;
      document.getElementById('player-artist').textContent = `Co-op: ${state.activeProject.collaboratorName}`;
      document.getElementById('player-cover-art').innerHTML = `<i data-lucide="layers" size="18"></i>`;
      document.getElementById('player-match-badge-wrap').classList.add('hidden');
      document.getElementById('player-time-duration').textContent = '1:04';
    }
    lucide.createIcons();
  });

  // Waveform Scrubber Navigation
  document.getElementById('project-waveform-canvas').addEventListener('click', (e) => {
    const canvas = document.getElementById('project-waveform-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / canvas.offsetWidth) * 100;
    
    if (audioEngine.isPlayingMixer) {
      audioEngine.waveformTimelinePosition = percent;
      document.getElementById('waveform-scrubber').style.left = `${percent}%`;
    }
  });

  // Add timed note timeline comment
  document.getElementById('submit-timeline-comment').addEventListener('click', () => {
    const input = document.getElementById('new-timeline-comment');
    const body = input.value.trim();
    if (!body) return;
    
    const pct = audioEngine.waveformTimelinePosition;
    const totalSec = Math.floor((pct / 100) * 64);
    const m = Math.floor(totalSec / 60);
    const s = String(totalSec % 60).padStart(2, '0');
    const timeStr = `${m}:${s}`;
    
    // Add comment pin dynamically
    const pin = document.createElement('div');
    pin.className = 'comment-pin';
    pin.style.left = `${pct}%`;
    pin.setAttribute('data-time', timeStr);
    pin.setAttribute('data-comment', body);
    
    // Hover pin handler
    pin.addEventListener('mouseenter', (e) => {
      showToast(`Note at ${timeStr}: "${body}"`, 'info');
    });
    
    document.querySelector('.timeline-visualizer-container').appendChild(pin);
    
    // Add to HTML list
    const list = document.getElementById('waveform-comments-list');
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.innerHTML = `
      <span class="comment-time">${timeStr}</span>
      <span class="comment-body"><strong>Me:</strong> ${body}</span>
    `;
    list.appendChild(card);
    list.scrollTop = list.scrollHeight;
    
    input.value = '';
    showToast("Added timeline feedback note!", "success");
  });

  // Project Chat messages sender
  const sendProjectMsg = () => {
    const input = document.getElementById('project-chat-input');
    const val = input.value.trim();
    if (!val) return;
    
    const chatPartnerId = state.activeProject.collaboratorId;
    if (!state.chats[chatPartnerId]) state.chats[chatPartnerId] = [];
    
    state.chats[chatPartnerId].push({
      sender: 'user',
      text: val,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    input.value = '';
    renderProjectChat();
    
    // Auto respond
    setTimeout(() => {
      state.chats[chatPartnerId].push({
        sender: chatPartnerId,
        text: "That sounds awesome! Let me tweak the melody filter and push the updated stems.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderProjectChat();
      showToast(`New message from ${state.activeProject.collaboratorName}!`, 'info');
    }, 2000);
  };
  
  document.getElementById('project-chat-send').addEventListener('click', sendProjectMsg);
  document.getElementById('project-chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendProjectMsg();
  });

  // Inbox Chat Messages sender
  const sendInboxMsg = () => {
    const input = document.getElementById('inbox-chat-input');
    const val = input.value.trim();
    if (!val || !state.activeInboxCreatorId) return;
    
    state.chats[state.activeInboxCreatorId].push({
      sender: 'user',
      text: val,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    input.value = '';
    renderInbox();
    
    // Auto respond in inbox
    const activePartnerId = state.activeInboxCreatorId;
    setTimeout(() => {
      if (state.chats[activePartnerId]) {
        state.chats[activePartnerId].push({
          sender: activePartnerId,
          text: "Love this proposal! Let's schedule a session to lay down some vocal ideas.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        renderInbox();
        showToast(`Inbox update: new proposal message!`, 'info');
      }
    }, 2000);
  };
  
  document.getElementById('inbox-chat-send').addEventListener('click', sendInboxMsg);
  document.getElementById('inbox-chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendInboxMsg();
  });

  // Project Open Button inside Inbox chat header
  document.getElementById('chat-open-project-btn').addEventListener('click', () => {
    if (!state.activeInboxCreatorId) return;
    const partner = state.creators.find(c => c.id === state.activeInboxCreatorId);
    
    state.activeProject.collaboratorId = partner.id;
    state.activeProject.collaboratorName = partner.name;
    document.getElementById('project-collaborator-name').textContent = partner.name;
    document.getElementById('project-track-name').textContent = `${partner.name.split(' ')[0]}'s Demo Session`;
    
    switchTab('project');
  });

  // Reset/Reset Profile trigger
  document.getElementById('trigger-onboarding').addEventListener('click', () => {
    localStorage.removeItem('cc_user_profile');
    document.getElementById('onboarding-overlay').classList.add('active');
    showToast("Profile reset. Please set up your requirements again.", "info");
  });

  // Global search filters
  document.getElementById('global-search').addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    if (!val) {
      updateAllMatches();
      renderTopMatches();
      return;
    }
    
    // Search filter local
    state.creators.forEach(c => {
      const matchName = c.name.toLowerCase().includes(val);
      const matchSkill = c.skills.some(s => s.toLowerCase().includes(val));
      const matchGenre = c.genres.some(g => g.toLowerCase().includes(val));
      
      // temporary score adjustment based on search relevance
      if (matchName || matchSkill || matchGenre) {
        c.matchPct = Math.min(99, c.matchPct + 5);
      } else {
        c.matchPct = Math.max(30, c.matchPct - 20);
      }
    });
    
    state.creators.sort((a, b) => b.matchPct - a.matchPct);
    renderTopMatches();
    if (state.activeTab === 'discover') renderDirectoryGrid();
  });

  // Setup onboarding shortcut button on profile settings
  document.getElementById('edit-profile-shortcut').addEventListener('click', () => {
    switchTab('profile');
    setupEditProfileForm();
  });

  // Stem uploads are handled by collabchord-backend.js using private Supabase Storage.

  // Initialise Realtime Mini Visualizer loop
  setupRealTimeVisualizer();
  
  // Waveform canvas redraw loop
  setInterval(() => {
    if (audioEngine.isPlayingMixer) {
      drawProjectWaveform();
    }
  }, 100);

  // Unread notifications are driven by actual messages, not simulated demo events.

  // Load standard icons
  lucide.createIcons();
});
