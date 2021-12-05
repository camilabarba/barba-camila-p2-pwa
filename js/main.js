// Declaro mi Api Key:
const API_KEY = "b05c9c2b";

// Declaro mi URL:
const url = "https://www.omdbapi.com/?apikey="




// Busco por DOM en HTML:
let buttonSearch = document.getElementById('buttonSearch');
let input = document.getElementById('name');
let favMain = document.getElementById('favMain');
let showMovies = document.getElementById('showMovies');
let randomMain = document.getElementById('randomMain');
let addAndRemoveButtons = document.getElementById('addAndRemoveButtons');
let buttonSaveMovie = document.createElement('button');
let buttonRemoveMovie = document.createElement('button');
let showCards = document.getElementById('showCards');
let searchSection = document.getElementById('searchSection');
let alertErrors = document.getElementById('alert');
let buttonStatus = document.getElementById('buttonStatus');
let textStatus = document.getElementById('textStatus');
let frameSearching = document.getElementById('frameSearching');

window.addEventListener('offline', e =>{
    buttonStatus.setAttribute('src', 'img/offline.png');
    textStatus.innerHTML = "Offline";
    frameSearching.removeAttribute('class');
    searchSection.setAttribute('class', 'visually-hidden');
});

window.addEventListener('online', e =>{

    buttonStatus.setAttribute('src', 'img/online.png');
    textStatus.innerHTML = "Online";
    frameSearching.setAttribute('class', 'visually-hidden');
    searchSection.removeAttribute('class', 'visually-hidden');
    
  });


if(navigator.onLine){
    console.log('!Estamos online!');
    buttonStatus.setAttribute('src', 'img/online.png');
    textStatus.innerHTML = "Online";
    frameSearching.setAttribute('class', 'visually-hidden');
    searchSection.removeAttribute('class', 'visually-hidden');

  } else {
    console.log('Estamos offline!');
    buttonStatus.setAttribute('src', 'img/offline.png');
    textStatus.innerHTML = "Offline";
    frameSearching.removeAttribute('class');
    searchSection.setAttribute('class', 'visually-hidden');
  };

// Hago un fetch con la API

function searchMovies(movieName) {
    fetch(`${url}${API_KEY}&t=${movieName}`)
        .then(function(response) {
            console.log(response);
            
            return response.json();
        })
        .then(function(responseJSON) {
            console.log('imprimo JSON', responseJSON);
            // Tomo los resultados para hacer una lista:
            madeList(responseJSON);
            
            
            
        })
        .catch(function(error){
            console.log('Falló!', error);

            if (error = 'Movie not found!') {
                console.log('La peli no se encontró :(');
                alertErrors.innerHTML = "Movie not found! Make sure you're typing the correct name";

            }

        })
}


// Función para cuando el usuario escribe en el input y clickea Enviar 

function clickSend() {


    // El usuario no escribió nada, por lo cual le muestro el mensaje de error:

    if (input.value==="") {

        let inputVacio = document.getElementById('inputVacio');

        inputVacio.removeAttribute('class');

        alertErrors.innerHTML = 'The search input is empty! Make sure to write the name of the movie first.';


    // Si escribió algo, puedo mostrarle el resultado de esa búsqueda:

    } else {

        searchSection.setAttribute('class', 'visually-hidden');        
        searchMovies(input.value);
        showCards.removeAttribute('class');
        showCards.setAttribute('class', 'container');
        showMovieBotton();
        
        
    
    }

}

buttonSearch.addEventListener("click", clickSend);


// Guardo la película en el storage: 

