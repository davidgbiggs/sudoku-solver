'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  const letterRowMap = new Map([['a', 0], ['b', 1], ['c', 2], ['d', 3], ['e', 4], ['f', 5], ['g', 6], ['h', 7], ['i', 8]]);

  app.route('/api/check')
    .post((req, res) => {
      const coordinate = req.body.coordinate;
      const puzzleString = req.body.puzzle;
      const value = req.body.value;

      if (!coordinate || !puzzleString || !value) {
        res.json({error: 'Required field(s) missing'});
      }

      try {
        solver.validate(puzzleString);
      } catch (error) {
        res.json({error: error.message});
      }

      const goodCoordinate = /^[A-I][1-9]$/gi;
      const goodValue = /[1-9]/gi;

      if (!goodCoordinate.test(coordinate)) {
        res.json({error: 'Invalid coordinate'});
      } else if (!goodValue.test(value)) {
        res.json({error: 'Invalid value'});
      } else {
        const row = letterRowMap.get(coordinate[0].toLowerCase());
        const col = Number.parseInt(coordinate[1], 10) - 1;
        const resultArray = [];

        if (!solver.checkRowPlacement(puzzleString, row, col, value)) {
          resultArray.push('row');
        }
        if (!solver.checkColPlacement(puzzleString, row, col, value)) {
          resultArray.push('column');
        }
        if (!solver.checkRegionPlacement(puzzleString, row, col, value)) {
          resultArray.push('region');
        }

        if (resultArray.length > 0) {
          res.json({valid: false, conflict: resultArray});
        } else {
          res.json({valid: true});
        }

      }


    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      if (!puzzle) {
        res.json({error: 'Required field missing'});
      }

      try {
        const solution = solver.solve(puzzle);
        res.json({solution});
      } catch (error) {
        res.json({'error': error.message});
      }
    });
};
