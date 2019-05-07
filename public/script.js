const STOPPED = 'stopped';
const PREPARE = 'prepare';
const RUNNING = 'running';

const videoFile = document.getElementById('video');
const audioFile = document.getElementById('beep');
const withSoundCheckbox = document.getElementById('with-sound-checkbox');
const playButton = document.getElementById('play-button');
const saveButton = document.getElementById('save-button');
const timebox = document.getElementById('timebox');
const timeTable = document.getElementById('time-list');
const avgReactionTime = document.getElementById('avg-reaction-time');
const userDetailsForm = document.getElementById('user-details-form');

let withSound = true;
let stateApplication = STOPPED;
let timeFromRun = 0;
let reactionTimeList = [];

const calculateReactionTime = (timeStart, timeStop) => {
  return (timeStop - timeStart) / 1000;
};

const displayReactionTime = (time) => {
  timebox.innerHTML = `${time.toFixed(3)}s`;
};

const displayAvgReactionTime = () => {
  const avgTime = reactionTimeList.reduce((total, num) => total + num) / reactionTimeList.length;

  avgReactionTime.innerHTML = `${avgTime.toFixed(3)}s`;
};

const displayReactionTimeList = () => {
  timeTable.innerHTML = '';

  for (let i = 0; i < reactionTimeList.length; i++) {
    let li = document.createElement('li');
    li.innerHTML = `${reactionTimeList[i].toFixed(3)}s`;

    timeTable.appendChild(li);
  }
};

const prepareApplication = () => {
  console.log('prepare');
  stateApplication = PREPARE;
  timeFromRun = 0;

  videoFile.currentTime = 0;
  audioFile.currentTime = 0;

  setTimeout(runApplication, Math.random() * (4000 - 2000) + 2000);
};

const runApplication = () => {
  console.log('run');
  stateApplication = RUNNING;
  timeFromRun = Date.now();

  videoFile.play();

  if (withSound) {
    audioFile.play();
  }
};

const stopApplication = () => {
  console.log('stop');
  stateApplication = STOPPED;

  const reactionTime = calculateReactionTime(timeFromRun, Date.now());

  reactionTimeList.push(reactionTime);
  displayReactionTime(reactionTime);
  displayReactionTimeList();
  displayAvgReactionTime();

  videoFile.pause();
  audioFile.pause();
};

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

  saveButton.addEventListener('click', () => {
    let formData = new FormData(userDetailsForm);

    console.log(formData.get('age'));
    console.log(formData.get('sex'));
    console.log(formData.get('driver-license'));
  });

  displayReactionTime(0);
});