let Gameboard = (() => {
    let board = ['', '','','', '','','', '','',]

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if(board[index] === '') {
            board[index] = marker
            return true;
        } else {
            return false
        }

    }
    const resetBoard = () => {
        board = ['', '','','', '','','', '','',]
    }

    return {getBoard, updateBoard, resetBoard}
})()

const Player = (name, marker) => {
    return { name, marker}
};

const GameController = (() => {
    const player1 = Player("Player One", "X")
    const player2 = Player("Player Two", "0")
    let currentPlayer = player1;
    
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ?  player2 : player1
    }

    const getCurrentPlayer = () => currentPlayer;

    const checkWinner = () => {
        const board = Gameboard.getBoard()
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                return currentPlayer
            }
        }

        if(board.every(cell => cell !== '')) {
            return 'Tie'
        }
        return null
    }

    const playRound = (index) => {
        if(Gameboard.updateBoard(index, currentPlayer.marker)) {
            const winner = checkWinner()
            if(winner) {
                return winner
            }
            switchPlayer()
        }
        return null;
    }

    const resetGame = () => {
        Gameboard.resetBoard()
        currentPlayer = player1
    }

    return { checkWinner, playRound, resetGame, getCurrentPlayer}
})()

const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell')
    const restart = document.querySelector('.rstBtn')
    const para = document.querySelector('.para')
    const message = document.querySelector('.message')
    cells.forEach((cell, index) =>{
        cell.addEventListener('click', ()=>{
            const result = GameController.playRound(index);
            updateDisplay()

            if(result) {
                message.textContent = result === "Tie" ? "It's a tie" : `${result.name} wins` 
                if(result !== "Tie") {
                    Gameboard.resetBoard()
                    updateDisplay()
                    alert(`${result.name} wins`)
                    message.textContent = `${result.name} wins`
                }
            }
            
        })
    })

   const updateDisplay = () => {
        const board = Gameboard.getBoard()
        const currentPlayer = GameController.getCurrentPlayer()
        cells.forEach((cell, index) => {
            cell.textContent = board[index]
            para.textContent = `${currentPlayer.name}'s Turn`
            message.textContent = ""
        })
   }

   
        restart.addEventListener('click', () => {
            GameController.resetGame()
            updateDisplay()
        })

    return { updateDisplay}
})()