export const getLinesLength = (line) => {
  const filteredLine = line.join('').split('0').filter((el) => el !== '');
  return filteredLine.map((el) => el.length);
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
  themeButton.addEventListener('click', () => {
    body.classList.toggle('dark');
  });
  themeButton.classList.add('theme-button')
  parent.append(themeButton);
};
