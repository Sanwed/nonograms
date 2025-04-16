import { addSoundButton, addThemeButton, clearBody, getArrayColumns, getLinesLength } from './utils.js';
import { showMenuScreen, showWinScreen } from './screens.js';
import { startAudio } from './utils.js';

export const audio = new Audio();


const initItems = (name) => {
  const body = document.body;

  const gameScreen = document.createElement('div');
  gameScreen.setAttribute('id', 'game-screen');
  gameScreen.classList.add('screen');
  body.append(gameScreen);

  addThemeButton(gameScreen);
  addSoundButton(gameScreen, audio);

  const heading = document.createElement('h1');
  heading.textContent = name;
  gameScreen.append(heading);

  const timer = document.createElement('p');
  timer.setAttribute('id', 'timer');
  timer.textContent = ':';
  gameScreen.append(timer);

  const minutesContainer = document.createElement('span');
  minutesContainer.setAttribute('id', 'timer-minutes');
  minutesContainer.textContent = '00';
  timer.prepend(minutesContainer);

  const secondsContainer = document.createElement('span');
  secondsContainer.setAttribute('id', 'timer-seconds');
  secondsContainer.textContent = '00';
  timer.append(secondsContainer);

  const fieldContainer = document.createElement('div');
  fieldContainer.classList.add('game');
  gameScreen.append(fieldContainer);

  const columnNums = document.createElement('table');
  columnNums.setAttribute('id', 'column-nums');
  fieldContainer.append(columnNums);

  const rowNums = document.createElement('table');
  rowNums.setAttribute('id', 'row-nums');
  fieldContainer.append(rowNums);

  const field = document.createElement('table');
  field.setAttribute('id', 'field');
  fieldContainer.append(field);

  return {
    columnNums,
    rowNums,
    field,
  };
};

const createMatrix = (length) => {
  const matrix = new Array(length);
  for (let i = 0; i < length; i++) {
    matrix[i] = new Array(length);
    for (let j = 0; j < length; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
};

const updateMatrix = (matrix, cell) => {
  const cellId = cell.getAttribute('id');
  const id = cellId.split('-');
  if (cell.classList.contains('active')) {
    matrix[id[0]][id[1]] = 1;
  } else if (cell.classList.contains('cross')) {
    matrix[id[0]][id[1]] = 2;
  } else {
    matrix[id[0]][id[1]] = 0;
  }
};

const initTimer = () => {
  const minutesContainer = document.querySelector('#timer-minutes');
  const secondsContainer = document.querySelector('#timer-seconds');

  let minutes = 0;
  let seconds = 0;

  setInterval(() => {
    seconds++;
    if (seconds > 9) {
      secondsContainer.textContent = `${seconds}`;
    } else {
      secondsContainer.textContent = `0${seconds}`;
    }

    if (seconds >= 59) {
      minutes++;
      if (seconds > 9) {
        minutesContainer.textContent = `${minutes}`;
      } else {
        minutesContainer.textContent = `0${minutes}`;
      }
      seconds = 0;
    }
  }, 1000);
};

let resultMatrix;
const initField = (field, image, load = null) => {
  if (load) {
    resultMatrix = load;
  } else {
    resultMatrix = createMatrix(image.matrix.length);
  }

  const onCellClick = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('td')) {
      const cell = evt.target.closest('td');

      if (evt.button === 0 && !cell.classList.contains('cross')) {
        if (cell.classList.contains('active')) {
          startAudio('./audio/clear-cell.mp3');
        } else {
          startAudio('./audio/fill-cell.mp3');
        }
        cell.classList.toggle('active');
        updateMatrix(resultMatrix, cell);

        if (JSON.stringify(resultMatrix).replaceAll('2', '0') === JSON.stringify(image.matrix)) {
          startAudio('./audio/win.mp3', 2000);
          const time = document.querySelector('#timer').textContent;
          showWinScreen(image.matrix, time);
        }
      }
      if (evt.button === 2 && !cell.classList.contains('active')) {
        if (cell.classList.contains('cross')) {
          startAudio('./audio/clear-cell.mp3');
        } else {
          startAudio('./audio/fill-cell.mp3');
        }
        cell.classList.toggle('cross');
        updateMatrix(resultMatrix, cell);
      }
    }
  };

  field.style.gridTemplateColumns = `repeat(${image.matrix.length}, 1fr)`;
  for (let i = 0; i < image.matrix.length; i++) {
    for (let j = 0; j < image.matrix[i].length; j++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${i}-${j}`);
      if ((i + 1) % 5 === 0) {
        if (document.body.classList.contains('dark')) {
          cell.style.borderBottom = '2px solid rgb(91, 23, 91)';
        } else {
          cell.style.borderBottom = '2px solid #000';
        }

      }
      if (resultMatrix[i][j] === 1) {
        cell.classList.add('active');
      } else if (resultMatrix[i][j] === 2) {
        cell.classList.add('cross');
      }
      field.append(cell);
    }
  }
  field.addEventListener('click', onCellClick);
  field.addEventListener('click', (evt) => {
    if (evt.target.closest('td')) {
      initTimer();
    }
  }, { once: true });
  field.addEventListener('contextmenu', onCellClick);
};

const initRowNums = (container, lines) => {
  for (let i = 0; i < lines.length; i++) {
    const lineLength = getLinesLength(lines[i]);
    const cell = document.createElement('td');
    cell.innerHTML = lineLength.join('&nbsp;');
    container.append(cell);
  }
};

const initColumnNums = (container, lines) => {
  for (let i = 0; i < lines.length; i++) {
    const lineLength = getLinesLength(lines[i]);
    const cell = document.createElement('td');
    cell.innerHTML = lineLength.join('<br>');
    container.append(cell);
  }
};

const initButtons = (image) => {
  const screen = document.querySelector('#game-screen');

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('btn-wrapper');
  screen.append(buttonContainer);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('image', JSON.stringify(image));
    localStorage.setItem('currentImage', JSON.stringify(resultMatrix));
  });
  buttonContainer.append(saveBtn);

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    screen.remove();
    initGame(image);
  });
  buttonContainer.append(resetBtn);

  const menuBtn = document.createElement('button');
  menuBtn.textContent = 'Menu';
  menuBtn.addEventListener('click', () => {
    showMenuScreen();
  });
  buttonContainer.append(menuBtn);

  const resultBtn = document.createElement('button');
  resultBtn.textContent = 'Show solution';
  resultBtn.addEventListener('click', () => {
    showWinScreen(image.matrix);
  });
  buttonContainer.append(resultBtn);
};

const initGame = (image, load = null) => {
  clearBody();

  const {
    field,
    rowNums,
    columnNums,
  } = initItems(image.name);

  initField(field, image, load);
  initRowNums(rowNums, image.matrix);
  initColumnNums(columnNums, getArrayColumns(image.matrix));
  initButtons(image);
};

export { initGame };
