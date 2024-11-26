import { playNoteWithSynth, noteFrequencies } from './piano.js';
import { titleAnimator } from './titleAnimation.js';

const notes = [
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'
];

const noteIndices = {};
for (let i = 0; i < notes.length; i++) {
    noteIndices[notes[i]] = i;
}

const tonicToNote = {
    'C': 'C3', 'C#': 'C#3', 'D': 'D3', 'D#': 'D#3', 'E': 'E3',
    'F': 'F3', 'F#': 'F#3', 'G': 'G3', 'G#': 'G#3', 'A': 'A3',
    'A#': 'A#3', 'B': 'B3'
};

const modeToScale = {
    // Major modes
    'Ionian': 'Ionian',
    'Dorian': 'Dorian',
    'Phrygian': 'Phrygian',
    'Lydian': 'Lydian',
    'Mixolydian': 'Mixolydian',
    'Aeolian': 'Aeolian',
    'Locrian': 'Locrian',
    // Harmonic Minor modes
    'Harmonic Minor': 'Harmonic Minor',
    'Locrian Natural 6 (HM2)': 'Locrian Natural 6 (HM2)',
    'Ionian Augmented (HM3)': 'Ionian Augmented (HM3)',
    'Dorian Sharp 4 (HM4)': 'Dorian Sharp 4 (HM4)',
    'Phrygian Dominant (HM5)': 'Phrygian Dominant (HM5)',
    'Lydian Sharp 2 (HM6)': 'Lydian Sharp 2 (HM6)',
    'Ultralocrian (HM7)': 'Ultralocrian (HM7)',
    // Melodic Minor modes
    'Melodic Minor': 'Melodic Minor',
    'Dorian Flat 2 (MM2)': 'Dorian Flat 2 (MM2)',
    'Lydian Augmented (MM3)': 'Lydian Augmented (MM3)',
    'Lydian Dominant (MM4)': 'Lydian Dominant (MM4)',
    'Mixolydian Flat 6 (MM5)': 'Mixolydian Flat 6 (MM5)',
    'Locrian Natural 2 (MM6)': 'Locrian Natural 2 (MM6)',
    'Altered Scale (MM7)': 'Altered Scale (MM7)',
    // Other scales
    'Whole Tone': 'Whole Tone',
    'Diminished WH': 'Diminished WH',
    'Diminished HW': 'Diminished HW'
};

const scaleModes = {
    major: [
        { value: 'Ionian', name: 'Ionian' },
        { value: 'Dorian', name: 'Dorian' },
        { value: 'Phrygian', name: 'Phrygian' },
        { value: 'Lydian', name: 'Lydian' },
        { value: 'Mixolydian', name: 'Mixolydian' },
        { value: 'Aeolian', name: 'Aeolian' },
        { value: 'Locrian', name: 'Locrian' }
    ],
    'harmonic-minor': [
        { value: 'Harmonic Minor', name: 'Harmonic Minor' },
        { value: 'Locrian Natural 6 (HM2)', name: 'Locrian Natural 6 (HM2)' },
        { value: 'Ionian Augmented (HM3)', name: 'Ionian Augmented (HM3)' },
        { value: 'Dorian Sharp 4 (HM4)', name: 'Dorian Sharp 4 (HM4)' },
        { value: 'Phrygian Dominant (HM5)', name: 'Phrygian Dominant (HM5)' },
        { value: 'Lydian Sharp 2 (HM6)', name: 'Lydian Sharp 2 (HM6)' },
        { value: 'Ultralocrian (HM7)', name: 'Ultralocrian (HM7)' }
    ],
    'melodic-minor': [
        { value: 'Melodic Minor', name: 'Melodic Minor' },
        { value: 'Dorian Flat 2 (MM2)', name: 'Dorian Flat 2 (MM2)' },
        { value: 'Lydian Augmented (MM3)', name: 'Lydian Augmented (MM3)' },
        { value: 'Lydian Dominant (MM4)', name: 'Lydian Dominant (MM4)' },
        { value: 'Mixolydian Flat 6 (MM5)', name: 'Mixolydian Flat 6 (MM5)' },
        { value: 'Locrian Natural 2 (MM6)', name: 'Locrian Natural 2 (MM6)' },
        { value: 'Altered Scale (MM7)', name: 'Altered Scale (MM7)' }
    ],
    other: [
        { value: 'Whole Tone', name: 'Whole Tone' },
        { value: 'Diminished WH', name: 'Diminished WH' },
        { value: 'Diminished HW', name: 'Diminished HW' }
    ]
};

