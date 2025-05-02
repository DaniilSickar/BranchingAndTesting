let hamming = require('../index.js').hamming;
let assert = require('chai').assert;


describe('hamming', function() {
  
    it('should throw error if decode input has non-binary values', function() {
        assert.throws(() => hamming.decode([1, 0, 3, 0, 1, 0, 1]), Error);
      });
      it('should throw error if isValid input has non-binary values', function() {
        assert.throws(() => hamming.isValid([1, 0, "x", 0, 1, 0, null]), Error);
      });      

      it('should throw an error when encoding input contains undefined', function() {
        assert.throws(() => hamming.encode([1, undefined, 0, 1]), Error, "hamming: encode input must consist of bits");
      });

  it('should encode many times quickly', function(done) {
    let input = [1, 0, 1, 0];
    let startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
      hamming.encode(input);
    }
    let endTime = Date.now();
    let duration = endTime - startTime;
    assert.isBelow(duration, 1000, 'Encoding 10000 times should take less than 1000ms');
    done();
  });

  it('should decode many times quickly', function(done) {
    let input = [1, 1, 1, 0, 0, 1, 0];
    let startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
      hamming.decode(input);
    }
    let endTime = Date.now();
    let duration = endTime - startTime;
    assert.isBelow(duration, 1000, 'Decoding 10000 times should take less than 1000ms');
    done();
  });

  it('should throw an error when encoding input is not 4 bits', function() {
    assert.throws(() => hamming.encode([1, 0, 1]), Error, "hamming: encode input must have exactly 4 bits");
  });

  it('should throw an error when decoding input is not 7 bits', function() {
    assert.throws(() => hamming.decode([1, 0, 1, 0, 1]), Error, "hamming: decode input must have exactly 7 bits");
  });

  it('should throw an error when encoding input contains NaN', function() {
    assert.throws(() => hamming.encode([1, NaN, 0, 1]), Error, "hamming: encode input must consist of bits");
  });

  it('should correctly identify valid Hamming codes', function() {
    let validCode = [1,1,1,0,0,0,0];
    let invalidCode = [0, 1, 1, 0, 0, 1, 0];
    assert.isTrue(hamming.isValid(validCode));
    assert.isFalse(hamming.isValid(invalidCode));
  });

});

describe('Hamming Code Quality Tests', function() {

  it('should correctly decode all 16 possible 4-bit inputs after injecting random 1-bit error', function() {
    for (let i = 0; i < 16; i++) {
      const input = [
        (i >> 3) & 1,
        (i >> 2) & 1,
        (i >> 1) & 1,
        i & 1
      ];
      const encoded = hamming.encode(input);
      const errorPos = Math.floor(Math.random() * 7) + 1;
      const corrupted = hamming.injectError(encoded, errorPos);
      const decoded = hamming.decode(corrupted);
      assert.deepEqual(decoded, input, `Failed on input ${input.join('')} with error at position ${errorPos}`);
    }
  });
  it('should throw error on boolean values in encode input', function() {
    const input = [1, 0, true, 1]; // true не є бітовим числом
    assert.throws(() => hamming.encode(input), Error, "hamming: encode input must consist of bits");
  });
  it('should preserve data through encode → toBitString → fromBitString → decode cycle', function() {
    const input = [1, 0, 0, 1];
    const encoded = hamming.encode(input);
    const bitString = hamming.toBitString(encoded);
    const restoredBits = hamming.fromBitString(bitString);
    const decoded = hamming.decode(restoredBits);
    assert.deepEqual(decoded, input, 'Data corrupted in bit string conversion cycle');
  });
  });