const storedMovieInStorage = function (data) {
    
    console.log('Leo data a guardar', data);

        let storedMovies = JSON.parse(localStorage.getItem('Movie Response'));
    
        if(storedMovies == null) {
            console.log('Acá no había nada hasta que clickeamos añadir');
    
            let newStoredMovies = [];
            newStoredMovies.push(data);
            localStorage.setItem('Movie Response', JSON.stringify(newStoredMovies));
            buttonSaveMovie.setAttribute('color', 'green');
            buttonSaveMovie.innerHTML = "Added!"
            
            
        
        } else {
            console.log('Ya existía una lista con contenido');

            let checkAvailability = storedMovies.some(newValue => newValue.imdbID === data.imdbID);
            if(!checkAvailability) {
            console.log('Pero no la peli que acabamos de entrar, así que la pusheamos');    
            storedMovies.push(data);
            localStorage.setItem('Movie Response', JSON.stringify(storedMovies));
            buttonSaveMovie.setAttribute('style', 'border-color: white; color: white; color:green;');
            buttonSaveMovie.innerHTML = "Added!"
            
                               

            } else {
                console.log('Pero la peli que quisimos añadir ya existe en nuestro storage! Así que no se pushea');
                buttonSaveMovie.setAttribute('style', 'border-color: white; color: white; color:red;');
                buttonSaveMovie.innerHTML = "Already added!"
            }
        }

}



// Función para appenchildear el botón de agregar, y además para ir poniéndole todos los estilos que quiero:

function showMovieBotton () {

    addAndRemoveButtons.appendChild(buttonSaveMovie);
    buttonSaveMovie.setAttribute('class', 'mx-auto btn col-10');
    buttonSaveMovie.setAttribute('style', 'border-color: white; color: white;')
    buttonSaveMovie.setAttribute('type', 'button');
    buttonSaveMovie.innerHTML = "Save film";

}


// Función para crear la lista de valores cuando el usuario clickea buscar

function madeList(data){

    let movieName = document.getElementById('movieName');
    let plot = document.getElementById('plot');
    let rating = document.getElementById('rating');
    let website = document.getElementById('website');
    let image = document.getElementById('image');

    if (data['Website'] != "N/A"){
        website.setAttribute(href, data['website']);
        website.innerHTML = "Página oficial";

    }
    movieName.innerHTML = data['Title'];
    plot.innerHTML = '<span>Sinopsis:</span> ' + data['Plot'];
    rating.innerHTML = '<span>Rating:</span> ' + data['imdbRating'];
    image.setAttribute('src', data['Poster']);

    
    
    showSpinner();

    buttonSaveMovie.addEventListener('click', (e) => {
        
        storedMovieInStorage(data);
        

    });

     


}

function showSpinner() {
    spinner.classList.toggle('d-none');
}

// Función por si el usuario quiere eliminar las películas del storage:

const deleteMovieInStorage = function (data) {
    
    console.log('Leo data a delete', data);
    
    let storedMovies = JSON.parse(localStorage.getItem('Movie Response'));

    if (storedMovies == null) {
        let newStoredMovies = [];
        newStoredMovies.push(data);
        localStorage.setItem('Movie Response', JSON.stringify(newStoredMovies));


    } else {
        let checkAvailability = storedMovies.some(newValue => newValue.imdbID === data.imdbID);
        
        if (checkAvailability) {
            let newStoredMovies = storedMovies.filter(newValue => newValue.imdbID !== data.imdbID);
            localStorage.setItem('Movie Response', JSON.stringify(newStoredMovies));
 
        }

    }
}


