let hamming = require('../index.js').hamming;
let assert = require('chai').assert;

describe('Hamming code testing', function() {
  it('should correctly encode 4 bits to 7-bit hamming code', function() {
    let input = [1, 0, 1, 1];
    let encoded = hamming.encode(input);
    assert.deepEqual(encoded, [0, 1, 1, 0, 0, 1, 1]);
  });

  it('should correctly decode a valid 7-bit hamming code', function() {
    let encoded = [0, 1, 1, 0, 0, 1, 1];
    let decoded = hamming.decode(encoded);
    assert.deepEqual(decoded, [1, 0, 1, 1]);
  });

  it('should detect no error in a valid code (isValid = true)', function() {
    let encoded = [0, 1, 1, 0, 0, 1, 1];
    let valid = hamming.isValid(encoded);
    assert.isTrue(valid);
  });

  it('should fix a 1-bit error and still decode correctly', function() {
    let input = [1, 0, 1, 1];
    let encoded = hamming.encode(input);
    let corrupted = hamming.injectError(encoded, 3); // introduce error at position 3
    let decoded = hamming.decode(corrupted);
    assert.deepEqual(decoded, input);
  });
});


describe('unit tests', function() {
  
  it('should encode and decode correctly without error', function() {
    const input = [1, 0, 1, 1];
    const encoded = hamming.encode(input);
    const decoded = hamming.decode(encoded);
    assert.deepEqual(decoded, input, 'Decoded data should match original input');
  });

  it('should detect and correct a single-bit error', function() {
    const input = [0, 1, 0, 1];
    const encoded = hamming.encode(input);
    const corrupted = hamming.injectError(encoded, 4); // flip bit at position 4
    const decoded = hamming.decode(corrupted);
    assert.deepEqual(decoded, input, 'Decoded data should match original input after correction');
  });

  it('should validate correct code as valid', function() {
    const input = [1, 1, 0, 0];
    const encoded = hamming.encode(input);
    const isValid = hamming.isValid(encoded);
    assert.isTrue(isValid, 'Encoded data should be valid');
  });

  it('should generate random valid encoded data', function() {
    const { original, encoded } = hamming.generateRandomEncoded();
    const decoded = hamming.decode(encoded);
    assert.deepEqual(decoded, original, 'Randomly generated encoded data should decode correctly');
  });

});
