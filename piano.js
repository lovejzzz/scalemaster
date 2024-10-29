// Create audio context
let audioContext = null;

// Audio buffer storage
let sampleBuffers = new Map();

// MIDI Setup
let midiAccess = null;
let midiInput = null;

// Master gain node for overall volume control
let masterGainNode = null;

// Split notes into primary (visible on website) and secondary (extended range)
const primaryNotes = ['C3', 'C4', 'C5', 'A3', 'A4'];
const secondaryNotes = ['A0', 'A1', 'A2', 'A5', 'A6', 'A7', 'C1', 'C2', 'C6', 'C7', 'C8'];
const availableNotes = [...primaryNotes, ...secondaryNotes];

// Frequency mapping for all 88 piano keys (A0 to C8)
const noteFrequencies = {
    // Octave 0
    'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
    // Octave 1
    'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
    // Octave 2
    'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
    // Octave 3
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    // Octave 4
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
    // Octave 5
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.26, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
    // Octave 6
    'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
    // Octave 7
    'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07,
    // Octave 8
    'C8': 4186.01
};

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Create master gain node
        masterGainNode = audioContext.createGain();
        masterGainNode.gain.value = 0.7; // Reduced master volume to 60%
        masterGainNode.connect(audioContext.destination);
        loadPianoSamples();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Function to load a single piano sample
async function loadSample(note, velocity) {
    const url = `piano/${note}v${velocity}.wav`;
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sampleBuffers.set(`${note}_v${velocity}`, audioBuffer);
        return true;
    } catch (error) {
        console.warn(`Error loading sample ${url}:`, error);
        return false;
    }
}

// Load piano samples in two phases
async function loadPianoSamples() {
    const velocities = [4, 8, 12, 16];
    
    // Phase 1: Load primary notes (C3 to C5)
    console.log('Loading primary piano samples...');
    
    const primaryLoads = primaryNotes.flatMap(note =>
        velocities.map(velocity => loadSample(note, velocity))
    );
    await Promise.all(primaryLoads);
    
    console.log('Primary piano samples loaded');
    
    // Phase 2: Load secondary notes in the background
    console.log('Loading secondary piano samples...');
    
    const secondaryLoads = secondaryNotes.flatMap(note =>
        velocities.map(velocity => loadSample(note, velocity))
    );
    
    // Load secondary notes
    Promise.all(secondaryLoads).then(() => {
        console.log('All piano samples loaded');
    });
}

// Function to get the closest available sample note
function getClosestSampleNote(note) {
    const noteFreq = noteFrequencies[note];
    let closestNote = availableNotes[0];
    let minDiff = Math.abs(noteFrequencies[availableNotes[0]] - noteFreq);

    for (const sampleNote of availableNotes) {
        const diff = Math.abs(noteFrequencies[sampleNote] - noteFreq);
        if (diff < minDiff) {
            minDiff = diff;
            closestNote = sampleNote;
        }
    }
    return closestNote;
}

// Function to get the closest velocity sample
function getClosestVelocitySample(note, velocity) {
    const velocityLayers = [4, 8, 12, 16];
    const normalizedVelocity = Math.ceil((velocity / 127) * 16);
    const closest = velocityLayers.reduce((prev, curr) => {
        return Math.abs(curr - normalizedVelocity) < Math.abs(prev - normalizedVelocity) ? curr : prev;
    });
    return `${note}_v${closest}`;
}

