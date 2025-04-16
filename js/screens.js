import { addSoundButton, addThemeButton, clearBody, getRandomArrayElem, startAudio } from './utils.js';
import { initGame, audio } from './init-game.js';
import { images } from './images.js';

const body = document.body;
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

export const showMenuScreen = () => {
  const theme = localStorage.getItem('theme');

  if (theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark')
    }
  }

  clearBody();

  const menuScreen = document.createElement('div');
  menuScreen.classList.add('screen');
  menuScreen.setAttribute('id', 'menu-screen');
  body.append(menuScreen);

  addThemeButton(menuScreen);
  addSoundButton(menuScreen, audio);

  const heading = document.createElement('h1');
  heading.textContent = 'Nonograms';
  menuScreen.append(heading);

  // Загружаем сохраненные уровни
  const savedLevels = JSON.parse(localStorage.getItem('customLevels') || '[]');
  savedLevels.forEach(level => {
    if (!images.some(img => img.name === level.name)) {
      images.push(level);
    }
  });

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

  const rulesButton = document.createElement('button');
  rulesButton.textContent = 'Rules';
  rulesButton.addEventListener('click', showRulesScreen);
  buttonContainer.append(rulesButton);

  const randomGameBtn = document.createElement('button');
  randomGameBtn.textContent = 'Random';
  randomGameBtn.addEventListener('click', () => {
    initGame(getRandomArrayElem(images));
  });
  buttonContainer.append(randomGameBtn);

  const createGameBtn = document.createElement('button');
  createGameBtn.textContent = 'Create';
  createGameBtn.addEventListener('click', showCreateScreen);
  buttonContainer.append(createGameBtn);

  images.forEach((image) => {
    const {
      name,
      matrix,
      color,
    } = image;

    const container = document.createElement('li');

    const heading = document.createElement('button');
    heading.textContent = name;
    heading.style.backgroundColor = color;
    container.append(heading);

    heading.addEventListener('click', () => {
      initGame(image);
    });

    // Добавляем кнопку удаления для созданных уровней
    const savedLevels = JSON.parse(localStorage.getItem('customLevels') || '[]');
    if (savedLevels.some(level => level.name === name)) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        if (confirm('Вы уверены, что хотите удалить этот уровень?')) {
          const updatedLevels = savedLevels.filter(level => level.name !== name);
          localStorage.setItem('customLevels', JSON.stringify(updatedLevels));
          const index = images.findIndex(img => img.name === name);
          if (index !== -1) {
            images.splice(index, 1);
          }
          showMenuScreen();
        }
      });
      container.append(deleteBtn);
    }

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
  addSoundButton(winScreen, audio);

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

export const showRulesScreen = () => {
  clearBody();

  const rulesScreen = document.createElement('div');
  rulesScreen.classList.add('screen', 'screen--row');
  rulesScreen.setAttribute('id', 'rules-screen');
  body.append(rulesScreen);

  addThemeButton(rulesScreen);
  addSoundButton(rulesScreen, audio);

  const heading = document.createElement('h1');
  heading.textContent = 'Game Rules';
  rulesScreen.append(heading);

  const rulesContainer = document.createElement('ol');
  rulesContainer.classList.add('rules-container');

  const rules = [
    'Nonograms is a puzzle where you need to color cells according to the numbers.',
    'The numbers on the left and top show how many groups of colored cells should be in the corresponding row or column.',
    'Each number represents the length of a group of colored cells.',
    'There must be at least one empty cell between groups.',
    'For example, if a row shows "2 1", it means there is a group of 2 colored cells, then an empty cell, and then one colored cell.',
    'Use the left mouse button to color cells and the right button to mark empty cells.',
    'Your goal is to correctly color all cells and reveal the hidden image.'
  ];

  rules.forEach(rule => {
    const ruleElement = document.createElement('li');
    ruleElement.textContent = rule;
    rulesContainer.append(ruleElement);
  });

  rulesScreen.append(rulesContainer);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('btn-wrapper');
  rulesScreen.append(buttonContainer);

  const backButton = document.createElement('button');
  backButton.textContent = 'Back to Menu';
  backButton.addEventListener('click', showMenuScreen);
  buttonContainer.append(backButton);
};

