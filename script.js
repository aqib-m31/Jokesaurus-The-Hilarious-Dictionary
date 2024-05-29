// Variables to reference HTML elements
const input = document.forms[0][0];
const searchBtn = document.forms[0][1];
const wordDiv = document.querySelector('#word-div');
const phoneticsDiv = document.querySelector('#phonetic');
const meaningsDiv = document.querySelector('#meanings');
const audioDiv = document.querySelector('#audio');
const sourceDiv = document.querySelector('#source');
const joke = document.querySelector('#joke');
const jokeDiv = document.querySelector('.joke-sec');
const btn = document.querySelector(".btn-toggle");

searchBtn.addEventListener('click', () => {
    // Initiate the search for the word's meaning and fetch a related joke.
    search();
    getJoke();
});


// Fetch word details from dictionary API and display them.
// If word is not found, display an error message.
async function search() {
    const word = input.value;
    const xhr = new XMLHttpRequest();

    if (word.length == 0) {
        resetFields();
        const msg = document.createElement('p');
        msg.style.color = 'red';
        msg.style.fontSize = 'small';
        msg.innerHTML = 'Please Enter a Word!';
        wordDiv.appendChild(msg);
        return;
    }
    xhr.open('GET', `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, true);

    xhr.onload = function () {
        if (xhr.status == 200) {
            const data = JSON.parse(this.responseText)[0];
            const WORD = data['word'];
            const PHONETIC = data['phonetic'];
            const PHONETICS = data['phonetics'];
            resetFields();
            wordDiv.innerHTML = `<b>Word:</b> ${WORD}`;
            input.value = word;
            if (PHONETIC != undefined) {
                phoneticsDiv.innerHTML = `<b>Phonetic:</b> ${PHONETIC}`;
            }

            if (PHONETICS) {
                audioDiv.innerHTML = '<b>Audio:</b> ';
                for (const ph of PHONETICS) {
                    if (ph.hasOwnProperty('audio')) {
                        const symbol = ph['audio'].slice(-6, -4);
                        const audioUrl = ph['audio'];
                        if (symbol) {


                            const btn = document.createElement('button');
                            btn.style.background = '#025464';
                            btn.style.margin = '0px 5px';
                            btn.style.color = 'white';
                            btn.style.border = 'none';
                            btn.style.borderRadius = '7px';
                            btn.style.padding = '5px 10px';
                            btn.innerHTML = `|> ${symbol}`;
                            btn.addEventListener('click', () => {
                                const audio = new Audio(audioUrl);
                                audio.play();
                            });
                            audioDiv.appendChild(btn);
                        }
                    }
                }
                if (audioDiv.innerHTML.length < 20) {
                    audioDiv.innerHTML = '';
                }

            }


            meaningsDiv.innerHTML = '<b>Meaning:</b><br>';
            for (const meaning of data['meanings']) {
                const detail = document.createElement('details');
                const summary = document.createElement('summary');
                summary.setAttribute('class', 'summary-light');
                summary.innerHTML = `<b>${meaning['partOfSpeech']}<b>`;

                const partOfSpeech = document.createElement('ul');

                for (const definition of meaning['definitions']) {

                    const li = document.createElement('li');
                    li.innerHTML = definition['definition'];
                    partOfSpeech.appendChild(li);
                }

                detail.appendChild(summary);
                detail.appendChild(partOfSpeech);
                meaningsDiv.appendChild(detail);

            }

            const sourceUrl = data['sourceUrls'];
            if (sourceUrl) {
                const wikipediaLink = document.createElement('a');
                wikipediaLink.setAttribute('href', sourceUrl);
                wikipediaLink.setAttribute('target', '_blank');
                wikipediaLink.setAttribute('style', 'background: #025464; color: white; padding: 5px 10px; text-decoration: none;');
                wikipediaLink.innerHTML = 'Wikipedia';
                sourceDiv.appendChild(wikipediaLink);
            }
        }
        else if (xhr.status == 404) {
            resetFields();
            const msg = document.createElement('p');
            msg.style.color = 'red';
            msg.style.fontSize = 'small';
            msg.innerHTML = 'WORD NOT FOUND!';
            wordDiv.appendChild(msg);
        }
        else {
            resetFields();
            const msg = document.createElement('p');
            msg.style.color = 'red';
            msg.style.fontSize = 'small';
            msg.innerHTML = 'OOPS! Some error occurred!';
            wordDiv.appendChild(msg);
        }
    }

    xhr.send();
}

// Fetch a joke from the API.
async function getJoke() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&contains=${input.value}`, true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            const jokeInfo = JSON.parse(xhr.responseText);
            if (!Boolean(jokeInfo['error'])) {
                if (jokeInfo['type'] == 'single') {
                    joke.innerHTML = jokeInfo['joke'];
                }
                else if (jokeInfo['type'] == 'twopart') {
                    const setup = jokeInfo['setup'].replaceAll('\n', '<br>').trim();
                    const delivery = jokeInfo['delivery'].replaceAll('\n', '<br>').trim();
                    joke.innerHTML = `${setup}<br>${delivery}<br>`;
                }
            }
            else {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit`, true);
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        const jokeInfo = JSON.parse(xhr.responseText);
                        if (jokeInfo['type'] == 'single') {
                            joke.innerHTML = jokeInfo['joke'];
                        }
                        else if (jokeInfo['type'] == 'twopart') {
                            const setup = jokeInfo['setup'].replaceAll('\n', '<br>').trim();
                            const delivery = jokeInfo['delivery'].replaceAll('\n', '<br>').trim();
                            joke.innerHTML = `${setup}<br>${delivery}<br>`;
                        }
                    }
                    else {
                        console.log('Error', jokeInfo);
                    }
                }
                xhr.send();
            }
        }
    }

    xhr.send();
}

// Play audio from provided URL.
function play(url) {
    const audio = new Audio(url);
    audio.play();
}

// Clear all fields and input value.
function resetFields() {
    wordDiv.innerHTML = '';
    phoneticsDiv.innerHTML = '';
    meaningsDiv.innerHTML = '';
    audioDiv.innerHTML = '';
    input.value = '';
    sourceDiv.innerHTML = '';
}

// Toggle theme on button click and store preference.
btn.addEventListener("click", function () {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    if (document.getElementById('tagline').style.color != 'white') {
        document.getElementById('tagline').style.color = 'white';
    }
    else {
        document.getElementById('tagline').style.color = 'black';
    }
});

// Set theme on page load based on saved preference.
document.addEventListener('DOMContentLoaded', (event) => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add("dark-theme");
        document.getElementById('tagline').style.color = 'white';
    } else {
        document.body.classList.remove("dark-theme");
        document.getElementById('tagline').style.color = 'black';
    }
});