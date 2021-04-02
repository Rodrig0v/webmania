'use strict';

function OJMParser() {
  var data = {
    samples: [],
  }

  var acc_keybyte = 0xFF
  var acc_counter = 0

  /** the xor mask used in the M30 format */
  var NAMI = Int8Array.from([0x6E, 0x61, 0x6D, 0x69])

  /** the xor mask used in the M30 format */
  var F412 = Int8Array.from([0x30, 0x34, 0x31, 0x32])


  /** the M30 signature, "M30\0" in little endian */
  var M30_SIGNATURE = 0x0030334D

  /** the OMC signature, "OMC\0" in little endian */
  var OMC_SIGNATURE = 0x00434D4F

  /** the OJM signature, "OJM\0" in little endian */
  var OJM_SIGNATURE = 0x004D4A4F

  /* this is a dump from debugging notetool */
  var REARRANGE_TABLE = [
    0x10, 0x0E, 0x02, 0x09, 0x04, 0x00, 0x07, 0x01,
    0x06, 0x08, 0x0F, 0x0A, 0x05, 0x0C, 0x03, 0x0D,
    0x0B, 0x07, 0x02, 0x0A, 0x0B, 0x03, 0x05, 0x0D,
    0x08, 0x04, 0x00, 0x0C, 0x06, 0x0F, 0x0E, 0x10,
    0x01, 0x09, 0x0C, 0x0D, 0x03, 0x00, 0x06, 0x09,
    0x0A, 0x01, 0x07, 0x08, 0x10, 0x02, 0x0B, 0x0E,
    0x04, 0x0F, 0x05, 0x08, 0x03, 0x04, 0x0D, 0x06,
    0x05, 0x0B, 0x10, 0x02, 0x0C, 0x07, 0x09, 0x0A,
    0x0F, 0x0E, 0x00, 0x01, 0x0F, 0x02, 0x0C, 0x0D,
    0x00, 0x04, 0x01, 0x05, 0x07, 0x03, 0x09, 0x10,
    0x06, 0x0B, 0x0A, 0x08, 0x0E, 0x00, 0x04, 0x0B,
    0x10, 0x0F, 0x0D, 0x0C, 0x06, 0x05, 0x07, 0x01,
    0x02, 0x03, 0x08, 0x09, 0x0A, 0x0E, 0x03, 0x10,
    0x08, 0x07, 0x06, 0x09, 0x0E, 0x0D, 0x00, 0x0A,
    0x0B, 0x04, 0x05, 0x0C, 0x02, 0x01, 0x0F, 0x04,
    0x0E, 0x10, 0x0F, 0x05, 0x08, 0x07, 0x0B, 0x00,
    0x01, 0x06, 0x02, 0x0C, 0x09, 0x03, 0x0A, 0x0D,
    0x06, 0x0D, 0x0E, 0x07, 0x10, 0x0A, 0x0B, 0x00,
    0x01, 0x0C, 0x0F, 0x02, 0x03, 0x08, 0x09, 0x04,
    0x05, 0x0A, 0x0C, 0x00, 0x08, 0x09, 0x0D, 0x03,
    0x04, 0x05, 0x10, 0x0E, 0x0F, 0x01, 0x02, 0x0B,
    0x06, 0x07, 0x05, 0x06, 0x0C, 0x04, 0x0D, 0x0F,
    0x07, 0x0E, 0x08, 0x01, 0x09, 0x02, 0x10, 0x0A,
    0x0B, 0x00, 0x03, 0x0B, 0x0F, 0x04, 0x0E, 0x03,
    0x01, 0x00, 0x02, 0x0D, 0x0C, 0x06, 0x07, 0x05,
    0x10, 0x09, 0x08, 0x0A, 0x03, 0x02, 0x01, 0x00,
    0x04, 0x0C, 0x0D, 0x0B, 0x10, 0x05, 0x06, 0x0F,
    0x0E, 0x07, 0x09, 0x0A, 0x08, 0x09, 0x0A, 0x00,
    0x07, 0x08, 0x06, 0x10, 0x03, 0x04, 0x01, 0x02,
    0x05, 0x0B, 0x0E, 0x0F, 0x0D, 0x0C, 0x0A, 0x06,
    0x09, 0x0C, 0x0B, 0x10, 0x07, 0x08, 0x00, 0x0F,
    0x03, 0x01, 0x02, 0x05, 0x0D, 0x0E, 0x04, 0x0D,
    0x00, 0x01, 0x0E, 0x02, 0x03, 0x08, 0x0B, 0x07,
    0x0C, 0x09, 0x05, 0x0A, 0x0F, 0x04, 0x06, 0x10,
    0x01, 0x0E, 0x02, 0x03, 0x0D, 0x0B, 0x07, 0x00,
    0x08, 0x0C, 0x09, 0x06, 0x0F, 0x10, 0x05, 0x0A,
    0x04, 0x00];

  var parseM30 = function (buffer, dataview) {
    let dec = new TextDecoder('utf-8')
    let cursor = 4

    data.fileFormatVersion = dataview.getInt32(cursor, true)
    cursor += 4
    data.encryptionFlag = dataview.getInt32(cursor, true)
    cursor += 4
    data.sampleCount = dataview.getInt32(cursor, true)
    cursor += 4
    data.sampleOffset = dataview.getInt32(cursor, true)
    cursor += 4
    data.payloadSize = dataview.getInt32(cursor, true)
    cursor += 4
    data.padding = dataview.getInt32(cursor, true)
    cursor += 4

    cursor = data.sampleOffset

    for(let i = 0; i < data.sampleCount; i++) {
      if(data.payloadSize - cursor < 52)
        break;

      let sample = {
        extension: 'ogg',
      }

      sample.name = dec.decode(buffer.slice(cursor, cursor + 32))
      cursor += 32
      sample.size = dataview.getInt32(cursor, true)
      cursor += 4
      sample.codecCode = dataview.getInt16(cursor, true)
      cursor += 2
      sample.codecCode2 = dataview.getInt16(cursor, true)
      cursor += 2
      sample.musicFlag = dataview.getInt32(cursor, true)
      cursor += 4
      sample.ref = dataview.getInt16(cursor, true)
      cursor += 2
      sample.unknown = dataview.getInt16(cursor, true)
      cursor += 2
      sample.pcmSamples = dataview.getInt32(cursor, true)
      cursor += 4
      sample.data = new Int8Array(buffer.slice(cursor, cursor + sample.size))
      cursor += sample.size

      switch(data.encryptionFlag) {
        case 16: NamiXOR(sample.data)
          break
        case 32: F412XOR(sample.data)
          break
        default:
          break
      }

      sample.id = sample.ref;
      if (sample.codecCode == 0)
        sample.id += 1000;
      else if (sample.codecCode != 5) continue; // Unknown sample id type.

      data.samples.push(sample)
    }
  }

  var NamiXOR = function (array) {
    for (let i = 0; i + 3 < array.length; i += 4) {
      array[i + 0] ^= NAMI[0]
      array[i + 1] ^= NAMI[1]
      array[i + 2] ^= NAMI[2]
      array[i + 3] ^= NAMI[3]
    }
  }

  var F412XOR = function (array) {
    for (let i = 0; i + 3 < array.length; i += 4) {
      array[i + 0] ^= F412[0]
      array[i + 1] ^= F412[1]
      array[i + 2] ^= F412[2]
      array[i + 3] ^= F412[3]
    }
  }

  var parseOCM = function (buffer, dataview, decrypt) {
    let enc = new TextEncoder()
    let cursor = 4
    
    data.unknown = dataview.getInt32(cursor, true)
    cursor += 4
    data.wavStart = dataview.getInt32(cursor, true)
    cursor += 4
    data.oggStart = dataview.getInt32(cursor, true)
    cursor += 4
    data.fileSize = dataview.getInt32(cursor, true)
    cursor += 4

    let sampleId = 0
    cursor = data.wavStart

    while(cursor < data.oggStart) { // WAV data
      if(data.fileSize - cursor < 56)
        break;

      let sample = {
        extension: 'wav',
      }

      sample.name = buffer.slice(cursor, cursor + 32)
      cursor += 32
      sample.audioFormat = dataview.getInt16(cursor, true)
      cursor += 2
      sample.numChannels = dataview.getInt16(cursor, true)
      cursor += 2
      sample.sampleRate = dataview.getInt32(cursor, true)
      cursor += 4
      sample.bitRate = dataview.getInt32(cursor, true)
      cursor += 4
      sample.blockAlign = dataview.getInt16(cursor, true)
      cursor += 2
      sample.bitsPerSample = dataview.getInt16(cursor, true)
      cursor += 2
      sample.unknownData = dataview.getInt32(cursor, true)
      cursor += 4
      sample.size = dataview.getInt32(cursor, true)
      cursor += 4
      sample.data = new Int8Array(buffer.slice(cursor, cursor + sample.size))
      cursor += sample.size

      if(decrypt) {
        sample.data = rearrange(sample.data);
        sample.data = acc_xor(sample.data);
      }

      let newData = new Int8Array(44 + sample.size);
      let shortBuffer = new ArrayBuffer(2)
      let shortDataView = new DataView(shortBuffer)
      let intBuffer = new ArrayBuffer(4)
      let intDataView = new DataView(intBuffer)

      newData.set(enc.encode('RIFF'), 0)

      intDataView.setInt32(0, sample.size + 36, true)
      newData.set(new Int8Array(intBuffer), 4);

      newData.set(enc.encode('WAVE'), 8)

      newData.set(enc.encode('fmt '), 12)

      intDataView.setInt32(0, 0x10, true)
      newData.set(new Int8Array(intBuffer), 16); // PCM format

      shortDataView.setInt16(0, sample.audioFormat, true)
      newData.set(new Int8Array(shortBuffer), 20)

      shortDataView.setInt16(0, sample.numChannels, true)
      newData.set(new Int8Array(shortBuffer), 22)

      intDataView.setInt32(0, sample.sampleRate, true)
      newData.set(new Int8Array(intBuffer), 24)

      intDataView.setInt32(0, sample.bitRate, true)
      newData.set(new Int8Array(intBuffer), 28)

      shortDataView.setInt16(0, sample.blockAlign, true)
      newData.set(new Int8Array(shortBuffer), 32)

      shortDataView.setInt16(0, sample.bitsPerSample, true)
      newData.set(new Int8Array(shortBuffer), 34)

      newData.set(enc.encode('data'), 36)

      intDataView.setInt32(0, sample.size, true)
      newData.set(new Int8Array(intBuffer), 40)

      newData.set(sample.data, 44)

      sample.data = newData

      sample.id = sampleId
      data.samples.push(sample)
      sampleId++
    }

    sampleId = 1000
    cursor = data.oggStart

    while(cursor < data.fileSize) { // OGG data
      if(data.fileSize - cursor < 36)
        break;

      let sample = {
        extension: 'ogg',
      }

      sample.name = buffer.slice(cursor, cursor + 32)
      cursor += 32
      sample.size = dataview.getInt32(cursor, true)
      cursor += 4

      sample.data = buffer.slice(cursor, cursor + sample.size)
      cursor += sample.size

      sample.id = sampleId
      data.samples.push(sample)
      sampleId++
    }
  }

   var rearrange = function (array)
   {
       let length = array.length;
       let key = ((length % 17) << 4) + (length % 17);

       let blockSize = Math.floor(length / 17);

       let newArray = Int8Array.from(array);

       for(let block = 0; block < 17; block++) {
        let blockStartEncoded = blockSize * block;
        let blockStartPlain = blockSize * REARRANGE_TABLE[key];
        for(let i = 0; i < blockSize; i++) {
          newArray[blockStartPlain + i] = array[blockStartEncoded + i]
        }
        key++
       }
       return newArray;
   }

   var acc_xor = function(array)
   {
       let temp = 0;
       let thisByte = 0;
       for(let i = 0; i < array.length; i++)
       {
           temp = thisByte = array[i];

           if(((acc_keybyte << acc_counter) & 0x80) != 0){
            thisByte = ~thisByte;
           }

           array[i] = thisByte;
           acc_counter++;
           if(acc_counter > 7){
               acc_counter = 0;
               acc_keybyte = temp;
           }
       }
       return array;
   }

  var parseOJM = function (buffer) {
    let dataview = new DataView(buffer)
    let signature = dataview.getInt32(0, true)
    switch(signature) {
      case M30_SIGNATURE:
        parseM30(buffer, dataview)
        break;
      case OMC_SIGNATURE:
        parseOCM(buffer, dataview, true)
        break;
      case OJM_SIGNATURE:
        parseOCM(buffer, dataview, false)
        break;
    }

    let hitSounds = {}

    for(let sample of data.samples) {
      hitSounds[sample.id] = 'data:audio/' + sample.extension + ';base64,' + Buffer.from(sample.data).toString('base64')
    }

    return hitSounds
  }

  return {
    parseOJM: parseOJM
  };
}

export default {
  /**
   * Parse the content of a .ojm file
   * @param  {Buffer} buffer
   * @return {Object} beatmap
   */
  parseContent (buffer) {
    return OJMParser().parseOJM(buffer);
  }
}