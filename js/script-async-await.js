// SOLUZIONE CON ASYNC-AWAIT


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



search_btn.addEventListener("click", async function () {
    try {
        const usersArray = await getUsers() // attende che getUsers risolva la Promise e restituisca i dati

        if (!usersArray) {
            // se nel fetch c'è stato un errore, mi sarà ritornato userrray = null, quindi se ho quel valore qui esco dal codice
            return
        }

        let searchParameter = search_text.value

        let spanFilter = document.getElementById("span-filter")

        if (!spanFilter) {
            throw new Error("No filter selected") // lancia un errore se non è stato selezionato alcun filtro
        }

        filterParameterSelected = spanFilter.innerText

        // nella versione con then la funzione filterByValues era dentro un then, ma essendo asincrona poteva stare anche fuori dal then
        // qui, non essendo asincrona e non restituendo una Promise, non serve usarla con await
        const results = filterByValues(usersArray, searchParameter, filterParameterSelected)

        cleanInterface()

        //throw Error("errore fittizio elaborazione")  // scommentare riga per generare un errore fittizio

        if (!results.length) {
            no_results.classList.remove("d-none")
            no_results.innerText = "No results found"
            return
        }

        results.forEach(filteredElement => createRow(filteredElement))

    } catch (error) {
        alert(`Error during data elaboration: ${error.message}`)
        //throw error // non rilancio l'errore se commento il throw
    }
});



const getUsers = async () => {

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')


        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        //throw Error("errore fittizio fetch")  // scommentare riga per generare un errore fittizio
        const data = await response.json()  // await restituisce sempre una promise

        return data

    }

    catch (error) {
        // GESTIONE ERRORI:
        alert(`Error during fetch: ${error}`);
        //alert('Si è verificato un errore durante il fetch:', error); // => sbagliato, alert accetta 1 solo argomento!

        //throw error  // propaga l'errore nella catena di fetch in modo che possa essere gestito a livello superiore,
        // per cui l'errore viene gestito qui, ma viene anche propagato ai prossimi catch e ai meccanismi
        // di gestione degli errori di livello superiore.

        // se scelgo di non propagare l'errore, lo ricevo qui una sola volta e ritorno un valore null, così con un controllo 
        // a valle deciderò che, se ho il valore null, non proseguo nelle successive operazioni ed esco dall'esecuzione del programma
        return null

    }

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

        //return []  //ritorno array vuoto per evitare di ritornare un undefined o null, che possono generare problemi in altre funzioni
        //return     //non ritorno niente, ma il codice continua!
    }

    else {
        return array.filter(element => element[filterParameter].toLowerCase().includes(searchParameter.toLowerCase()))

    }


}



const cleanInterface = () => {

    i = 0 // azzero anche il contatore delle righe

    table_body.innerHTML = ""
    //table[0].innerHTML="" ==> se la svuoto non viene più generata, quindi non torna più! Devo nasconderla.

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


