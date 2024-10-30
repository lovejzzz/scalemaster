import { playNoteWithSynth, noteFrequencies } from './piano.js';

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
        { value: 'Locrian Nature 2 (MM6)', name: 'Locrian Nature 2 (MM6)' },
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

// Add event listeners to each piano key
const keys = document.querySelectorAll('.white-key, .black-key');
keys.forEach(key => {
    key.addEventListener('click', () => { // Reverted back to 'click'
        const note = key.getAttribute('data-note');
        playNoteWithSynth(note, key);
    });
});

// Function to update the scale modes based on the selected scale category
function updateScaleModes() {
    const scaleCategory = document.getElementById('scale-category').value;
    const scaleModeSelect = document.getElementById('scale-mode');
    scaleModeSelect.innerHTML = '';

    if (scaleCategory in scaleModes) {
        scaleModes[scaleCategory].forEach(mode => {
            const option = document.createElement('option');
            option.value = mode.value;
            option.textContent = mode.name;
            scaleModeSelect.appendChild(option);
        });
    } else {
        scaleModeSelect.innerHTML = '<option value="">Select Scale Mode</option>';
    }

    adjustVoicingTypes();
}

// Audio setup for UI sounds
const slotMachineAudio = new Audio('asset/slot-machine.mp3');
const addChordAudio = new Audio('asset/add.mp3');
const clearAudio = new Audio('asset/clear.mp3');

slotMachineAudio.volume = 0.5;

function playSlotMachineSound() {
    slotMachineAudio.play();
}

function playAddChordSound() {
    addChordAudio.play();
}

function playClearSound() {
    clearAudio.play();
}

const chordList = [];
let selectedScale = null;
let lastVoicing = null;

// Random chord function
document.getElementById('random-chord').addEventListener('click', () => {
    playSlotMachineSound();

    const rootNoteMenu = document.getElementById('root-note');
    const scaleModeMenu = document.getElementById('scale-mode');
    const scaleCategoryMenu = document.getElementById('scale-category');

    let rollInterval;

    function startRolling() {
        rollInterval = setInterval(() => {
            const randomRootIndex = Math.floor(Math.random() * rootNoteMenu.options.length);
            const randomCategoryIndex = Math.floor(Math.random() * scaleCategoryMenu.options.length);
            const randomScaleIndex = Math.floor(Math.random() * scaleModeMenu.options.length);

            rootNoteMenu.selectedIndex = randomRootIndex;
            scaleCategoryMenu.selectedIndex = randomCategoryIndex;
            scaleModeMenu.selectedIndex = randomScaleIndex;
        }, 100);
    }

    function stopRolling() {
        clearInterval(rollInterval);

        const finalRootIndex = Math.floor(Math.random() * rootNoteMenu.options.length);
        const finalCategoryIndex = Math.floor(Math.random() * scaleCategoryMenu.options.length);
        scaleCategoryMenu.selectedIndex = finalCategoryIndex;

        updateScaleModes();

        const finalScaleIndex = Math.floor(Math.random() * scaleModeMenu.options.length);
        rootNoteMenu.selectedIndex = finalRootIndex;
        scaleModeMenu.selectedIndex = finalScaleIndex;
        
        const rootNote = rootNoteMenu.value;
        const scaleMode = scaleModeMenu.value;
        chordList.push({ rootNote, scaleMode });
        updateChordDisplay();
    }

    startRolling();
    setTimeout(stopRolling, 1400);
});