function madeListSavedMovies() {

    let storedMovies = JSON.parse(localStorage.getItem('Movie Response'));
    console.log('storedMovies: ', storedMovies);

   for (let movie of storedMovies) {

    let movieName = movie['Title'];
    let plot = movie['Plot'];
    let rating = movie['imdbRating'];
    let image = movie['Poster'];

    console.log(movieName, plot, rating, image);

    let div = document.createElement('div');
    let card = document.createElement('div');
    let row = document.createElement('div');
    let divImg = document.createElement('div');
    let img = document.createElement('img');
    let colCardBody = document.createElement('div');
    let cardBody = document.createElement('div');
    let h3 = document.createElement('h3');
    let pPlot = document.createElement('p');
    let pRating = document.createElement('p');
    let divButton = document.createElement('div');
    let formButton = document.createElement('form');
    let buttonEliminate = document.createElement('button');

    favMain.appendChild(div);
    div.appendChild(card);
    card.appendChild(row);
    row.appendChild(divImg);
    divImg.appendChild(img);
    row.appendChild(colCardBody);
    colCardBody.appendChild(cardBody);
    cardBody.appendChild(h3);
    cardBody.appendChild(pPlot);
    cardBody.appendChild(pRating);
    colCardBody.appendChild(divButton);
    divButton.appendChild(formButton);
    formButton.appendChild(buttonEliminate);

    card.setAttribute('class', 'card mb-3 mx-auto p-2');
    card.setAttribute('style', 'background-color: transparent;border-color:white;')
    row.setAttribute('class', 'row g-0');
    divImg.setAttribute('class', 'col-md-4 text-center');
    img.setAttribute('class', 'img-fluid rounded-start');
    img.setAttribute('alt', 'Poster of the movie');
    img.setAttribute('src', image);
    colCardBody.setAttribute('class', 'col-md-8');
    cardBody.setAttribute('class', 'card-body');
    h3.setAttribute('class', 'card-title text-center');
    h3.setAttribute('style', 'color:white;')
    pPlot.setAttribute('class', 'card-text');
    pRating.setAttribute('class', 'card-text');
    divButton.setAttribute('class', 'mx-auto');
    formButton.setAttribute('class', 'mx-auto text-center');
    buttonEliminate.setAttribute('class', 'mx-auto btn w-25');
    buttonEliminate.setAttribute('type', 'button');
    buttonEliminate.setAttribute('style', 'border-color:white; color: white')

    h3.innerHTML = movieName;
    pPlot.innerHTML = '<span>Sinopsis:</span> ' + plot;
    pRating.innerHTML = '<span>Rating:</span> ' + rating;
    buttonEliminate.innerHTML = 'Eliminar';



    buttonEliminate.addEventListener('click', (e) =>{
        if (storedMovies == null) {
            let newStoredMovies = [];
            newStoredMovies.push(movie);
            localStorage.setItem('Movie Response', JSON.stringify(newStoredMovies));
    
    
        } else {
            let checkAvailability = storedMovies.some(newValue => newValue.imdbID === movie.imdbID);
            
            if (checkAvailability) {
                let newStoredMovies = storedMovies.filter(newValue => newValue.imdbID !== movie.imdbID);
                localStorage.setItem('Movie Response', JSON.stringify(newStoredMovies));
     
            }
    
        }

        location.reload();
        e.preventDefault;

    })
   



   } 

   

}




function chooseRandom () {

    let storedMovies = JSON.parse(localStorage.getItem('Movie Response'));

    const randomElement = storedMovies[Math.floor(Math.random() * storedMovies.length)];

    let movieName = randomElement['Title'];
    let plot = randomElement['Plot'];
    let rating = randomElement['imdbRating'];
    let image = randomElement['Poster'];

    console.log(movieName, plot, rating, image);

    let div = document.createElement('div');
    let card = document.createElement('div');
    let row = document.createElement('div');
    let divImg = document.createElement('div');
    let img = document.createElement('img');
    let colCardBody = document.createElement('div');
    let cardBody = document.createElement('div');
    let h3 = document.createElement('h3');
    let pPlot = document.createElement('p');
    let pRating = document.createElement('p');


    randomMain.appendChild(div);
    div.appendChild(card);
    card.appendChild(row);
    row.appendChild(divImg);
    divImg.appendChild(img);
    row.appendChild(colCardBody);
    colCardBody.appendChild(cardBody);
    cardBody.appendChild(h3);
    cardBody.appendChild(pPlot);
    cardBody.appendChild(pRating);


    card.setAttribute('class', 'card mb-3 mx-auto p-2');
    card.setAttribute('style', 'background-color: transparent;border-color:white;')
    row.setAttribute('class', 'row g-0');
    divImg.setAttribute('class', 'col-md-4 text-center');
    img.setAttribute('class', 'img-fluid rounded-start');
    img.setAttribute('alt', 'Poster of the movie');
    img.setAttribute('src', image);
    colCardBody.setAttribute('class', 'col-md-8');
    cardBody.setAttribute('class', 'card-body');
    h3.setAttribute('class', 'card-title text-center');
    h3.setAttribute('style', 'color:white;')
    pPlot.setAttribute('class', 'card-text');
    pRating.setAttribute('class', 'card-text');


    h3.innerHTML = movieName;
    pPlot.innerHTML = '<span>Sinopsis:</span> ' + plot;
    pRating.innerHTML = '<span>Rating:</span> ' + rating;



}





