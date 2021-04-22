class SudokuSolver {

  validate(puzzleString) {
    const invalidRegex = /[^\d\.]/;
    if (puzzleString.length !== 81) {
      throw new Error('Expected puzzle to be 81 characters long');
    } else if (invalidRegex.test(puzzleString)) {
      throw new Error('Invalid characters in puzzle')
    } else {
      return true;
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // row and column are zero indexed
    const rowStart = row * 9;
    for (let i = rowStart; i <= rowStart + 8; i += 1) {
      if (i % 9 === column) {
        continue;
      } else if (puzzleString[i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // row and column are zero indexed
    for (let i = column; i <= 80; i += 9) {
      if (Math.floor(i / 9) === row) {
        continue;
      } else if (puzzleString[i] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowStart = Math.floor(row / 3) * 27;
    const colStart = Math.floor(column / 3) * 3;
    const targetIndex = row * 9 + column;

    for (let i = rowStart; i <= rowStart + 18; i += 9) {
      for (let j = colStart; j <= colStart + 2; j += 1) {
        const currentIndex = i + j;
        if (targetIndex === currentIndex) {
          continue;
        } else if (puzzleString[currentIndex] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    this.validate(puzzleString);

    const puzzleArr = puzzleString.split("");
    const isValid = (row, column, value) => {
      return this.checkRegionPlacement(puzzleArr, row, column, value) && this.checkColPlacement(puzzleArr, row, column, value) && this.checkRowPlacement(puzzleArr, row, column, value);
    }

    let i = 0;
    let currentValid = false;
    while (i < 81 || !currentValid) {
      const row = Math.floor(i / 9);
      const column = i % 9;
      const currentChar = puzzleArr[i];
      currentValid = isValid(row, column, currentChar);

      if (currentValid) {
        // search for next blank spot
        // set to next blank spot if found, otherwise finish the loop
        let foundNext = false;
        for (let j = i + 1; j <= 80; j += 1) {
          if (puzzleString[j] === "." || j === 80) {
            foundNext = true;
            puzzleArr[j] = "1";
            i = j;
            break;
          }
        }
        if (!foundNext) {
          break;
        }
      } else if (currentChar === "9") {
        // move iteration to last dot value and increment it by one
        let foundPrevious = false;
        const laterNines = [];
        for (let j = i; j >= 0; j -= 1) {
          if (puzzleString[j] === "." && puzzleArr[j] !== "9") {
            foundPrevious = true;
            puzzleArr[j] = (Number.parseInt(puzzleArr[j], 10) + 1).toString();
            puzzleArr[i] = "."
            i = j;
            laterNines.forEach((el) => {
              puzzleArr[el] = ".";
            });
            break;
          } else if (puzzleArr[j] === "9" && puzzleString[j] === ".") {
            laterNines.push(j);
          }
        }
        if (!foundPrevious) {
          throw new Error('Puzzle cannot be solved');
        }
      } else {
        puzzleArr[i] = currentChar === "." ? "1" : (Number.parseInt(currentChar, 10) + 1).toString();
      }
    }
    return puzzleArr.join("");
  }

}

module.exports = SudokuSolver;
