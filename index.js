const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.culturagenial.com/es/peliculas-interesantes/';

async function getHtml() {
  try {
    const { data: html } = await axios.get(url);
    return html;
  } catch (error) {
    console.error('Error al obtener el HTML:', error);
    return null;
  }
}

getHtml()
  .then(html => {
    const $ = cheerio.load(html);
    const divMovies = $('.article--body');
    const movieTitles = divMovies.find('h2');
    const titles = [];

    movieTitles.each((index, movie) => {
      const title = $(movie).text();
      titles.push(title);
    });

    return titles;
  })
  .then(titles => {
    const titlesJson = JSON.stringify(titles);
    fs.writeFileSync('titles.json', titlesJson);
    console.log('Títulos guardados en el archivo "titles.json".');
  })
  .catch(error => {
    console.error('Error en el proceso de scraping:', error);
  });

  