const scales = {
    'Ionian': [2, 2, 1, 2, 2, 2, 1],
    'Dorian': [2, 1, 2, 2, 2, 1, 2],
    'Phrygian': [1, 2, 2, 2, 1, 2, 2],
    'Lydian': [2, 2, 2, 1, 2, 2, 1],
    'Mixolydian': [2, 2, 1, 2, 2, 1, 2],
    'Aeolian': [2, 1, 2, 2, 1, 2, 2],
    'Locrian': [1, 2, 2, 1, 2, 2, 2],
    'Harmonic Minor': [2, 1, 2, 2, 1, 3, 1],
    'Locrian Natural 6 (HM2)': [1, 2, 1, 2, 3, 1, 2],
    'Ionian Augmented (HM3)': [2, 2, 1, 3, 1, 2, 1],
    'Dorian Sharp 4 (HM4)': [2, 1, 3, 1, 2, 1, 2],
    'Phrygian Dominant (HM5)': [1, 3, 1, 2, 1, 2, 2],
    'Lydian Sharp 2 (HM6)': [3, 1, 2, 1, 2, 2, 1],
    'Ultralocrian (HM7)': [1, 2, 1, 2, 2, 1, 3],
    'Melodic Minor': [2, 1, 2, 2, 2, 2, 1],
    'Dorian Flat 2 (MM2)': [1, 2, 2, 2, 2, 1, 2],
    'Lydian Augmented (MM3)': [2, 2, 2, 2, 1, 2, 1],
    'Lydian Dominant (MM4)': [2, 2, 2, 1, 2, 1, 2],
    'Mixolydian Flat 6 (MM5)': [2, 2, 1, 2, 1, 2, 2],
    'Locrian Natural 2 (MM6)': [2, 1, 2, 1, 2, 2, 2],
    'Altered Scale (MM7)': [1, 2, 1, 2, 2, 2, 2],
    'Whole Tone': [2, 2, 2, 2, 2, 2],
    'Diminished WH': [2, 1, 2, 1, 2, 1, 2, 1],
    'Diminished HW': [1, 2, 1, 2, 1, 2, 1, 2]
};

const specialScaleConfigurations = {
    'Whole Tone': {
        chordTones: [0, 2, 4, 5],
        extensions: [1, 3],
        disableVoicingTypes: ['1+3']
    },
    'Diminished WH': {
        chordTones: [0, 2, 4, 6],
        extensions: [1, 3, 5, 7],
        disableVoicingTypes: []
    },
    'Diminished HW': {
        chordTones: [0, 3, 4, 7],
        extensions: [1, 2, 5, 6],
        disableVoicingTypes: []
    }
};

// Add event listeners to each piano key
const keys = document.querySelectorAll('.white-key, .black-key');
keys.forEach(key => {
    key.addEventListener('click', () => {
        const note = key.getAttribute('data-note');
        playNoteWithSynth(note, key);
    });
});

// Function to update the scale modes based on the selected scale category
function updateScaleModes() {
    console.log('Updating scale modes...');
    const scaleCategory = document.getElementById('scale-category').value;
    const scaleModeSelect = document.getElementById('scale-mode');
    console.log('Scale category:', scaleCategory);
    
    // Clear existing options
    scaleModeSelect.innerHTML = '';
    scaleModeSelect.disabled = true;

    if (scaleCategory in scaleModes) {
        // Add the modes for the selected category
        scaleModes[scaleCategory].forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.value;
            option.textContent = mode.name;
            scaleModeSelect.appendChild(option);
        });
        
        // Enable the select if we have options
        if (scaleModeSelect.options.length > 0) {
            scaleModeSelect.disabled = false;
            // Trigger change event to update the keyboard
            scaleModeSelect.dispatchEvent(new Event('change'));
        }
    }
    
    console.log('Scale modes updated. Number of options:', scaleModeSelect.options.length);
    adjustVoicingTypes();
}