// Function to play a sampled note
function playSampledNote(note, velocity = 127, isChord = false) {
    if (!audioContext) return;

    const closestNote = getClosestSampleNote(note);
    const sampleKey = getClosestVelocitySample(closestNote, velocity);
    const buffer = sampleBuffers.get(sampleKey);
    
    if (buffer) {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = buffer;
        
        // Calculate pitch shift ratio if we're using a different sample than the target note
        const targetFreq = noteFrequencies[note];
        const sampleFreq = noteFrequencies[closestNote];
        source.playbackRate.value = targetFreq / sampleFreq;
        
        // Scale gain based on velocity and whether it's part of a chord
        const normalizedVelocity = velocity / 127;
        const baseGain = isChord ? 0.7 : 0.8; // Further reduced volume for chord notes to 35%
        gainNode.gain.value = normalizedVelocity * baseGain;

        // Add sustain control with shorter times for chords
        const sustainTime = isChord ? 0.35 : 0.35; // Shorter sustain for chords
        const releaseTime = isChord ? 0.42 : 0.42; // Shorter release for chords
        
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now + sustainTime);
        gainNode.gain.linearRampToValueAtTime(0, now + sustainTime + releaseTime);
        
        source.connect(gainNode);
        gainNode.connect(masterGainNode);
        
        source.start(0);
        source.stop(now + sustainTime + releaseTime + 0.1);
        
        return source;
    } else {
        console.warn(`Sample not found for ${sampleKey}`);
    }
}

// Function to play note and add visual feedback
function playNoteWithSynth(note, keyElement, velocity = 127, isChord = false) {
    keyElement.classList.add('red-key');
    playSampledNote(note, velocity, isChord);

    setTimeout(() => {
        keyElement.classList.remove('red-key');
    }, 300);
}

// Initialize MIDI
async function initMIDI() {
    try {
        midiAccess = await navigator.requestMIDIAccess();
        console.log('MIDI Access granted!');
        
        // Get the first available input device
        const inputs = midiAccess.inputs.values();
        midiInput = inputs.next().value;
        
        if (midiInput) {
            console.log(`Connected to MIDI device: ${midiInput.name}`);
            midiInput.onmidimessage = handleMIDIMessage;
            updateMIDIStatus(`Connected to ${midiInput.name}`);
        } else {
            console.log('No MIDI input devices available');
            updateMIDIStatus('MIDI device is supported');
        }

        // Listen for device connections/disconnections
        midiAccess.onstatechange = (e) => {
            console.log(`MIDI device ${e.port.name} ${e.port.state}`);
            if (e.port.type === 'input') {
                if (e.port.state === 'connected' && !midiInput) {
                    midiInput = e.port;
                    midiInput.onmidimessage = handleMIDIMessage;
                    updateMIDIStatus(`Connected to ${midiInput.name}`);
                } else if (e.port.state === 'disconnected' && midiInput === e.port) {
                    midiInput = null;
                    updateMIDIStatus('MIDI device disconnected');
                }
            }
        };
    } catch (err) {
        console.warn('Web MIDI API not supported:', err);
        updateMIDIStatus('MIDI not supported in this browser');
    }
}

// Update MIDI status display
function updateMIDIStatus(message) {
    const statusElement = document.getElementById('midi-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = message.includes('Connected') ? 'connected' : '';
    }
}

// Convert MIDI note number to note name
function midiNoteToName(midiNote) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteName = noteNames[midiNote % 12];
    return `${noteName}${octave}`;
}

// Handle MIDI messages
function handleMIDIMessage(message) {
    const command = message.data[0];
    const midiNote = message.data[1];
    const velocity = message.data[2];

    // Note on event with velocity > 0
    if ((command === 144) && (velocity > 0)) {
        const noteName = midiNoteToName(midiNote);
        // Now we can handle all notes from A0 to C8
        if (noteFrequencies[noteName]) {
            const keyElement = document.querySelector(`[data-note="${noteName}"]`);
            if (keyElement) {
                playNoteWithSynth(noteName, keyElement, velocity);
            } else {
                // Even if the key is not visible on screen, we still play the sound
                playSampledNote(noteName, velocity);
            }
        }
    }
}

// Initialize audio and MIDI when the page loads
window.addEventListener('load', () => {
    initMIDI();
    // Add click event listener to initialize audio context
    document.addEventListener('click', initAudioContext, { once: true });
});

// Export functions needed by main.js
export {
    playNoteWithSynth,
    noteFrequencies
};
