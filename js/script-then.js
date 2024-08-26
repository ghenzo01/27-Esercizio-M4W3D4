// SOLUZIONE CON THEN


// API:
// https://jsonplaceholder.typicode.com/users




const filter_btn = document.getElementById("filter-btn")

const dropdown = document.getElementById("dropdown")
const name_selected = document.getElementById("name-selected")
const username_selected = document.getElementById("username-selected")
const email_selected = document.getElementById("email-selected")

const search_text = document.getElementById("search-text")
const search_btn = document.getElementById("search-btn")

const table = document.getElementsByClassName("table")  // mi restituisce un array di elementi!
const table_body = document.getElementById("table-body")
const no_results = document.getElementById("no-results")


let i = 0



dropdown.addEventListener("click", (event) => {
    const clickedElement = event.target
    //console.log("HTML Elemento cliccato:", clickedElement)
    //console.log("Testo dell'elemento cliccato:", event.target.textContent)

    const span = document.createElement("span")
    span.id = "span-filter"
    span.textContent = event.target.textContent  // variabile globale, mi serve anche altrove
    span.style.fontWeight = "bold" // per il grassetto

    filter_btn.innerText = "Filter by "
    filter_btn.appendChild(span) // lo appende, ma non sotto, span non è un elemento block di default

    //console.log(filterParameterSelected.trim().toLowerCase())
});



search_btn.addEventListener("click", function () {

    getUsers()  // => essendo una funzione che ritorna una Promise, posso concatenargli un then (e devo farlo, perchè tutto quello che segue
                // andrà eseguito a dato ricevuto)

        .then(usersArray => {

            if (!usersArray) {
                // se nel fetch c'è stato un errore, mi sarà ritornato userrray = null, quindi se ho quel valore qui rigetto la Promise
                return Promise.reject("Users array is null due to a fetch error")
            }

            let searchParameter = search_text.value

            let spanFilter = document.getElementById("span-filter")

            if (!spanFilter) {
                throw new Error("No filter selected")
            }

            filterParameterSelected = spanFilter.innerText

            //console.log("users", usersArray, "params", searchParameter)

            const results = filterByValues(usersArray, searchParameter, filterParameterSelected)

            //console.log("miei risult", results)

            return results  // qui serve il return, al contrario che col metodo .json, perchè .json ritorna una Promise, mentre filterByValues
            // ritorna un normale dato. Per i metodi che ritornano una Promise non serve mettere return per passare i dati tra un then
            // e il successivo
        })

        .then(filteredArray => {

            cleanInterface()

            // se metto solo if(!filteredArray) nella condizione dell'if sto controllando se filteredArray è un oggetto
            // e in realtà lo è sempre, anche quando vuoto (cioè quando non ho risultati)!
            // Pertanto è un controllo sbagliato logicamente, devo controllare la sua length per vedere che non contenga alcun elemento
            if (!filteredArray.length) {

                no_results.classList.remove("d-none")
                no_results.innerText = "No results found"
                return
            }

            else {
                filteredArray.forEach(filteredElement => createRow(filteredElement))
            }
        })


        .catch(error => {
            alert(`Error during data elaboration: ${error}`);
            throw error
        })

})



const getUsers = () => {

    return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            //throw Error("errore fittizio fetch")  // scommentare riga per generare un errore fittizio
            return response.json()  // restituisce implicitamente una Promise con i dati JSON e passa il nuovo array al then successivo

            //.then(json =>  {console.log(json) 
            //return response    // se faccio solo il console.log e non ritorno niente, non passerà nulla al then o al catch successivo se ne avessi uno,
            // perchè console.log di per sè non restituisce nulla! E anche se restituisse qualcosa, per qualunque cosa restituita
            // che non sia una Promise, devo sempre mettere il return per passare i dati tra un then e il suo successivo.
            //})


        })

        // GESTIONE ERRORI:
        .catch(error => {
            alert(`Error during fetch: ${error}`);

            // alert('Si è verificato un errore durante il fetch:', error); // => sbagliato, alert accetta 1 solo argomento!

            //throw error  // propaga l'errore nella catena di fetch in modo che possa essere gestito a livello superiore,
            // per cui l'errore viene gestito qui, ma viene anche propagato ai prossimi catch e ai meccanismi
            // di gestione degli errori di livello superiore.

            return null
        })


}



const filterByValues = (array, searchParameter, filterParameterSelected) => {

    let filterParameter

    switch (filterParameterSelected) {
        case 'Nome':
            filterParameter = "name"
            break

        case 'Username':
            filterParameter = "username"
            break

        case 'e-mail':
            filterParameter = "email"
            break

        default:
            filterParameter = null

    }

    if (!filterParameter) {
        throw new Error("No filter selected")

        //return []  // ritorno array vuoto per evitare di ritornare un undefined o null, che possono generare problemi in altre funzioni
        //return     // non ritorno niente, ma il codice continua!
    }

    else {
        return array.filter(element => element[filterParameter].toLowerCase().includes(searchParameter.toLowerCase()))

    }


}



const cleanInterface = () => {

    i = 0 // azzero anche il contatore delle righe

    table_body.innerHTML = ""
    // table[0].innerHTML="" ==> se la svuoto non viene più generata, quindi non torna più! Devo nasconderla.

    // qui la nasconto, la rimetto visibile nel metodo che genera le righe qualora ci siano risultati
    if (!table[0].classList.contains("d-none")) {
        table[0].classList.add("d-none");
    }

    // setto come invisibile il div che mostra il messaggio di 'No results found', se non lo è già
    if (!no_results.classList.contains("d-none")) {
        no_results.classList.add("d-none");
    }


}



const createRow = (el) => {

    if (table[0].classList.contains("d-none")) {
        table[0].classList.remove("d-none");
    }

    const row = document.createElement("tr")

    i++
    const row_header = document.createElement("th")
    row_header.scope = "row"
    row_header.innerText = i

    const cell_name = document.createElement("td")
    cell_name.innerText = el.name

    const cell_username = document.createElement("td")
    cell_username.innerText = el.username

    const cell_mail = document.createElement("td")
    cell_mail.innerText = el.email


    // appendo le celle alla riga
    // NB: con appendChild non posso passargli più argomenti separati da virgola ','
    row.appendChild(row_header)
    row.appendChild(cell_name)
    row.appendChild(cell_username)
    row.appendChild(cell_mail)


    //console.log(row)


    // appendo la row al corpo della tabella
    table_body.appendChild(row)



}







