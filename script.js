document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");

    // Function to generate a blank Sudoku grid
    function generateBlankSudoku() {
        const puzzle = Array.from({ length: 9 }, () => Array(9).fill(0));
        return puzzle;
    }

    // Function to solve the Sudoku puzzle
    function solveSudoku(board) {
        const errorMessages = [];
        if (!isValidSudoku(board, errorMessages)) {
            alert("Sudoku is not valid:\n" + errorMessages.join("\n"));
            return null;
        }
        const solvedPuzzle = JSON.parse(JSON.stringify(board));
        solveHelper(solvedPuzzle);
        return solvedPuzzle;
    }

    // Helper function for solving Sudoku recursively
    function solveHelper(board) {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) {
            return true; // Puzzle solved
        }

        const [row, col] = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
                board[row][col] = num;
                if (solveHelper(board)) {
                    return true;
                }
                board[row][col] = 0; // Backtrack
            }
        }
        return false; // No valid number found for this cell
    }

    // Function to find an empty cell in the Sudoku puzzle
    function findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null; // No empty cell found
    }

    // Function to check if a move is valid
    function isValidMove(board, row, col, num) {
        return !isInRow(board, row, num) && 
               !isInColumn(board, col, num) &&
               !isInBox(board, row, col, num);
    }

    // Function to check if a number is in the same row
    function isInRow(board, row, num) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === num) {
                return true;
            }
        }
        return false;
    }

    // Function to check if a number is in the same column
    function isInColumn(board, col, num) {
        for (let row = 0; row < 9; row++) {
            if (board[row][col] === num) {
                return true;
            }
        }
        return false;
    }

    // Function to check if a number is in the same 3x3 box
    function isInBox(board, row, col, num) {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    // Function to check if the Sudoku is valid
    function isValidSudoku(board, errorMessages) {
        let valid = true;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = board[row][col];
                if (num !== 0) {
                    board[row][col] = 0;
                    if (isInRow(board, row, num)) {
                        errorMessages.push(`Number ${num} at (${row + 1}, ${col + 1}) is already present in the same row.`);
                        valid = false;
                    } else if (isInColumn(board, col, num)) {
                        errorMessages.push(`Number ${num} at (${row + 1}, ${col + 1}) is already present in the same column.`);
                        valid = false;
                    } else if (isInBox(board, row, col, num)) {
                        errorMessages.push(`Number ${num} at (${row + 1}, ${col + 1}) is already present in the same 3x3 box.`);
                        valid = false;
                    }
                    board[row][col] = num;
                }
            }
        }
        return valid;
    }

    // Function to create the Sudoku puzzle grid
    function createSudokuGrid(puzzle, solvedPuzzle = null) {
        container.innerHTML = '';
        puzzle.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            row.forEach((cell, columnIndex) => {
                const cellElement = document.createElement('input');
                cellElement.classList.add('cell');
                cellElement.classList.add((rowIndex + columnIndex) % 2 === 0 ? 'lightBackground' : 'darkBackground');
                cellElement.type = 'text';
                cellElement.maxLength = 1;

                // Apply thicker borders after the 3rd and 6th columns
                if (columnIndex === 2 || columnIndex === 5) {
                    cellElement.style.borderRight = '3px solid black';
                }
                // Apply thicker borders after the 3rd and 6th rows
                if (rowIndex === 2 || rowIndex === 5) {
                    cellElement.style.borderBottom = '3px solid black';
                }

                if (puzzle[rowIndex][columnIndex] !== 0) {
                    cellElement.classList.add('user-input');
                    cellElement.value = puzzle[rowIndex][columnIndex];
                } else if (solvedPuzzle) {
                    cellElement.classList.add('solved-input');
                    cellElement.value = solvedPuzzle[rowIndex][columnIndex];
                } else {
                    cellElement.value = '';
                }

                cellElement.addEventListener('input', () => {
                    const value = parseInt(cellElement.value, 10);

                    // Check if the input is a valid number between 1 and 9
                    if (isNaN(value) || value < 1 || value > 9) {
                        alert("Please enter a number between 1 and 9.");
                        cellElement.value = ''; // Clear the invalid input
                        puzzle[rowIndex][columnIndex] = 0; // Reset the cell in the puzzle array
                    } else {
                        puzzle[rowIndex][columnIndex] = value;
                        cellElement.classList.add('user-input'); // Retain blue color for user input
                    }
                });

                rowElement.appendChild(cellElement);
            });
            container.appendChild(rowElement);
        });
    }

    // Initialize puzzle
    let puzzle = generateBlankSudoku();

    // Function to solve the puzzle
    function solvePuzzle() {
        const solvedPuzzle = solveSudoku(puzzle);
        if (solvedPuzzle) {
            createSudokuGrid(puzzle, solvedPuzzle);
        }
    }

    // Function to reset the puzzle
    function resetPuzzle() {
        puzzle = generateBlankSudoku();
        createSudokuGrid(puzzle);
    }

    // Initial puzzle creation
    createSudokuGrid(puzzle);

    // Attach event listeners to buttons
    document.getElementById("solveButton").addEventListener("click", solvePuzzle);
    document.getElementById("resetButton").addEventListener("click", resetPuzzle);
});