// Function to update the display of selected chords
function updateChordDisplay() {
    const chordDisplay = document.getElementById('chord-list');
    chordDisplay.innerHTML = '';
    chordList.forEach((chord, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${chord.rootNote} ${chord.scaleMode}`;

        listItem.setAttribute('draggable', true);

        listItem.addEventListener('dblclick', () => {
            chordList.splice(index, 1);
            updateChordDisplay();
        });

        listItem.addEventListener('click', () => {
            const allItems = document.querySelectorAll('#chord-list li');
            allItems.forEach(item => item.classList.remove('selected-scale'));
            listItem.classList.add('selected-scale');
            selectedScale = chord;
            updateKeyboard(chord.rootNote, chord.scaleMode);
        });

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
                chordDisplay.insertBefore(draggingItem, listItem);
            }
        });

        chordDisplay.appendChild(listItem);
    });
}

// Add chord button event listener
document.getElementById('add-chord').addEventListener('click', () => {
    playAddChordSound();
    const rootNote = document.getElementById('root-note').value;
    const scaleMode = document.getElementById('scale-mode').value;
    chordList.push({ rootNote, scaleMode });
    updateChordDisplay();
});

// Clear chords button event listener
document.getElementById('clear-chords').addEventListener('click', () => {
    playClearSound();
    chordList.length = 0;
    updateChordDisplay();

    const highlightedKeys = document.querySelectorAll('.highlighted');
    highlightedKeys.forEach(key => {
        key.classList.remove('highlighted');
    });
});

// Function to get the scale indices for a given tonic and scale type
function getScaleIndices(tonic, scaleType) {
    const tonicNote = tonicToNote[tonic];
    const tonicIndex = noteIndices[tonicNote];
    const scaleIntervals = scales[scaleType];
    const scaleIndices = [tonicIndex];
    let currentIndex = tonicIndex;

    for (let i = 0; i < scaleIntervals.length; i++) {
        currentIndex += scaleIntervals[i];
        if (currentIndex >= notes.length) {
            break;
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

// Define special scale configurations
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

    lastVoicing = voicing;
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

// Generate voicing button event listener
document.getElementById('generate-voicing').addEventListener('click', () => {
    if (selectedScale) {
        const rootNote = selectedScale.rootNote;
        const scaleMode = selectedScale.scaleMode;
        const voicingType = document.getElementById('voicing-type').value;
        const voicing = generateFourWayClose(rootNote, scaleMode, voicingType);
        updateKeyboardForVoicing(voicing);
    } else {
        alert("Please select a scale from the list first.");
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

    const clickKey = () => {
        if (noteIndex < highlightedKeys.length) {
            const key = highlightedKeys[noteIndex];
            key.click();
            noteIndex++;
        } else {
            clearInterval(playInterval);
        }
    };

    const playInterval = setInterval(clickKey, interval);
}

// Function to play 4-note chord
function playFourNoteChord() {
    const highlightedKeys = document.querySelectorAll('.highlighted');
    highlightedKeys.forEach(key => {
        const note = key.getAttribute('data-note');
        playNoteWithSynth(note, key, 127, true); // Set isChord to true
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

// Initialize the keyboard
updateKeyboard('C', 'Ionian');

// Initialize scale modes and voicing types
updateScaleModes();
adjustVoicingTypes();

// Add event listeners for scale category and mode changes
document.getElementById('scale-category').addEventListener('change', updateScaleModes);
document.getElementById('scale-mode').addEventListener('change', adjustVoicingTypes);

// Add keyboard shortcuts
(function addTooltips() {
    const addChordButton = document.getElementById('add-chord');
    const randomChordButton = document.getElementById('random-chord');
    const clearChordsButton = document.getElementById('clear-chords');
    const generateVoicingButton = document.getElementById('generate-voicing');

    if (addChordButton) addChordButton.title = 'Press Enter to add chord';
    if (randomChordButton) randomChordButton.title = 'Press R for random chord';
    if (clearChordsButton) clearChordsButton.title = 'Press Delete to clear all chords';
    if (generateVoicingButton) generateVoicingButton.title = 'Press 1-4 to select and execute voicing type';
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
        const clearChordsButton = document.getElementById('clear-chords');
        if (clearChordsButton) {
            event.preventDefault();
            clearChordsButton.click();
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
