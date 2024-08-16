

if (!localStorage.getItem('totalWins')){
    localStorage.setItem('totalWins', 0)
}
let totalWins = Number(localStorage.getItem('totalWins'))

document.querySelector('.total-wins').textContent = `Total Wins: ${totalWins}`



if (!localStorage.getItem('recordTime')){
    localStorage.setItem('recordTime', 'N/A')
}

let recordTime = localStorage.getItem('recordTime')

if(Number(localStorage.getItem('recordTime'))){

    recordTime = Number(localStorage.getItem('recordTime'))

    // document.querySelector('.best-time').textContent = `Record Time: ${recordTime}`
}



if (!localStorage.getItem('recordDuration')){
    localStorage.setItem('recordDuration', Infinity)
}

if(isFinite(+localStorage.getItem('recordDuration'))){
    document.querySelector('.best-time').textContent = `Record Time: ${recordTime}`
}




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

let unadjustedNames = []

let chosenNames = []


function chosenWords(){
    while (unadjustedNames.length <= 2){
        let randomIndex = Math.floor(Math.random() * arrOfNames.length)
        let possible = arrOfNames[randomIndex]
        if (!unadjustedNames.includes(possible)){
            unadjustedNames.push(possible)
        }
    }
    console.log(unadjustedNames)
    let ul = document.querySelector('#word-list')
    unadjustedNames.forEach(name => {
        const li = document.createElement('li')
        li.textContent = name
        ul.appendChild(li)
    })


    for (let i = 0 ; i < unadjustedNames.length ; i++){
        chosenNames[i] = unadjustedNames[i].replaceAll(' ', '').replaceAll('-','').replaceAll('é', 'e').toUpperCase()
    }
    console.log(arrOfNames)
    console.log(chosenNames)
    console.log(unadjustedNames)


    const gridSize = 15
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
        [1 , -1],
        [-1 , 1],
        [0 , -1],
        [-1 , 0],
    ]

    const gridSize = grid.length
    let inserted = false

    while (!inserted){
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const [dx, dy] = direction

        let startY = Math.floor(Math.random() * gridSize)
        let startX = Math.floor(Math.random() * gridSize)

        if (startX + dx * (word.length - 1) >= 0 &&
            startX + dx * (word.length - 1) < gridSize &&
            startY + dy * (word.length - 1) >= 0 &&
            startY + dy * (word.length - 1) < gridSize
        ){
                let canInsert = true
                for (let i = 0 ; i < word.length ; i++){
                    const y = startY + dy * i
                    const x = startX + dx * i
                    if (grid[y][x] !== '' && grid[y][x] !== word[i]){
                        canInsert = false
                        break;
                    }
                }

                if (canInsert){
                    for (let i = 0 ; i < word.length; i++){
                        const y = startY + dy * i
                        const x = startX + dx * i
                        grid[y][x] = word[i]
                    }
                    inserted = true
                }
            }
        if (!inserted){
            console.log(`couldnt insert ${word}`)
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
    document.addEventListener('mousemove', updateSelection)
    document.addEventListener('mouseup', endSelection)

    gridElement.addEventListener('touchstart', handleTouchStart)
    gridElement.addEventListener('touchmove', handleTouchMove)
    gridElement.addEventListener('touchend', handleTouchEnd)
    
    startTimer()
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

let timer,
    running,
    display,
    duration = 0

function startTimer(){
    if (running === 1){
        console.log('the timer has already begun')
        return
    }
    let begin = +new Date()
    timer = setInterval(() => {
        duration = ((+new Date() - begin) / 1000)
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);
        let hundredths = Math.floor((duration % 1) * 100);
        
        if (minutes < 1) {
            if (seconds < 1) {
                display = `Time: .${hundredths.toString().padStart(2, '0')}`;
            } else if (seconds < 10) {
                display = `Time: ${seconds}.${hundredths.toString().padStart(2, '0')}`;
            } else {
                display = `Time: ${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
            }
        } else {
            display = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
        }

        document.querySelector('.current-time').textContent = display
    },10)
    running = 1
}

function stopTimer(){
    if (running === 0){
        console.log('timers not running')
        return
    }
    clearInterval(timer)
}

function resetTimer(){
    duration = 0
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
    const cells = []
    const startRow = start.parentNode.rowIndex
    const startCol = start.cellIndex
    const endRow = end.parentNode.rowIndex
    const endCol = end.cellIndex

    const rowStep = Math.sign(endRow - startRow) || 0
    const colStep = Math.sign(endCol - startCol) || 0

    let currentRow = startRow
    let currentCol = startCol

    while (true){
        const cell = document.querySelector(`#word-search-grid tr:nth-child(${currentRow + 1}) td:nth-child(${currentCol + 1})`)
        if (!cell) break;
        cells.push(cell)

        if (currentRow === endRow && currentCol === endCol) break;

        currentRow += rowStep
        currentCol += colStep
    }

    return cells
}


function checkSelectedWord(){
    const selectedWord = selectedCells.map(cell => cell.textContent).join('')
    const reversedWord = selectedWord.split('').reverse().join('')

    let foundWord = ''
    let index = -1

    for (let i = 0 ; i < chosenNames.length ; i++){
        if (chosenNames[i] === selectedWord || chosenNames[i] === reversedWord){
            foundWord = chosenNames[i]
            index = i
            break;
        }
    }

    if (index !== -1){
        const wordListItem = document.getElementById('word-list').children[index]
        if (!wordListItem.classList.contains('found')){
            markWordAsFound(foundWord)
        }
    }
}

function markWordAsFound(word){
    const wordListItems = Array.from(document.querySelectorAll('#word-list li'))
    let index = chosenNames.indexOf(word)
    if (index === -1){
        return
    }else{
        wordListItems[index].classList.add('found')
    }

    selectedCells.forEach(cell => cell.classList.add('found'))
    checkWin()
}

function checkWin(){
    let totalFoundWords = document.querySelectorAll('#word-list li.found').length
    if (totalFoundWords >= chosenNames.length){
        stopTimer()
        addToTotalWins()
        setRecordTime()
    }
}

function addToTotalWins(){
    if (!localStorage.getItem('totalWins')){
        localStorage.setItem('totalWins', 0)
    }
    let totalWins = Number(localStorage.getItem('totalWins'))
    totalWins++
    localStorage.setItem('totalWins', totalWins)
    document.querySelector('.total-wins').textContent = `Total Wins: ${totalWins}`
}

function setRecordTime(){
    if (!localStorage.getItem('recordTime')){
        localStorage.setItem('recordTime', 'N/A')
    }
    if (!localStorage.getItem('recordDuration')){
        localStorage.setItem('recordDuration', Infinity)
    }
    // add local storage for duration
    // set it equal to Infinity if it doesnt exist
    // (do same at top of page)
    // set recordTime = to that value and replace below
    let recordDuration = localStorage.getItem('recordDuration')
    if (+recordDuration){
        if (duration < recordDuration){
            localStorage.setItem('recordDuration', duration)
            localStorage.setItem('recordTime', display)
            document.querySelector('.best-time').textContent = `Record Time: ${display}`
        }
    }
}

// let recordTime = Number(localStorage.getItem('recordTime'))
// localStorage.setItem('recordTime', 'N/A')

// document.querySelector('.best-time').textContent = `Record Time: ${recordTime}`

// let timer,
//     running,
//     display, mm : ss . dd
//     duration = 0 ssssss.dd

//     timer = setInterval(() => {
//         duration = ((+new Date() - begin) / 1000)
//         let minutes = Math.floor(duration / 60);
//         let seconds = Math.floor(duration % 60);
//         let hundredths = Math.floor((duration % 1) * 100);
        
//         // let display;
//         if (minutes < 1) {
//             if (seconds < 1) {
//                 display = `.${hundredths.toString().padStart(2, '0')}`;
//             } else if (seconds < 10) {
//                 display = `${seconds}.${hundredths.toString().padStart(2, '0')}`;
//             } else {
//                 display = `${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
//             }
//         } else {
//             display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
//         }

//         document.querySelector('.current-time').textContent = display
//     },10)


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

// initializeWordSearch()
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