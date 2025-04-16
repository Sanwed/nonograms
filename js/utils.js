import { audio } from './init-game.js';

const fullVolume = (audio) => {
  audio.volume = 0.5;
  localStorage.setItem('sound', true);
}

const mute = (audio) => {
  audio.volume = 0;
  localStorage.setItem('sound', false);
}

export const getLinesLength = (arr) => {
  const result = [];
  let count = 0;
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 1) {
      count++;
    } else if (count > 0) {
      result.push(count);
      count = 0;
    }
  }
  
  if (count > 0) {
    result.push(count);
  }
  
  // Если нет ни одной закрашенной клетки, возвращаем [0]
  if (result.length === 0) {
    return [0];
  }
  
  return result;
};

export const getArrayColumns = (arr) => {
  return arr[0].map((col, i) => arr.map(row => row[i]));
};

export const clearBody = () => {
  const body = document.body;
  body.innerHTML = '';
};

export const getRandomArrayElem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const addThemeButton = (parent) => {
  const body = document.body;
  const themeButton = document.createElement('button');
  const themeImage = document.createElement('img');
  themeImage.src = './img/month.png';
  themeImage.width = 30;
  themeImage.height = 30;
  themeButton.append(themeImage);
  
  const theme = localStorage.getItem('theme');

  let isDark = theme === 'dark';

  themeButton.addEventListener('click', () => {
    if (isDark) {
      localStorage.setItem('theme', 'light');
      body.classList.remove('dark');
    } else {
      localStorage.setItem('theme', 'dark');
      body.classList.add('dark');
    }
    isDark = !isDark;
  });
  themeButton.classList.add('theme-button')
  parent.append(themeButton);
};

export const addSoundButton = (parent, audioElement) => {
  const soundButton = document.createElement('button');
  const soundImage = document.createElement('img');

  // Получаем сохранённое значение (строка)
  const hasSound = localStorage.getItem('sound');

  // Если в localStorage "false" — звук выключен
  let isMuted = hasSound === 'false';

  // Устанавливаем начальную картинку
  soundImage.src = isMuted ? './img/no-sound.svg' : './img/sound.svg';
  soundImage.width = 30;
  soundImage.height = 30;
  soundButton.append(soundImage);

  // Применяем состояние к звуку
  if (isMuted) {
    mute(audioElement);
  } else {
    fullVolume(audioElement);
  }

  soundButton.addEventListener('click', () => {
    isMuted = !isMuted;
    soundImage.src = isMuted ? './img/no-sound.svg' : './img/sound.svg';
    localStorage.setItem('sound', isMuted.toString());
    
    if (isMuted) {
      mute(audioElement);
    } else {
      fullVolume(audioElement);
    }
  });

  soundButton.classList.add('sound-button');
  parent.append(soundButton);
}

export const startAudio = (src, time = 500) => {
  audio.src = src;

  audio.play().then(() => {
    setTimeout(() => {
      audio.pause();
    }, time);
  });
};