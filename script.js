let input = document.forms[0][0];
let searchBtn = document.forms[0][1];
let wordDiv = document.querySelector('#word-div');
let phoneticsDiv = document.querySelector('#phonetic');
let meaningsDiv = document.querySelector('#meanings');
let audioDiv = document.querySelector('#audio');
let sourceDiv = document.querySelector('#source');
searchBtn.addEventListener('click', search);

function search()
{
    let word = input.value;
    const xhr = new XMLHttpRequest();
    
    if (word.length == 0)
    {
        resetFields();
        let msg = document.createElement('p');
        msg.style.color = 'red';
        msg.style.fontSize = 'small';
        msg.innerHTML = 'Please Enter a Word!';
        wordDiv.appendChild(msg);
        return;
    }
    xhr.open('GET', `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    xhr.onload = function ()
    {
        if (xhr.status == 200)
        {
            console.log(JSON.parse(this.responseText));
            let data = JSON.parse(this.responseText)[0];
            let WORD = data['word'];
            let PHONETIC = data['phonetic'];
            let PHONETICS = data['phonetics'];
            resetFields();
            wordDiv.innerHTML = `Word: ${WORD}`;
            input.value = word;
            if (PHONETIC != undefined)
            {
                phoneticsDiv.innerHTML = `Phonetic: ${PHONETIC}`;
            }

            if (PHONETICS)
            {
                audioDiv.innerHTML = 'Audio: ';
                for (let ph of PHONETICS)
                {
                    if (ph.hasOwnProperty('audio'))
                    {
                        let symbol = ph['audio'].slice(-6, -4);
                        let audioUrl = ph['audio'];
                        if (symbol)
                        {
                
                
                            let btn = document.createElement('button');
                            btn.style.background = '#025464';
                            btn.style.margin = '0px 5px';
                            btn.style.color = 'white';
                            btn.style.border = 'none';
                            btn.style.borderRadius = '7px';
                            btn.style.padding = '5px 10px';
                            btn.innerHTML = `|> ${symbol}`;
                            btn.addEventListener('click', () => {
                                let audio = new Audio(audioUrl);
                                audio.play();
                            });
                            audioDiv.appendChild(btn);
                        }
                    }
                }
                if (audioDiv.innerHTML.length < 10)
                {
                    audioDiv.innerHTML = '';
                }
    
            } 


            meaningsDiv.innerHTML = 'Meaning:<br>';
            for (let meaning of data['meanings'])
            {
                let detail = document.createElement('details');
                let summary = document.createElement('summary');
                summary.style.color = '#025464';
                summary.innerHTML = `${meaning['partOfSpeech']}`;

                let partOfSpeech = document.createElement('ul');
    
                for (let definition of meaning['definitions'])
                {
        
                    let li = document.createElement('li');
                    li.innerHTML = definition['definition'];
                    partOfSpeech.appendChild(li);
                }
    
                detail.appendChild(summary);
                detail.appendChild(partOfSpeech);
                meaningsDiv.appendChild(detail);
    
            }

            let sourceUrl = data['sourceUrls'];
            if (sourceUrl) 
            {
                let wikipediaLink = document.createElement('a');
                wikipediaLink.setAttribute('href', sourceUrl);
                wikipediaLink.setAttribute('target', '_blank');
                wikipediaLink.setAttribute('style', 'background: #025464; color: white; padding: 5px 10px; text-decoration: none;');
                wikipediaLink.innerHTML = 'Wikipedia';
                sourceDiv.appendChild(wikipediaLink);
            }
        }
        else if (xhr.status == 404)
        {
            resetFields();
            let msg = document.createElement('p');
            msg.style.color = 'red';
            msg.style.fontSize = 'small';
            msg.innerHTML = 'WORD NOT FOUND!';
            wordDiv.appendChild(msg);
        }
        else
        {
            resetFields();
            let msg = document.createElement('p');
            msg.style.color = 'red';
            msg.style.fontSize = 'small';
            msg.innerHTML = 'OOPS! Some error occurred!';
            wordDiv.appendChild(msg);
        }
    }

    xhr.send();
}

function play(url)
{
    let audio = new Audio(url);
    audio.play();
}

function resetFields()
{
    wordDiv.innerHTML = '';
    phoneticsDiv.innerHTML = '';
    meaningsDiv.innerHTML = '';
    audioDiv.innerHTML = '';
    input.value = '';
    sourceDiv.innerHTML = '';
}