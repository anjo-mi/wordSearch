let url = `https://swapi.dev/api/people/?page=1`

let arrOfNames = []


function getChars(url){
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            data.results.forEach(el => {
                arrOfNames.push(el.name)
            })
            if(data.next !== null){
                getChars(data.next)
            }

        })
        .catch(err => {
            console.log(` the error: ${err}, occurred`)
        })
        console.log(arrOfNames)
}

getChars(url)

let chosenNames = []
function chosenWords(){
    while (chosenNames.length <= 9){
        let randomIndex = Math.floor(Math.random() * arrOfNames.length)
        let possible = arrOfNames[randomIndex]
        if (!chosenNames.includes(possible)){
            chosenNames.push(possible)
        }
    }
    console.log(chosenNames)
    for (let i = 0 ; i < chosenNames.length ; i++){
        chosenNames[i] = chosenNames[i].replaceAll(' ', '').replaceAll('-','').toUpperCase()
    }
    console.log(chosenNames)
}

setTimeout(chosenWords, 5000)



let isSelecting = false
let startCell = null
let currentCell = null
let selectedCells = []

function initializeWordSearch(){
    const gridElement = document.getElementById('word-search-grid')

    gridElement.addEventListener('mousedown', startSelection)
    gridElement.addEventListener('mousemove', updateSelection)
    document.addEventListener('mouseup', endSelection)

    gridElement.addEventListener('touchstart', handleTouchStart)
    gridElement.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchup', handleTouchEnd)
}

function startSelection(event){
    if (event.target.classList.contains('grid-cell')){
        isSelecting = true
        startCell = event.target
        currentCell = event.target
        updateHighlight()
    }
}

function updateSelection(event){
    if (isSelecting && event.target.classList.contains('grid-cell')){
        currentCell = event.target
        updateHighlight()
    }
}

function endSelection(){
    if (isSelecting){
        isSelecting = false
        checkSelectedWord()
        clearHighlight()
    }
}

function updateHighlight(){
    clearHighlight()
    selectedCells = getSelectedCells(startCell, currentCell)
    selectedCells.forEach(cell => cell.classList.add('highlighted'))
}

function clearHighlight(){
    document.querySelectorAll('.grid-cell.highlighted').forEach(cell => {
        cell.classList.remove('highlighted')
    })
}

function getSelectedCells(start, end){
    const startIndex = Array.from(start.parentNode.children).indexOf(start)
    const endIndex = Array.from(end.parentNode.children).indexOf(end)
    const startRow = start.parentNode.rowIndex
    const endRow = end.parentNode.rowIndex

    const cells = []
    const rowDiff = endRow - startRow
    const colDiff = endIndex - startIndex
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))

    if (steps === 0){
        cells.push(start)
    }else{
        const rowStep = rowDiff / steps
        const colStep = colDiff / steps

        for (let i = 0 ; i <= steps ; i++){
            const row = startRow + Math.round(i + rowStep)
            const col = startIndex + Math.round(i + colStep)
        cells.push(document.querySelector(`#word-search-grid tr:nth-child(${row + 1}) td:nth-child(${col + 1})`))
        }
    }
    return cells
}


function checkSelectedWord(){
    const selectedWord = selectedCells.map(cell => cell.textContent).join('')
    if (chosenWords.includes(selectedWord)){
        markWordAsFound(selectedWord)
    }
}

function markWordAsFound(word){
    let foundWord = chosenWords.filter(el => el = word)
    
}


// one piece fetch call----------------------------------------------
// let docs = 'https://api-onepiece.com/fr/documentation'
// let url = 'https://api.api-onepiece.com/v2/characters/fr'

// function getChars(url){
//     fetch(url)
//         .then(res => res.json())
//         .then(data => {
//             console.log(data)
            // if(data.next !== null){
            //     getChars(data.next)
            // }

//         })
//         .catch(err => {
//             console.log(` the error: ${err}, occurred`)
//         })
// }

// getChars(url)