const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;
const invalidPuzzleStrings = require('../controllers/puzzle-strings.js').invalidPuzzleStrings;
const testBoard = require('../controllers/puzzle-strings.js').testBoard;

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/solve with puzzle => solve/validate puzzle', function() {

    test('Solve a puzzle with a valid puzzle string', function(done) {
      chai.request(server)
          .post('/api/solve')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0]})
          .end(function(error, res) {
            assert.deepEqual({solution: res.body.solution}, {solution: puzzlesAndSolutions[0][1]});
            done();
          });
    });
    test('Solve a puzzle with missing puzzle string', function(done) {
      chai.request(server)
          .post('/api/solve')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Required field missing'});
            done();
          });
    });
    test('Solve a puzzle with invalid characters', function(done) {
      chai.request(server)
          .post('/api/solve')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: invalidPuzzleStrings[4]})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'});
            done();
          });
    });
    test('Solve a puzzle with incorrect length', function(done) {
      chai.request(server)
          .post('/api/solve')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: '...3421'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'});
            done();
          });
    });
    test('Solve a puzzle that cannot be solved', function(done) {
      chai.request(server)
          .post('/api/solve')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: invalidPuzzleStrings[0]})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Puzzle cannot be solved'});
            done();
          });
    });

  });

  suite('POST /api/check with puzzle => check sudoku placement', function() {
    test('Check a puzzle placement with all fields', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '3'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {valid: true});
            done();
          });
    });
    test('Check a puzzle placement with single placement conflict', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '4'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {valid: false, conflict: ['row']});
            done();
          });
    });
    test('Check a puzzle placement with multiple placement conflicts', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '1'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {valid: false, conflict: ['row', 'region']});
            done();
          });
    });
    test('Check a puzzle placement with all placement conflicts', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '2'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {valid: false, conflict: ['row', 'column', 'region']});
            done();
          });
    });
    test('Check a puzzle placement with missing required fields', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Required field(s) missing'}, 'Missing value field');
          });
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], value: '2'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Required field(s) missing'}, 'Missing coordinate field');
          });
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({coordinate: 'A2', value: '2'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Required field(s) missing'}, 'Missing puzzle field');
            done();
          });
    });
    test('Check a puzzle placement with invalid characters', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: invalidPuzzleStrings[4], coordinate: 'A2', value: '2'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'});
            done();
          });
    });
    test('Check a puzzle placement with incorrect length', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: '234...2343', coordinate: 'A2', value: '2'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'});
            done();
          });
    });
    test('Check a puzzle placement with invalid placement coordinate', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'J2', value: '2'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Invalid coordinate'});
            done();
          });
    });
    test('Check a puzzle placement with invalid placement value', function(done) {
      chai.request(server)
          .post('/api/check')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '0'})
          .end(function(error, res) {
            assert.deepEqual(res.body, {error: 'Invalid value'});
            done();
          });
    });
    });
});