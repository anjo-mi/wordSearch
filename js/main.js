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
    let ul = document.querySelector('#word-list')
    chosenNames.forEach(name => {
        const li = document.createElement('li')
        li.textContent = name
        ul.appendChild(li)
    })


    for (let i = 0 ; i < chosenNames.length ; i++){
        chosenNames[i] = chosenNames[i].replaceAll(' ', '').replaceAll('-','').replaceAll('é', 'e').toUpperCase()
    }
    console.log(arrOfNames)
    console.log(chosenNames)


    const gridSize = 20
    const grid = createGrid(gridSize)
    chosenNames.forEach(word => insertWord(grid, word))
    fillGrid(grid)
    displayGrid(grid)
    initializeWordSearch()
}

setTimeout(chosenWords, 5000)

function createGrid(size){
    return Array(size).fill().map(() => Array(size).fill(''))
}

function insertWord(grid,word){
    const directions = [
        [0 , 1],
        [1 , 0],
        [1 , 1],
        [1 , -1]
    ]

    const gridSize = grid.length
    let inserted = false

    while (!inserted){
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const [dx, dy] = direction

        let startX = Math.floor(Math.random() * gridSize)
        let startY = Math.floor(Math.random() * gridSize)

        if (startX + dx * (word.length - 1) < gridSize &&
            startY + dy * (word.length - 1) < gridSize){
                let canInsert = true
                for (let i = 0 ; i < word.length ; i++){
                    const x = startX + dx * i
                    const y = startY + dy * i
                    if (grid[y][x] !== '' && grid[y][x] !== word[i]){
                        canInsert = false
                        break;
                    }
                }

                if (canInsert){
                    for (let i = 0 ; i < word.length; i++){
                        const x = startX + dx * i
                        const y = startY + dy * i
                        grid[y][x] = word[i]
                    }
                    inserted = true
                }
            }
    }
}

function fillGrid(grid){
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let y = 0 ; y < grid.length ; y++){
        for (let x = 0 ; x < grid.length ; x++){
            if (grid[y][x] === ''){
                grid[y][x] = letters[Math.floor(Math.random() * letters.length)]
            }
        }
    }
}

function displayGrid(grid){
    const gridElement = document.getElementById('word-search-grid')
    gridElement.innerHTML = ''
    for (let y = 0 ; y < grid.length ; y++){
        const row = document.createElement('tr')
        for (let x = 0 ; x < grid[y].length ; x++){
            const cell = document.createElement('td')
            cell.className = 'grid-cell'
            cell.textContent = grid[y][x]
            row.appendChild(cell)
        }
        gridElement.appendChild(row)
    }
}



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
    if (chosenNames.includes(selectedWord)){
        markWordAsFound(selectedWord)
    }
}

function markWordAsFound(word){
    const index = chosenNames.indexOf(word)
    if(index > -1){
        chosenNames[index] = `${word} (found)`
    }
    updateWordListDisplay()

    selectedCells.forEach(cell => cell.classList.add('found'))
    
}

function updateWordListDisplay(){
    const wordListElement = document.getElementById('word-list')
    wordListElement.innerHTML = ''
    chosenNames.forEach(word => {
        const li = document.createElement('li')
        li.textContent = word
        if (word.includes('(found')){
            li.classList.add('found')
        }
        wordListElement.appendChild(li)
    })
}

function handleTouchStart(event){
    const touch = event.touches[0]
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    if (target.classList.contains('grid-cell')){
        startSelection( {target} )
    }
}

function handleTouchMove(event){
    event.preventDefault()
    const touch = event.touches[0]
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    if (target.classList.contains('grid-cell')){
        updateSelection( {target} )
    }
}

function handleTouchEnd(){
    endSelection()
}

initializeWordSearch()
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