// Function to select a chord
function selectChord(chord, index) {
    const allItems = document.querySelectorAll('#scale-list li');
    allItems.forEach(item => item.classList.remove('selected-scale'));
    if (allItems[index]) {
        allItems[index].classList.add('selected-scale');
    }
    selectedScale = chord;
    updateKeyboard(chord.rootNote, chord.scaleMode);
    updateVoicingTypeMenuState();
    updateSectionVisibility();
    // Reset voicing button text when new scale is selected
    const generateVoicingButton = document.getElementById('generate-voicing');
    generateVoicingButton.textContent = 'Voicing';
    lastVoicing = null;  // Reset last voicing state
}

// Function to update the display of selected chords
function updateChordDisplay() {
    const chordDisplay = document.getElementById('chord-display');
    const scaleList = document.getElementById('scale-list');
    
    // Clear the existing list
    scaleList.innerHTML = '';
    
    // If this is the first scale being added, show the display and MIDI status
    if (chordList.length > 0) {
        chordDisplay.classList.add('has-scales');
        document.body.classList.add('has-scales');
    } else {
        chordDisplay.classList.remove('has-scales');
        document.body.classList.remove('has-scales');
    }
    
    // Create and append list items for each chord
    chordList.forEach((chord, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${chord.rootNote} ${chord.scaleMode}`;
        listItem.setAttribute('draggable', true);
        listItem.dataset.index = index;

        // Create reflection overlay
        const reflectionOverlay = document.createElement('div');
        reflectionOverlay.className = 'reflection-overlay';
        listItem.appendChild(reflectionOverlay);

        // Add drag start event
        listItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            listItem.classList.add('dragging');
        });

        listItem.addEventListener('dragend', () => {
            listItem.classList.remove('dragging');
        });

        listItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            if (draggingItem !== listItem) {
                const rect = listItem.getBoundingClientRect();
                const y = e.clientY - rect.top;
                if (y < rect.height / 2) {
                    scaleList.insertBefore(draggingItem, listItem);
                } else {
                    scaleList.insertBefore(draggingItem, listItem.nextSibling);
                }
            }
        });

        listItem.addEventListener('click', () => {
            // Initialize audio first
            initializeAudioContext();
            
            // Play selection sound
            playAudio(audioElements.selectScale);
            
            // Select the chord first
            selectChord(chord, index);
            
            // Trigger reflection animation
            const reflectionOverlay = listItem.querySelector('.reflection-overlay');
            reflectionOverlay.offsetHeight; // Force reflow
            reflectionOverlay.classList.add('reflection-animation');
            reflectionOverlay.addEventListener('animationend', () => {
                reflectionOverlay.classList.remove('reflection-animation');
            }, { once: true });
        });

        listItem.addEventListener('dblclick', () => {
            playClearSound();
            chordList.splice(index, 1);
            updateChordDisplay();
            if (chordList.length > 0) {
                const newIndex = Math.min(index, chordList.length - 1);
                selectChord(chordList[newIndex], newIndex);
            } else {
                selectedScale = null;
                clearHighlightedKeys();
                updateVoicingTypeMenuState();
                updateSectionVisibility();
            }
        });

        scaleList.appendChild(listItem);

        // If this is a newly added scale (last in the list), trigger the reflection animation
        if (index === chordList.length - 1) {
            // Force a reflow to ensure the animation triggers
            reflectionOverlay.offsetHeight;
            reflectionOverlay.classList.add('reflection-animation');
            reflectionOverlay.addEventListener('animationend', () => {
                reflectionOverlay.classList.remove('reflection-animation');
            }, { once: true });
        }
    });

    // Save the current state
    saveScales();
}

// Add chord button event listener
document.getElementById('add-chord').addEventListener('click', () => {
    // Initialize audio first
    initializeAudioContext();
    
    const rootNote = document.getElementById('root-note').value;
    const scaleMode = document.getElementById('scale-mode').value;
    
    // Add the chord to the list
    chordList.push({ rootNote, scaleMode });
    updateChordDisplay();
    
    // Select the newly added chord
    selectChord(chordList[chordList.length - 1], chordList.length - 1);
    
    playAddChordSound();
});

// Trash can functionality
const trashCan = document.getElementById('trash-can');

trashCan.addEventListener('dragover', (e) => {
    e.preventDefault();
    trashCan.classList.add('drag-over');
});

trashCan.addEventListener('dragleave', (e) => {
    e.preventDefault();
    trashCan.classList.remove('drag-over');
});

trashCan.addEventListener('drop', (e) => {
    e.preventDefault();
    trashCan.classList.remove('drag-over');
    const index = e.dataTransfer.getData('text/plain');
    if (index !== '') {
        playClearSound();
        chordList.splice(parseInt(index), 1);
        updateChordDisplay();
        if (chordList.length > 0) {
            const newIndex = Math.min(parseInt(index), chordList.length - 1);
            selectChord(chordList[newIndex], newIndex);
        } else {
            selectedScale = null;
            clearHighlightedKeys();
            updateVoicingTypeMenuState();
            updateSectionVisibility();
        }
    }
});

document.addEventListener('dragend', () => {
    trashCan.classList.remove('drag-over');
});

trashCan.addEventListener('click', () => {
    playClearSound();
    chordList.length = 0;
    selectedScale = null;
    updateChordDisplay();
    updateSectionVisibility();
    clearHighlightedKeys();
    localStorage.clear();
    const chordDisplay = document.getElementById('chord-display');
    chordDisplay.classList.remove('has-scales');
    document.body.classList.remove('has-scales');
});

function clearHighlightedKeys() {
    const highlightedKeys = document.querySelectorAll('.highlighted');
    highlightedKeys.forEach(key => {
        key.classList.remove('highlighted');
    });
}

// Function to get the scale indices for a given tonic and scale type
function getScaleIndices(tonic, scaleType) {
    const tonicNote = tonicToNote[tonic];
    const tonicIndex = noteIndices[tonicNote];
    const actualScaleType = modeToScale[scaleType] || scaleType;
    const intervals = scales[actualScaleType];
    
    // If no intervals found, return just the tonic
    if (!intervals) {
        console.warn(`No intervals found for scale type: ${actualScaleType}`);
        return [tonicIndex];
    }
    
    const scaleIndices = [tonicIndex];
    let currentIndex = tonicIndex;

    for (let i = 0; i < intervals.length; i++) {
        currentIndex += intervals[i];
        if (currentIndex >= notes.length) {
            currentIndex -= 12;
        }
        scaleIndices.push(currentIndex);
    }

    return scaleIndices;
}

// Function to update the keyboard
function updateKeyboard(tonic, scaleType) {
    const scaleIndices = getScaleIndices(tonic, scaleType);

    const keys = document.querySelectorAll('.white-key, .black-key');
    keys.forEach(key => key.classList.remove('highlighted'));

    scaleIndices.forEach(index => {
        const key = document.getElementById('key' + index);
        if (key) {
            key.classList.add('highlighted');
        }
    });
}

// Function to generate four-way close voicing
function generateFourWayClose(tonic, scaleType, voicingType) {
    const scaleIndices = getScaleIndices(tonic, scaleType);
    const scaleNotes = scaleIndices.map(index => notes[index]);

    let chordTones = [];
    let extensions = [];

    if (specialScaleConfigurations[scaleType]) {
        const config = specialScaleConfigurations[scaleType];
        chordTones = config.chordTones.map(i => scaleNotes[i]).filter(Boolean);
        extensions = config.extensions.map(i => scaleNotes[i]).filter(Boolean);
    } else {
        chordTones = [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[6]];
        extensions = [scaleNotes[1], scaleNotes[3], scaleNotes[5]];
    }

    let voicing;
    do {
        switch(voicingType) {
            case '4+0':
                voicing = chordTones.slice(0, 4);
                break;
            case '3+1':
                voicing = [
                    ...chordTones.sort(() => 0.5 - Math.random()).slice(0, 3),
                    extensions[Math.floor(Math.random() * extensions.length)]
                ];
                break;
            case '2+2':
                voicing = [
                    ...chordTones.sort(() => 0.5 - Math.random()).slice(0, 2),
                    ...extensions.sort(() => 0.5 - Math.random()).slice(0, 2)
                ];
                break;
            case '1+3':
                voicing = [
                    chordTones[Math.floor(Math.random() * chordTones.length)],
                    ...extensions.sort(() => 0.5 - Math.random()).slice(0, 3)
                ];
                break;
            default:
                voicing = chordTones.slice(0, 4);
        }

        voicing.sort((a, b) => noteFrequencies[a] - noteFrequencies[b]);

        while (voicing.length > 0 && noteFrequencies[voicing[voicing.length - 1]] / noteFrequencies[voicing[0]] >= 4) {
            voicing.pop();
        }
    } while (JSON.stringify(voicing) === JSON.stringify(lastVoicing) && voicingType !== '4+0');

    return voicing;
}

// Function to update keyboard for voicing
function updateKeyboardForVoicing(voicing) {
    const keys = document.querySelectorAll('.white-key, .black-key');
    keys.forEach(key => key.classList.remove('highlighted'));

    voicing.forEach(note => {
        const keyIndex = notes.indexOf(note);
        const key = document.getElementById('key' + keyIndex);
        if (key) {
            key.classList.add('highlighted');
        }
    });
}

// Add event listener for voicing type to auto-generate voicing
document.getElementById('voicing-type').addEventListener('change', () => {
    const voicingType = document.getElementById('voicing-type').value;
    if (selectedScale) {
        const rootNote = selectedScale.rootNote;
        const scaleMode = selectedScale.scaleMode;
        const voicing = generateFourWayClose(rootNote, scaleMode, voicingType);
        lastVoicing = voicing;
        playAudio(audioElements.voicing);
        updateKeyboardForVoicing(voicing);
        updateVoicingButton(voicingType);
    } else {
        playAudio(audioElements.pleaseSelectScale);
        showCustomAlert("Please select a scale from the list first.");
    }
});

// Generate voicing button event listener
document.getElementById('generate-voicing').addEventListener('click', () => {
    if (selectedScale) {
        const rootNote = selectedScale.rootNote;
        const scaleMode = selectedScale.scaleMode;
        const voicingType = document.getElementById('voicing-type').value;
        const voicing = generateFourWayClose(rootNote, scaleMode, voicingType);
        lastVoicing = voicing;
        playAudio(audioElements.voicing);
        updateKeyboardForVoicing(voicing);
        updateVoicingButton(voicingType, true); // Force update on click
    } else {
        playAudio(audioElements.pleaseSelectScale);
        showCustomAlert("Please select a scale from the list first.");
    }
});

// Function to play highlighted notes in order
function playHighlightedNotes() {
    const highlightedKeys = [...document.querySelectorAll('.highlighted')];

    highlightedKeys.sort((a, b) => {
        const noteA = a.getAttribute('data-note');
        const noteB = b.getAttribute('data-note');
        return noteFrequencies[noteA] - noteFrequencies[noteB];
    });

    let noteIndex = 0;
    const bpm = 100;
    const interval = (60 / bpm) * 1000;

    const playNote = () => {
        if (noteIndex < highlightedKeys.length) {
            const key = highlightedKeys[noteIndex];
            const note = key.getAttribute('data-note');
            playNoteWithSynth(note, key);
            noteIndex++;
        } else {
            clearInterval(playInterval);
        }
    };

    // Play first note immediately
    playNote();
    // Then start interval for remaining notes
    const playInterval = setInterval(playNote, interval);
}

// Function to play 4-note chord
function playFourNoteChord() {
    const highlightedKeys = document.querySelectorAll('.highlighted');
    highlightedKeys.forEach(key => {
        const note = key.getAttribute('data-note');
        playNoteWithSynth(note, key, 127, true);
    });
}

// Play buttons event listeners
document.getElementById('play-scale').addEventListener('click', playHighlightedNotes);
document.getElementById('play-chord').addEventListener('click', playFourNoteChord);

// Function to adjust voicing types based on selected scale
function adjustVoicingTypes() {
    const scaleMode = document.getElementById('scale-mode').value;
    const voicingTypeSelect = document.getElementById('voicing-type');

    const allVoicingTypes = ['4+0', '3+1', '2+2', '1+3'];

    voicingTypeSelect.innerHTML = '';

    let disabledVoicingTypes = [];
    if (specialScaleConfigurations[scaleMode]) {
        disabledVoicingTypes = specialScaleConfigurations[scaleMode].disableVoicingTypes;
    }

    allVoicingTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;

        if (disabledVoicingTypes.includes(type)) {
            option.disabled = true;
            option.style.color = 'grey';
        }

        voicingTypeSelect.appendChild(option);
    });

    const currentVoicingType = voicingTypeSelect.value;
    if (disabledVoicingTypes.includes(currentVoicingType)) {
        voicingTypeSelect.selectedIndex = 0;
    }
}

// Function to update voicing type menu state
function updateVoicingTypeMenuState() {
    const voicingTypeSelect = document.getElementById('voicing-type');
    if (selectedScale === null) {
        voicingTypeSelect.disabled = true;
        voicingTypeSelect.style.opacity = '0.5';
    } else {
        voicingTypeSelect.disabled = false;
        voicingTypeSelect.style.opacity = '1';
    }
}

// Function to update visibility of sections based on scale selection
function updateSectionVisibility() {
    const voicingSection = document.getElementById('voicing-section');
    const playButtons = document.getElementById('play-buttons');
    const hasSelectedScale = selectedScale !== null;

    voicingSection.classList.toggle('hidden', !hasSelectedScale);
    playButtons.classList.toggle('hidden', !hasSelectedScale);
}

// Add event listeners for real-time scale updates
const updateScaleDisplay = () => {
    const rootNote = document.getElementById('root-note').value;
    const scaleMode = document.getElementById('scale-mode').value;
    
    if (scaleMode) {
        playAudio(audioElements.selectScale);
        updateKeyboard(rootNote, scaleMode);
    } else {
        playAudio(audioElements.pleaseSelectScale);
    }
}

document.getElementById('root-note').addEventListener('change', updateScaleDisplay);

document.getElementById('scale-category').addEventListener('change', () => {
    updateScaleDisplay();
    updateScaleModes();
});

// Add both change and input events for real-time updates
const scaleModeElement = document.getElementById('scale-mode');
scaleModeElement.addEventListener('change', updateScaleDisplay);
scaleModeElement.addEventListener('input', updateScaleDisplay);

document.querySelectorAll('#root-note option, #scale-category option, #scale-mode option').forEach(option => {
    option.addEventListener('mouseover', () => {
        const rootNote = option.parentElement.id === 'root-note' ? option.value : document.getElementById('root-note').value;
        const scaleMode = option.parentElement.id === 'scale-mode' ? option.value : document.getElementById('scale-mode').value;
        updateKeyboard(rootNote, scaleMode);
    });
    
    // Restore original selection when mouse leaves
    option.addEventListener('mouseout', () => {
        const rootNote = document.getElementById('root-note').value;
        const scaleMode = document.getElementById('scale-mode').value;
        updateKeyboard(rootNote, scaleMode);
    });
});

// Initialize the keyboard and scales
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Initialize the scale modes first
    updateScaleModes();
    
    // Then initialize the keyboard with the selected values
    const rootNote = document.getElementById('root-note').value;
    const scaleMode = document.getElementById('scale-mode').value;
    updateKeyboard(rootNote, scaleMode || 'Ionian'); // Provide default scale if none selected
    
    // Initialize other UI components
    updateVoicingTypeMenuState();
    console.log('Initialization complete');
});

// Audio state management
let audioInitialized = false;
let audioContext = null;

// Audio elements
const audioElements = {
    coinInsert: new Audio('./asset/CoinInsert.wav'),
    slotMachine: new Audio('./asset/slot-machine.mp3'),
    addChord: new Audio('./asset/add.wav'),
    clear: new Audio('./asset/clear.mp3'),
    selectScale: new Audio('./asset/select.mp3'),
    pleaseSelectScale: new Audio('./asset/PleaseSelectAScaleFromTheListFirst.wav'),
    voicing: new Audio('./asset/voicing.wav')
};

// Set initial volumes
Object.values(audioElements).forEach(audio => {
    audio.volume = 0.7;
});
audioElements.voicing.volume = 0.65;
audioElements.addChord.volume = 0.55;

// Initialize audio context on first user interaction
function initializeAudioContext() {
    if (!audioInitialized) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioInitialized = true;
        console.log('Audio context initialized');
    }
}

// Audio play function with initialization check
function playAudio(audio) {
    try {
        if (!audioInitialized) {
            console.log('Audio not yet initialized, skipping playback');
            return;
        }
        if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or better
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
        }
    } catch (error) {
        console.log('Error playing audio:', error);
    }
}

// Audio playback functions
function playSlotMachineSound() {
    playAudio(audioElements.slotMachine);
}

function playAddChordSound() {
    playAudio(audioElements.addChord);
}

function playClearSound() {
    playAudio(audioElements.clear);
}

// Initialize audio on first user interaction
document.addEventListener('click', initializeAudioContext, { once: true });
document.addEventListener('keydown', initializeAudioContext, { once: true });

// Add keyboard shortcuts
(function addTooltips() {
    const addChordButton = document.getElementById('add-chord');
    const randomChordButton = document.getElementById('random-chord');
    const trashCan = document.getElementById('trash-can');
    const generateVoicingButton = document.getElementById('generate-voicing');
    const playScaleButton = document.getElementById('play-scale');
    const playChordButton = document.getElementById('play-chord');

    if (addChordButton) addChordButton.title = 'Press Enter to add chord';
    if (randomChordButton) randomChordButton.title = 'Press R for random chord';
    if (trashCan) trashCan.title = 'Press Delete to clear all scales';
    if (generateVoicingButton) generateVoicingButton.title = 'Press 1-4 to select and execute voicing type';
    if (playScaleButton) playScaleButton.title = 'Play Arpeggio';
    if (playChordButton) playChordButton.title = 'Play Chord';
})();

// Function to set voicing type and execute
function setVoicingAndExecute(voicingType) {
    const voicingSelect = document.getElementById('voicing-type');
    if (voicingSelect) {
        voicingSelect.value = voicingType;
    }

    const generateVoicingButton = document.getElementById('generate-voicing');
    if (generateVoicingButton) {
        generateVoicingButton.click();
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const tag = event.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    const key = event.key;
    const code = event.code;
    const keyCode = event.keyCode;

    if (key === 'Enter') {
        const addChordButton = document.getElementById('add-chord');
        if (addChordButton) {
            event.preventDefault();
            addChordButton.click();
        }
    }
    else if (key === 'r' || key === 'R') {
        const randomChordButton = document.getElementById('random-chord');
        if (randomChordButton) {
            event.preventDefault();
            randomChordButton.click();
        }
    }
    else if (key === 'Delete' || code === 'Delete' || keyCode === 46 || key === 'Backspace' || keyCode === 8) {
        const trashCan = document.getElementById('trash-can');
        if (trashCan) {
            event.preventDefault();
            trashCan.click();
        }
    }
    else if (key === '1') {
        event.preventDefault();
        setVoicingAndExecute('4+0');
    }
    else if (key === '2') {
        event.preventDefault();
        setVoicingAndExecute('3+1');
    }
    else if (key === '3') {
        event.preventDefault();
        setVoicingAndExecute('2+2');
    }
    else if (key === '4') {
        event.preventDefault();
        setVoicingAndExecute('1+3');
    }
});

// Initialize voicing type menu state
document.addEventListener('DOMContentLoaded', () => {
    updateVoicingTypeMenuState();
});

// Add event listener for title image click
document.querySelector('header img').addEventListener('click', () => {
    audioElements.coinInsert.currentTime = 0;
    audioElements.coinInsert.play();
});

const chordList = [];
let selectedScale = null;
let lastVoicing = null;

// Keep track of active rolling intervals
let activeRollingIntervals = [];

// Function to save scales to localStorage
function saveScales() {
    localStorage.setItem('savedScales', JSON.stringify(chordList));
}

// Random chord button event listener
document.getElementById('random-chord').addEventListener('click', async () => {
    // Start title animation if no scales
    if (chordList.length === 0) {
        const success = await titleAnimator.loadAnimationImages();
        if (success) {
            titleAnimator.startAnimation(document.querySelector('.title-image').src);
        }
    }

    // Always do the normal randomization
    playSlotMachineSound();
    
    // Store initial values
    const initialRootNote = document.getElementById('root-note').value;
    const initialScaleMode = document.getElementById('scale-mode').value;
    
    function rollOnce() {
        const rootNoteSelect = document.getElementById('root-note');
        const scaleCategorySelect = document.getElementById('scale-category');
        const scaleModeSelect = document.getElementById('scale-mode');

        // Randomly select values
        rootNoteSelect.selectedIndex = Math.floor(Math.random() * rootNoteSelect.options.length);
        scaleCategorySelect.selectedIndex = Math.floor(Math.random() * scaleCategorySelect.options.length);
        updateScaleModes();
        scaleModeSelect.selectedIndex = Math.floor(Math.random() * scaleModeSelect.options.length);

        // Update piano display
        const rootNote = rootNoteSelect.value;
        const scaleMode = scaleModeSelect.value;
        updateKeyboard(rootNote, scaleMode);
    }

    // Start rolling animation
    const rollInterval = setInterval(rollOnce, 100);

    // Stop rolling and add chord after animation
    setTimeout(() => {
        clearInterval(rollInterval);
        
        // Get final random values
        const rootNote = document.getElementById('root-note').value;
        const scaleMode = document.getElementById('scale-mode').value;
        
        // Add the new chord to the list
        const newChord = { rootNote, scaleMode };
        chordList.push(newChord);
        updateChordDisplay();
        selectChord(newChord, chordList.length - 1);
        
        // Update voicing types
        adjustVoicingTypes();
    }, 2050);
});

// Create custom alert elements
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
document.body.appendChild(modalOverlay);

const customAlert = document.createElement('div');
customAlert.className = 'custom-alert';
customAlert.innerHTML = `
    <div class="custom-alert-message"></div>
    <button class="custom-alert-button">OK</button>
`;
document.body.appendChild(customAlert);

function showCustomAlert(message) {
    const messageElement = customAlert.querySelector('.custom-alert-message');
    messageElement.textContent = message;
    modalOverlay.classList.add('show');
    customAlert.classList.add('show');

    const closeButton = customAlert.querySelector('.custom-alert-button');
    const closeAlert = () => {
        modalOverlay.classList.remove('show');
        customAlert.classList.remove('show');
        closeButton.removeEventListener('click', closeAlert);
    };
    closeButton.addEventListener('click', closeAlert);
}

// Function to update voicing button text and add animation
function updateVoicingButton(voicingType, forceUpdate = false) {
    const generateVoicingButton = document.getElementById('generate-voicing');
    if (generateVoicingButton) {
        const currentText = generateVoicingButton.textContent;
        const newText = voicingType === '4+0' ? 'Voicing' : 'Re-Voicing';
        
        // Only update if text is different or force update is true
        if (currentText !== newText || forceUpdate) {
            generateVoicingButton.textContent = newText;
            
            // Only add animation if it's not 4+0 type
            if (voicingType !== '4+0') {
                addReflectionAnimation(generateVoicingButton);
            }
        }
    }
}

// Function to add reflection animation to an element
function addReflectionAnimation(element) {
    // Remove any existing overlays
    const existingOverlay = element.querySelector('.reflection-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'reflection-overlay active'; // Add active class immediately
    
    // Calculate animation distances based on element width
    const elementWidth = element.offsetWidth;
    const startX = -elementWidth * 0.5;  // Start from 50% left of the element
    const endX = elementWidth * 1.5;     // End at 150% of the element width
    
    // Set the CSS variables
    overlay.style.setProperty('--start-x', `${startX}px`);
    overlay.style.setProperty('--end-x', `${endX}px`);
    
    // Add the overlay to the element
    element.appendChild(overlay);

    // Clean up after animation
    setTimeout(() => {
        if (overlay && overlay.parentElement) {
            overlay.remove();
        }
    }, 800); // Match animation duration
}
