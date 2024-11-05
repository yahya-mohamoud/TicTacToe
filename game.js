let Gameboard = (() =>{
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        
        if(board[index] === "") {

            board[index] = marker;

            return true;
        }
        return false;
    };

        const resetBoard = () => { 

             board =  ["", "", "", "", "", "", "", "", ""];
    }

    return { getBoard, updateBoard, resetBoard }
})();

const Player = (name, marker) =>{
    return { name, marker}
}

const GameController = (() => {
    const player1 = Player("Player 2", "X");
    const player2 = Player("Player 1", "O");
    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return currentPlayer;
            }
        }

        if (board.every(cell => cell !== "")) {
            return "Tie";
        }

        return null;
    };

    const playRound = (index) => {

        if (Gameboard.updateBoard(index, currentPlayer.marker)) {
            const winner = checkWinner();
            if (winner) {
                return winner;
            }
            switchPlayer();
        }
        return null;
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
    };
     
    
    return { getCurrentPlayer, playRound, resetGame };
})();

const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const message = document.querySelector("#message");
    const restartButton = document.querySelector("#restart");
    const para = document.querySelector('.para')

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            const result = GameController.playRound(index);
            updateDisplay();
            if (result) {
                // message.textContent = ''
                message.textContent = result === "Tie" ? "It's a tie!" : `${result.name} wins!`;
                GameController.resetGame();
                updateDisplay()
            }

        });
    });

    restartButton.addEventListener("click", () => {
        GameController.resetGame();
        updateDisplay();
        para.textContent = "Player 2's turn";
    });

    const updateDisplay = () => {
        const message = document.querySelector('#message')
        const currentPlayer = GameController.getCurrentPlayer().name;
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            para.textContent = `${currentPlayer}'s turn`
        });

    };

    return { updateDisplay };
})();

