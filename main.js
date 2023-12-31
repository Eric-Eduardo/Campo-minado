let board = [];
let minesLocation = [];
let endGame = 1;
let flagSelected = false;
let nFlags = 0;
// [[Titulo_dificuldade, numero_bombas, numero_linhas, numero_colunas]]
let difficult = [["Fácil", 7, 7, 7],
                 ["Médio", 20, 15, 15],
                 ["Difícil", 80, 20, 40]];
let currentDifficult = 0;
let numMines = difficult[currentDifficult][1];
let rows = difficult[currentDifficult][2];
let columns = difficult[currentDifficult][3];
let numCoveredTiles = rows*columns;

document.getElementById("flag").addEventListener("click", selectFlag);
document.getElementById("restart").addEventListener("click", restartGame);
document.getElementById("difficulty").addEventListener("click", setDifficulty);

window.onload = function() {
    startGame();
}

function setDifficulty() {
    let numLevels = difficult.length;
    currentDifficult = (currentDifficult+1)%numLevels;
    restartGame();
}

function generateMines() {
    let mineInserts = 0;

    while (mineInserts < numMines) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            mineInserts += 1;
        }

    }
}

function revealMines() {
    for (let i = 0; i < numMines; i++) {
        document.getElementById(minesLocation[i]).className = "tile-clicked";
        document.getElementById(minesLocation[i]).innerText = "💣";
    }
}

function restartGame () {
    let img = document.querySelector(".img-win");
    img.style.visibility="hidden";
    img.style.transition="none";
    img.style.opacity="0";
    img.style.transform = "translateY(100%)";

    document.getElementById("board").innerHTML = "";
    minesLocation = [];
    board = [];
    endGame = 1;
    flagSelected = false;
    nFlags = 0;
    numCoveredTiles = rows*columns;
    startGame();
}

function startGame() {
    rows = difficult[currentDifficult][2];
    columns = difficult[currentDifficult][3];
    numMines = difficult[currentDifficult][1];
    document.getElementById("mine-count").innerText = numMines-nFlags;
    document.getElementById("difficulty").innerText = difficult[currentDifficult][0];
    endGame = 0;
    generateMines(5);
    let boardElement = document.getElementById("board");
    boardElement.style.gridTemplateColumns = `repeat(${columns}, 35px)`;
    boardElement.style.gridTemplateRows = `repeat(${rows}, 35px)`;
    
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.className = "high-display";
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                addFlag(event.target);
            });
            row.push(tile);
            boardElement.append(tile);
        }   
        board.push(row);
    }
       // revealMines();
}

function clickTile() {
    if (endGame == 0) {
        let tile = this;
        if (flagSelected) {
            addFlag(this);

        } else if (minesLocation.includes(tile.id)) {
            this.className = "tile-clicked";
            let img = document.querySelector(".img-win");
            img.src = "./image-gameOver.jpg";
            img.style.transition="all 1s";
            img.style.visibility="visible";
            img.style.opacity="1";
            img.style.transform = "translateY(0px)";
            revealMines();

            endGame = 1;
        } else {
            let r = parseInt(tile.id.split("-")[0]);
            let c = parseInt(tile.id.split("-")[1]);
            checkTile(r, c);
        }
    }
    console.log(numCoveredTiles);
    if (numCoveredTiles == numMines) {
        endGame = 1;
        let img = document.querySelector(".img-win");
        img.src = "./image-win.jpg";
        img.style.transition="all 1s";
        img.style.visibility="visible";
        img.style.opacity="1";
        img.style.transform = "translateY(0px)";
    }
}

function checkTile(r, c) {
    if (c < 0 || c >= columns || r < 0 || r >= rows) {
        return;
    }
    if(board[r][c].innerText == "🚩") {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].className = "tile-clicked";
    numCoveredTiles -= 1;

    let nMines = 0;
    nMines += verifMine (r-1, c-1);
    nMines += verifMine (r-1, c);
    nMines += verifMine (r-1, c+1);
    nMines += verifMine (r, c-1);
    nMines += verifMine (r, c+1);
    nMines += verifMine (r+1, c-1);
    nMines += verifMine (r+1, c);
    nMines += verifMine (r+1, c+1);

    if (nMines > 0) {
        board[r][c].innerText = nMines.toString();
        board[r][c].classList.add(`x${nMines}`);
    } else {
        checkTile(r-1, c-1);
        checkTile(r-1, c);
        checkTile(r-1, c+1);
        checkTile(r, c-1);
        checkTile(r, c+1);
        checkTile(r+1, c-1);
        checkTile(r+1, c);
        checkTile(r+1, c+1);
    }
}

function verifMine(r, c) {
    if (c < 0 || c >= columns || r < 0 || r >= rows) {
        return 0;
    }
    if (minesLocation.includes(r.toString()+"-"+c.toString())) {
        return 1;
    }
    return 0;
}

function selectFlag() {
    if (flagSelected) {
        document.getElementById("flag").className = "high-display";
        flagSelected=false;
    } else {
        document.getElementById("flag").className = "low-display";
        flagSelected=true;
    }
}

function addFlag(div) {
    if (endGame == 0) {
        if (div.innerText == "🚩") {
            div.innerText = "";    
            nFlags -= 1;
            document.getElementById("mine-count").innerText = numMines-nFlags;
        } else {
            div.innerText = "🚩";
            nFlags += 1;
            document.getElementById("mine-count").innerText = numMines-nFlags;
        }
    }
}