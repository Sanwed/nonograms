import { addThemeButton, clearBody, getRandomArrayElem } from './utils.js';
import { initGame } from './init-game.js';
import { images } from './images.js';

const body = document.body;

export const showMenuScreen = () => {
  clearBody();
  
  const menuScreen = document.createElement('div');
  menuScreen.classList.add('screen');
  menuScreen.setAttribute('id', 'menu-screen');
  body.append(menuScreen);
  
  addThemeButton(menuScreen);
  
  const heading = document.createElement('h1');
  heading.textContent = 'Nonograms';
  menuScreen.append(heading);
  
  const easyHeading = document.createElement('h2');
  easyHeading.textContent = 'Easy mode (5 X 5)';
  menuScreen.append(easyHeading);
  
  const easyCategory = document.createElement('ol');
  easyCategory.classList.add('category');
  menuScreen.append(easyCategory);
  
  const mediumHeading = document.createElement('h2');
  mediumHeading.textContent = 'Medium mode (10 X 10)';
  menuScreen.append(mediumHeading);
  
  const mediumCategory = document.createElement('ol');
  mediumCategory.classList.add('category');
  menuScreen.append(mediumCategory);
  
  const hardHeading = document.createElement('h2');
  hardHeading.textContent = 'Hard mode (15 X 15)';
  menuScreen.append(hardHeading);
  
  const hardCategory = document.createElement('ol');
  hardCategory.classList.add('category');
  menuScreen.append(hardCategory);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('btn-wrapper');
  menuScreen.append(buttonContainer);
  
  const loadGameButton = document.createElement('button');
  loadGameButton.textContent = 'Load Game';
  loadGameButton.addEventListener('click', () => {
    const image = JSON.parse(localStorage.getItem('image'));
    const currentImage = JSON.parse(localStorage.getItem('currentImage'));
    if (image && currentImage) {
      initGame(image, currentImage);
    } else {
      const message = document.createElement('p');
      message.textContent = 'Oops. No saves found';
      menuScreen.append(message);
    }
  });
  buttonContainer.append(loadGameButton);
  
  const randomGameBtn = document.createElement('button');
  randomGameBtn.textContent = 'Random';
  randomGameBtn.addEventListener('click', () => {
    initGame(getRandomArrayElem(images));
  });
  buttonContainer.append(randomGameBtn);
  
  let records = localStorage.getItem('records');
  
  if (records) {
    records = JSON.parse(localStorage.getItem('records')).sort();
    
    const recordsContainer = document.createElement('ol');
    recordsContainer.classList.add('records');
    
    const length = records.length > 5 ? 5 : records.length;
    for (let i = 0; i < length; i++) {
      const elem = document.createElement('li');
      elem.innerHTML = `name: ${records[i].name}<br>difficulty: ${records[i].difficulty}<br>time: ${records[i].time}`;
      recordsContainer.append(elem);
    }
    menuScreen.append(recordsContainer);
  } else {
    const message = document.createElement('p');
    message.textContent = 'Complete at least 1 puzzle for the leaderboard to appear';
    menuScreen.append(message);
  }
  
  images.forEach((image) => {
    const {
      name,
      matrix,
    } = image;
    
    const container = document.createElement('li');
    
    const heading = document.createElement('button');
    heading.textContent = name;
    container.append(heading);
    
    heading.addEventListener('click', () => {
      initGame(image);
    });
    
    if (matrix.length === 5) {
      easyCategory.append(container);
    } else if (matrix.length === 10) {
      mediumCategory.append(container);
    } else if (matrix.length === 15) {
      hardCategory.append(container);
    }
  });
};

export const showWinScreen = (image, time = null) => {
  clearBody();
  
  const winScreen = document.createElement('div');
  winScreen.classList.add('screen');
  winScreen.setAttribute('id', 'win-screen');
  body.append(winScreen);
  
  addThemeButton(winScreen);
  
  const message = document.createElement('p');
  if (time) {
    message.textContent = `Great! You have solved the nonogram in ${time}!`;
  } else {
    message.textContent = `You did not complete puzzle. Result image is:`;
  }
  winScreen.append(message);
  
  const field = document.createElement('table');
  field.setAttribute('id', 'field');
  field.style.gridTemplateColumns = `repeat(${image.length}, 1fr)`;
  for (let i = 0; i < image.length; i++) {
    for (let j = 0; j < image[i].length; j++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${i}-${j}`);
      if (image[i][j]) {
        cell.classList.add('active');
      }
      field.append(cell);
    }
  }
  winScreen.append(field);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('btn-wrapper');
  winScreen.append(buttonContainer);
  
  const backButton = document.createElement('button');
  backButton.textContent = 'Menu';
  backButton.addEventListener('click', showMenuScreen);
  buttonContainer.append(backButton);
};
