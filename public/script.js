const STOPPED = 'stopped';
const PREPARE = 'prepare';
const RUNNING = 'running';

const videoFile = document.getElementById('video');
const audioFile = document.getElementById('beep');
const withSoundCheckbox = document.getElementById('with-sound-checkbox');
const playButton = document.getElementById('play-button');
const saveButton = document.getElementById('save-button');
const timebox = document.getElementById('timebox');
const timeTableWithSound = document.getElementById('time-list-with-sound');
const timeTableWithoutSound = document.getElementById('time-list-without-sound');
const avgReactionTimeWithSoundElement = document.getElementById('avg-reaction-time-with-sound');
const avgReactionTimeWithoutSoundElement = document.getElementById('avg-reaction-time-without-sound');
const userDetailsForm = document.getElementById('user-details-form');

const MAX_REACTION_TIME = 8000;
const MAX_WAIT_TIME = 10000;
const MIN_WAIT_TIME = 2000;

let withSound = true;
let stateApplication = STOPPED;
let timeFromRun = 0;
let reactionTimeListWithSound = [];
let reactionTimeListWithoutSound = [];

const calculateReactionTime = (timeStart, timeStop) => {
  return (timeStop - timeStart);
};

const calculateAvgReactionTime = (list) => {
  if (list.length === 0) {
    return 0;
  }

  const avgTime = list.reduce((total, num) => total + num) / list.length;

  return avgTime.toFixed(3);
}

const displayReactionTime = (time) => {
  timebox.innerHTML = `${time.toFixed(3)}s`;
};

const displayAvgReactionTimeWithSound = () => {
  const avgTime = calculateAvgReactionTime(reactionTimeListWithSound);

  avgReactionTimeWithSoundElement.innerHTML = `${avgTime}s`;
};

const displayAvgReactionTimeWithoutSound = () => {
  const avgTime = calculateAvgReactionTime(reactionTimeListWithoutSound);

  avgReactionTimeWithoutSoundElement.innerHTML = `${avgTime}s`;
};

const displayReactionTimeListWithSound = () => {
  timeTableWithSound.innerHTML = '';

  for (let i = 0; i < reactionTimeListWithSound.length; i++) {
    let li = document.createElement('li');
    li.innerHTML = `${reactionTimeListWithSound[i].toFixed(3)}s`;

    timeTableWithSound.appendChild(li);
  }
};

const displayReactionTimeListWithoutSound = () => {
  timeTableWithoutSound.innerHTML = '';

  for (let i = 0; i < reactionTimeListWithoutSound.length; i++) {
    let li = document.createElement('li');
    li.innerHTML = `${reactionTimeListWithoutSound[i].toFixed(3)}s`;

    timeTableWithoutSound.appendChild(li);
  }
};

const blockWithSoundCheckbox = () => {
  withSoundCheckbox.disabled = true;
};

const unblockWithSoundCheckbox = () => {
  withSoundCheckbox.disabled = false;
};

const prepareApplication = () => {
  stateApplication = PREPARE;
  timeFromRun = 0;

  blockWithSoundCheckbox();

  videoFile.currentTime = 0;
  audioFile.currentTime = 0;

  setTimeout(runApplication, Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME) + MIN_WAIT_TIME);
};

const runApplication = () => {
  stateApplication = RUNNING;
  timeFromRun = Date.now();

  videoFile.play();

  if (withSound) {
    audioFile.play();
  }
};

const stopApplication = () => {
  stateApplication = STOPPED;

  unblockWithSoundCheckbox();

  videoFile.pause();
  audioFile.pause();

  const reactionTime = calculateReactionTime(timeFromRun, Date.now());

  if (reactionTime <= MAX_REACTION_TIME) {
    const reactionTimeInSecond = reactionTime / 1000;

    if (withSound) {
      reactionTimeListWithSound.push(reactionTimeInSecond);
      displayReactionTimeListWithSound();
      displayAvgReactionTimeWithSound();
    } else {
      reactionTimeListWithoutSound.push(reactionTimeInSecond);
      displayReactionTimeListWithoutSound();
      displayAvgReactionTimeWithoutSound();
    }

    displayReactionTime(reactionTimeInSecond);
  } else {
    alert('Niestety twój czas reakcji był zbyt długi, aby można było go zapisać :(');
  }
};

const clearReactionTimes = () => {
  reactionTimeListWithSound = [];
  reactionTimeListWithoutSound = [];

  displayReactionTimeListWithSound();
  displayAvgReactionTimeWithSound();

  displayReactionTimeListWithoutSound();
  displayAvgReactionTimeWithoutSound();

  displayReactionTime(0);
}

window.addEventListener('DOMContentLoaded', () => {
  // listeners
  withSoundCheckbox.addEventListener('change', (e) => {
    withSound = e.target.checked;
  });

  playButton.addEventListener('click', () => {
    if (stateApplication === PREPARE) {
      // do nothing
    } else if (stateApplication === STOPPED) {
      prepareApplication();
      displayReactionTime(0);
      playButton.innerText = 'Stop';
      playButton.classList.replace('btn-success', 'btn-danger');
    } else if (stateApplication === RUNNING) {
      stopApplication();
      playButton.innerText = 'Play';
      playButton.classList.replace('btn-danger', 'btn-success');
    }
  });

  saveButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (reactionTimeListWithSound.length === 0 && reactionTimeListWithoutSound.length === 0) {
      alert('Error: Tabela z czasami jest pusta');

      return;
    }

    let formData = new FormData(userDetailsForm);

    axios
      .post('/times', {
        age: formData.get('age'),
        sex: formData.get('sex'),
        driverLicense: formData.get('driver-license'),
        reactionWithSound: reactionTimeListWithSound,
        reactionWithoutSound: reactionTimeListWithoutSound,
      }).then((res) => {
        console.log(res);
        clearReactionTimes();
        alert('Dane zostały zapisane prawidłowo');
      }).catch((err) => {
        console.log(err);
        alert('Error: Błąd w zapisie danych do bazy');
      })

  });

  displayReactionTime(0);
});
