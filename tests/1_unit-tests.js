const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
const puzzleStrings = require("../controllers/puzzle-strings.js")
  .puzzlesAndSolutions;
const invalidPuzzleStrings = require("../controllers/puzzle-strings.js")
  .invalidPuzzleStrings;
const testBoard = require("../controllers/puzzle-strings.js").testBoard;

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function () {
    assert.isTrue(solver.validate(puzzleStrings[0][0]), "first");
    assert.isTrue(solver.validate(puzzleStrings[1][0]), "second");
    assert.isTrue(solver.validate(puzzleStrings[2][0]), "third");
    assert.isTrue(solver.validate(puzzleStrings[3][0]), "fourth");
    assert.isTrue(solver.validate(puzzleStrings[4][0]), "fifth");
  });
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
    assert.throws(
      () => solver.validate(invalidPuzzleStrings[4]),
      "Invalid characters in puzzle"
    );
  });
  test("Logic handles a puzzle string that is not 81 characters in length", function () {
    assert.throws(
      () => solver.validate("..342"),
      "Expected puzzle to be 81 characters long"
    );
  });
  test("Logic handles a valid row placement", function () {
    assert.isTrue(
      solver.checkRowPlacement(testBoard, 8, 7, 2),
      "valid entry at end of row"
    );
    assert.isTrue(
      solver.checkRowPlacement(testBoard, 8, 0, 2),
      "valid entry at beginning of row"
    );
    assert.isTrue(
      solver.checkRowPlacement(testBoard, 8, 6, 6),
      "valid entry at where a number already exists"
    );
  });
  test("Logic handles an invalid row placement", function () {
    assert.isFalse(
      solver.checkRowPlacement(testBoard, 0, 8, 5),
      "invalid entry at end of row"
    );
    assert.isFalse(
      solver.checkRowPlacement(testBoard, 0, 0, 9),
      "invalid entry at beginning of row"
    );
    assert.isFalse(
      solver.checkRowPlacement(testBoard, 0, 2, 1),
      "invalid entry where a number already exists"
    );
  });
  test("Logic handles a valid column placement", function () {
    assert.isTrue(
      solver.checkColPlacement(testBoard, 8, 0, 2),
      "valid entry at end of column"
    );
    assert.isTrue(
      solver.checkColPlacement(testBoard, 0, 4, 2),
      "valid entry at beginning of column"
    );
    assert.isTrue(
      solver.checkColPlacement(testBoard, 0, 2, 1),
      "valid entry where a number already exists"
    );
  });
  test("Logic handles an invalid column placement", function () {
    assert.isFalse(
      solver.checkColPlacement(testBoard, 8, 0, 5),
      "invalid entry at end of column"
    );
    assert.isFalse(
      solver.checkColPlacement(testBoard, 0, 6, 1),
      "invalid entry at beginning of column"
    );
    assert.isFalse(
      solver.checkColPlacement(testBoard, 0, 2, 2),
      "invalid entry where a number already exists"
    );
  });
  test("Logic handles a valid region (3x3 grid) placement", function () {
    assert.isTrue(
      solver.checkRegionPlacement(testBoard, 0, 0, 7),
      "valid entry at beginning of row and column"
    );
    assert.isTrue(
      solver.checkRegionPlacement(testBoard, 8, 8, 5),
      "valid entry at end of row and column"
    );
    assert.isTrue(
      solver.checkRegionPlacement(testBoard, 8, 6, 6),
      "valid entry where a value already exists"
    );
  });
  test("Logic handles an invalid region (3x3 grid) placement", function () {
    assert.isFalse(
      solver.checkRegionPlacement(testBoard, 0, 0, 9),
      "invalid entry at beginning of row and column"
    );
    assert.isFalse(
      solver.checkRegionPlacement(testBoard, 8, 8, 6),
      "invalid entry at end of row and column"
    );
    assert.isFalse(
      solver.checkRegionPlacement(testBoard, 8, 6, 1),
      "invalid entry where a value already exists"
    );
  });
  test("Valid puzzle strings pass the solver", function () {
    assert.doesNotThrow(
      () => solver.solve(puzzleStrings[0][0]),
      "valid puzzle 1"
    );
    assert.doesNotThrow(
      () => solver.solve(puzzleStrings[1][0]),
      "valid puzzle 2"
    );
    assert.doesNotThrow(
      () => solver.solve(puzzleStrings[2][0]),
      "valid puzzle 3"
    );
    assert.doesNotThrow(
      () => solver.solve(puzzleStrings[3][0]),
      "valid puzzle 4"
    );
    assert.doesNotThrow(
      () => solver.solve(puzzleStrings[4][0]),
      "valid puzzle 5"
    );
  });
  test("Invalid puzzle strings fail the solver", function () {
    assert.throws(
      () => solver.solve(invalidPuzzleStrings[0]),
      "Puzzle cannot be solved",
      "throws when puzzle has only a given row conflict"
    );
    assert.throws(
      () => solver.solve(invalidPuzzleStrings[1]),
      "Puzzle cannot be solved",
      "throws when puzzle has only a given column conflict"
    );
    assert.throws(
      () => solver.solve(invalidPuzzleStrings[2]),
      "Puzzle cannot be solved",
      "throws when puzzle has only a given region conflict"
    );
    // assert.throws(() => solver.solve(invalidPuzzleStrings[3]), 'Puzzle cannot be solved', 'throws when puzzle is by nature unsolvable');
    assert.throws(
      () => solver.solve(invalidPuzzleStrings[4]),
      "Invalid characters in puzzle",
      "throws when puzzle has invalid characters"
    );
    assert.throws(
      () => solver.validate("..342"),
      "Expected puzzle to be 81 characters long",
      "throws when puzzle is incorrect length"
    );
  });
  test("Solver returns the the expected solution for an incomplete puzzle", function () {
    assert.strictEqual(
      solver.solve(puzzleStrings[0][0]),
      puzzleStrings[0][1],
      "valid puzzle 1"
    );
    assert.strictEqual(
      solver.solve(puzzleStrings[1][0]),
      puzzleStrings[1][1],
      "valid puzzle 2"
    );
    assert.strictEqual(
      solver.solve(puzzleStrings[2][0]),
      puzzleStrings[2][1],
      "valid puzzle 3"
    );
    assert.strictEqual(
      solver.solve(puzzleStrings[3][0]),
      puzzleStrings[3][1],
      "valid puzzle 4"
    );
    assert.strictEqual(
      solver.solve(puzzleStrings[4][0]),
      puzzleStrings[4][1],
      "valid puzzle 5"
    );
  });
});