export const showCreateScreen = () => {
  clearBody();

  const createScreen = document.createElement('div');
  createScreen.classList.add('screen');
  createScreen.setAttribute('id', 'create-screen');
  body.append(createScreen);

  addThemeButton(createScreen);
  addSoundButton(createScreen, audio);

  const heading = document.createElement('h1');
  heading.textContent = 'Create New Level';
  createScreen.append(heading);

  const sizeSelect = document.createElement('select');
  sizeSelect.innerHTML = `
    <option value="5">5x5</option>
    <option value="10">10x10</option>
    <option value="15">15x15</option>
  `;
  createScreen.append(sizeSelect);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Enter level name';
  createScreen.append(nameInput);

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = '#A3B9C9'; // Устанавливаем цвет по умолчанию
  createScreen.append(colorInput);

  const fieldContainer = document.createElement('div');
  fieldContainer.classList.add('game');
  createScreen.append(fieldContainer);

  const field = document.createElement('table');
  field.setAttribute('id', 'field');
  fieldContainer.append(field);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('btn-wrapper');
  createScreen.append(buttonContainer);

  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.addEventListener('click', showMenuScreen);
  buttonContainer.append(backButton);

  const completeButton = document.createElement('button');
  completeButton.textContent = 'Complete';
  completeButton.addEventListener('click', () => {
    const size = parseInt(sizeSelect.value);
    const name = nameInput.value || 'New Level';
    const color = colorInput.value;

    const matrix = createMatrix(size);
    const cells = field.querySelectorAll('td');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / size);
      const col = index % size;
      if (cell.classList.contains('active')) {
        matrix[row][col] = 1;
      } else if (cell.classList.contains('cross')) {
        matrix[row][col] = 2;
      } else {
        matrix[row][col] = 0;
      }
    });

    const newLevel = {
      name,
      color,
      matrix
    };
    
    // Получаем текущие сохраненные уровни
    const savedLevels = JSON.parse(localStorage.getItem('customLevels') || '[]');
    // Добавляем новый уровень
    savedLevels.push(newLevel);
    // Сохраняем обновленный список
    localStorage.setItem('customLevels', JSON.stringify(savedLevels));
    
    images.push(newLevel);
    showMenuScreen();
  });
  buttonContainer.append(completeButton);

  const initField = () => {
    const size = parseInt(sizeSelect.value);
    const oldCells = Array.from(field.querySelectorAll('td'));
    const oldSize = oldCells.length ? Math.sqrt(oldCells.length) : 0;
    
    // Сохраняем текущее состояние клеток
    const oldCellsState = oldCells.map(cell => ({
      active: cell.classList.contains('active'),
      cross: cell.classList.contains('cross'),
      row: parseInt(cell.getAttribute('id').split('-')[0]),
      col: parseInt(cell.getAttribute('id').split('-')[1])
    }));
    
    field.innerHTML = '';
    field.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    // Вычисляем смещение для центрирования
    const offset = oldSize > 0 ? Math.floor((size - oldSize) / 2) : 0;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${i}-${j}`);
        
        // Проверяем, нужно ли перенести состояние из старой сетки
        if (oldSize > 0) {
          const oldRow = i - offset;
          const oldCol = j - offset;
          
          if (oldRow >= 0 && oldRow < oldSize && oldCol >= 0 && oldCol < oldSize) {
            const oldCell = oldCellsState.find(c => c.row === oldRow && c.col === oldCol);
            if (oldCell) {
              if (oldCell.active) cell.classList.add('active');
              if (oldCell.cross) cell.classList.add('cross');
            }
          }
        }
        
        if ((i + 1) % 5 === 0) {
          if (document.body.classList.contains('dark')) {
            cell.style.borderBottom = '2px solid rgb(91, 23, 91)';
          } else {
            cell.style.borderBottom = '2px solid #000';
          }
        }
        field.append(cell);
      }
    }
    
    // Удаляем старые обработчики событий
    field.removeEventListener('click', handleClick);
    field.removeEventListener('contextmenu', handleContextMenu);
    
    // Добавляем новые обработчики событий
    field.addEventListener('click', handleClick);
    field.addEventListener('contextmenu', handleContextMenu);
  };
  
  const handleClick = (evt) => {
    if (evt.target.closest('td')) {
      const cell = evt.target.closest('td');
      if (!cell.classList.contains('cross')) {
        if (cell.classList.contains('active')) {
          startAudio('./audio/clear-cell.mp3');
        } else {
          startAudio('./audio/fill-cell.mp3');
        }
        cell.classList.toggle('active');
      }
    }
  };
  
  const handleContextMenu = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('td')) {
      const cell = evt.target.closest('td');
      if (!cell.classList.contains('active')) {
        if (cell.classList.contains('cross')) {
          startAudio('./audio/clear-cell.mp3');
        } else {
          startAudio('./audio/fill-cell.mp3');
        }
        cell.classList.toggle('cross');
      }
    }
  };
  
  sizeSelect.addEventListener('change', initField);
  initField();
};
