/**
 * Display the add book form and the books saved in session
 */
window.onload = function() {
    var paragraph = document.createElement('br');
    document.getElementsByClassName('h2')[0].appendChild(paragraph);

    createBtn();
    displayBookSession();
};

/**
 * Search for a book by autor and title and display the result on the page
 * 
 * @param {string} titre Title of the book
 * @param {string} auteur Autor of the book
 */
async function fetchBooks(titre, auteur) {
    const apiKey = 'AIzaSyCEG8U-4T0V52dhuPOO5F7_vH2P25FFJns';
    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${titre}+inauthor:${auteur}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        var i = 0;

        if(data.items!=undefined){
            data.items.forEach(book => {
                displayBooks(book, "", i);
                i++;
            });
            displayBookSession();
        } else {
            displayBookNotFound();
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
    }
}

/**
 * Display all the books saved in session
 */
async function displayBookSession() {
    if(sessionStorage.length > 0) {
        for (var i = 0; i < sessionStorage.length; i++) {
            var cle = sessionStorage.key(i);
            var clePref = cle.slice(0, 4);
            var bookid = sessionStorage.getItem(cle);

            if(clePref == "book") {
                const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${bookid}`;

                try {
                    const response = await fetch(url);
                    const data = await response.json();

                    data.items.forEach(book => {
                        displayBooks(book,"Sess", i);
                    });
                } catch (error) {
                    console.error("Erreur lors de la récupération des données", error);
                }
            }
        }
    }
}

/**
 * Display a message if 0 books are found
 */
function displayBookNotFound() {
    removeElementsByClass('rech');
    removeElementsByClass('rowBooks');

    var rech = document.createElement('div');
    rech.className = "rech";
    document.getElementsByClassName('h2')[0].appendChild(rech);

    var Sep = document.createElement('hr');
    document.getElementsByClassName('rech')[0].appendChild(Sep);

    var Res = document.createElement('h2');
    Res.innerHTML = 'Résultats de recherche';
    document.getElementsByClassName('rech')[0].appendChild(Res);

    var row = document.createElement('div');
    row.className = "rowBooks";
    document.getElementsByClassName('h2')[0].appendChild(row);

    var undefined = document.createElement('h3');
    undefined.innerHTML = 'Aucun livre n’a été trouvé';
    document.getElementsByClassName('rowBooks')[0].appendChild(undefined);
}

/**
 * Display the book data on the page
 * 
 * @param {string} book Datas of the searched book or the book saved in session
 * @param {string} type Type of book: searched book or book saved in session
 * @param {number} i Number of book to display
 */
function displayBooks(book, type, i) {
    if (i == 0 && type == "Sess") {
        var rowBooksSess = document.createElement('div');
        rowBooksSess.className = "rowBooks" + type;
        document.getElementById("content").appendChild(rowBooksSess);
    } else if (i == 0 && type == "") {
        removeElementsByClass('rech');
        removeElementsByClass('rowBooks');
        removeElementsByClass('rowBooksSess');

        var rech = document.createElement('div');
        rech.className = "rech";
        document.getElementsByClassName('h2')[0].appendChild(rech);
    
        var Sep = document.createElement('hr');
        document.getElementsByClassName('rech')[0].appendChild(Sep);
    
        var Res = document.createElement('h2');
        Res.innerHTML = 'Résultats de recherche';
        document.getElementsByClassName('rech')[0].appendChild(Res);

        var rowBooks = document.createElement('div');
        rowBooks.className = "rowBooks";
        rowBooks.id = "rowBks";
        document.getElementsByClassName('h2')[0].appendChild(rowBooks);
    }
    var booki = 'book' + type + (i+1);

    var bookdiv = document.createElement('div');
    bookdiv.id = booki;
    bookdiv.className = 'book';
    document.getElementsByClassName('rowBooks' + type)[0].appendChild(bookdiv);

    var bookmark = document.createElement('a');
    bookmark.href = "#";
    if (type == "Sess") {
        bookmark.className = "fa-regular fa-trash-can fa-2x";
        bookmark.onclick = function() {
            suppBookSession(book.volumeInfo.industryIdentifiers[0].identifier);
            return false;
        };
    } else {
        bookmark.className = "fa-solid fa-bookmark";
        bookmark.onclick = function() {
            addBookSession(book.volumeInfo.industryIdentifiers[0].identifier);
            return false;
        };
    }
    document.getElementById(booki).appendChild(bookmark);

    var title = document.createElement('h3');
    title.className = 'title';
    title.innerHTML = 'Titre: ' + book.volumeInfo.title;
    document.getElementById(booki).appendChild(title);

    var identifier = document.createElement('h3');
    identifier.className = 'identifier';
    identifier.innerHTML = 'Id: ' + book.id;
    document.getElementById(booki).appendChild(identifier);

    var author = document.createElement('h3');
    author.className = 'author';
    if(book.volumeInfo.authors!=undefined){
        author.innerHTML = 'Auteur: ' + book.volumeInfo.authors[0];
    }else{
        author.innerHTML = "Auteur: N/A";
    }
    document.getElementById(booki).appendChild(author);

    var description = document.createElement('h3');
    description.className = 'description';
    if(book.volumeInfo.description!=undefined){
        description.innerHTML = 'Description: ' + book.volumeInfo.description.slice(0,200) + '...';
    }else{
        description.innerHTML = "Description: Information manquante";
    }
    document.getElementById(booki).appendChild(description);

    var img = document.createElement('img');
    if(book.volumeInfo.imageLinks!=undefined){
        img.src = book.volumeInfo.imageLinks.smallThumbnail;
    }else{
        img.className = 'imgNf';
        img.src = "unavailable.png";
    }
    document.getElementById(booki).appendChild(img);
}

/**
 * Save the book in session
 * 
 * @param {string} bookid id of the book
 */
function addBookSession(bookid) {
    if(sessionStorage.length > 0) {
        var doublon = false;

        for (var i = 0; i < sessionStorage.length; i++) {
            var cle = sessionStorage.key(i);
            var bookidSess = sessionStorage.getItem(cle);

            if (bookidSess == bookid) {
                doublon = true;
                alert("Vous ne pouvez ajouter deux fois le même livre");
            }
        }

        if(!doublon) {
            sessionStorage.setItem("book" + bookid, bookid);
        }
    } else {
        sessionStorage.setItem("book" + bookid, bookid);
    }
    removeElementsByClass('rowBooksSess');
    displayBookSession();
}

/**
 * Delete the book in session
 * 
 * @param {string} bookid id of the book
 */
function suppBookSession(bookid) {
    sessionStorage.removeItem("book" + bookid);
    removeElementsByClass('rowBooksSess');
    displayBookSession();
}

/**
 * @description Display the search book form
 * 
 */
function createBtn(){
    const form = document.createElement('form');
    form.className = 'formulaire';

    const label1 = document.createElement('label');
    label1.textContent = 'Titre du livre';
    label1.htmlFor = 'input1';

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.name = 'input1';
    input1.required = true;
    input1.id = 'input1';

    const label2 = document.createElement('label');
    label2.textContent = 'Auteur';
    label2.htmlFor = 'input2';

    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.name = 'input2';
    input2.required = true;
    input2.id = 'input2';

    const button1 = document.createElement('button');
    button1.className = 'rechercher';
    button1.type = 'button';
    button1.textContent = 'Rechercher';

    const button2 = document.createElement('button');
    button2.className = 'annuler';
    button2.type = 'button';
    button2.textContent = 'Annuler';

    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));
    form.appendChild(label1);
    form.appendChild(document.createElement('p'));
    form.appendChild(input1);
    form.appendChild(document.createElement('p'));
    form.appendChild(label2);
    form.appendChild(document.createElement('p'));
    form.appendChild(input2);
    form.appendChild(document.createElement('p'));

    // Ajouter les boutons au formulaire
    form.appendChild(document.createElement('br'))
    form.appendChild(button1);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));
    form.appendChild(button2);
    form.style.display = 'none';
    document.getElementsByClassName('h2')[0].appendChild(form);

    const formb = document.createElement('form');
    formb.className = 'button';

    var btn = document.createElement("button");
    btn.className = 'ajouter';
    btn.type = 'button';
    btn.textContent = 'Ajouter un livre';
    formb.appendChild(btn);
    document.getElementsByClassName('h2')[0].appendChild(formb);

    btn.addEventListener("click", function() {
        formb.style.display = 'none';
        form.style.display = 'block';

        removeElementsByClass('rowBooksSess');
        displayBookSession();
    });
    button1.addEventListener('click', function() {
        var titre = input1.value.trim();
        var auteur = input2.value.trim();

        if (titre === '' || auteur === '') {
            alert ('Les champs "Titre du livre" et "Auteur" sont obligatoires');
        } else {
            fetchBooks(encodeURIComponent(titre).replace(/%20/g, "+"), encodeURIComponent(auteur).replace(/%20/g, "+"));
        }
    });

    button2.addEventListener('click', function() {
        formb.style.display = 'block';
        form.style.display = 'none';

        var input1 = document.getElementById("input1");
        input1.value = "";
        var input2 = document.getElementById("input2");
        input2.value = "";
 
        removeElementsByClass('rech');
        removeElementsByClass('rowBooks');
        removeElementsByClass('rowBooksSess');
        displayBookSession();
    });
}

/**
 * Remove the class from the page
 * 
 * @param {string} className Name of the class to remove
 */
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    for(j=0; j<elements.length; j++){
        elements[0].parentNode.removeChild(elements[0]);
    }
}