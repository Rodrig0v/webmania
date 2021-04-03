'use strict';

function beatmapParser(extension) {

  var beatmap = {
    nbNotes: 0,
    nbLns: 0,
    hitSounds: {},
    timingPointsLines: [],
    timingPoints: [],
    timeSounds: [],
    notes: [],
  };

  var backgroundMap = {}
  var extendedBPMMap = {}
  var hitSoundsMap = {}
  var stopsMap = {}

  var keyValReg      = /^#([a-zA-Z0-9]+)[ ]*(.+)$/i;
  var backgroundReg  = /^#BMP([a-zA-Z0-9]+)[ ]*(.+)$/i
  var timingReg      = /^#BPM([a-zA-Z0-9]+)[ ]*(.+)$/i
  var stopReg        = /^#STOP([a-zA-Z0-9]+)[ ]*(.+)$/i
  var hitSoundReg    = /^#(?:WAV|OGG)([a-zA-Z0-9]+)[ ]*(.+)$/i
  var noteReg        = /^#([0-9][0-9][0-9])([a-zA-Z0-9][a-zA-Z0-9]):([a-zA-Z0-9]+)/i

  /**
   * Parse a timing line
   * @param  {String} line
   */
  var parseTimeSound = function (measure, data) {
    let beatDivison = data.length / 2
    for(let i = 0; i < beatDivison; i++) {
      let hex = data.substring(2*i, 2*i+2)
      if(hex == '00') continue
      beatmap.timeSounds.push({ beat: (measure + i / beatDivison) * 4, name: hitSoundsMap[hex] })
      beatmap.hitSounds[hitSoundsMap[hex]] = true
    }
  };

  /**
   * Parse a timing line
   * @param  {String} line
   */
  var parseTimingPoint = function (measure, data) {
    let beatDivison = data.length / 2
    for(let i = 0; i < beatDivison; i++) {
      let hex = data.substring(2*i, 2*i+2)
      if(hex == '00') continue
      beatmap.timingPointsLines.push({ beat: (measure + i / beatDivison) * 4, bpm: parseInt(hex, 16) })
    }
  };

  /**
   * Parse a timing line
   * @param  {String} line
   */
  var parseExtendedTimingPoint = function (measure, data) {
    let beatDivison = data.length / 2
    for(let i = 0; i < beatDivison; i++) {
      let hex = data.substring(2*i, 2*i+2)
      if(hex == '00') continue
      beatmap.timingPointsLines.push({ beat: (measure + i / beatDivison) * 4, bpm: extendedBPMMap[hex] })
    }
  };

  /**
   * Parse a timing line
   * @param  {String} line
   */
  var parseStops = function (measure, data) {
    let beatDivison = data.length / 2
    for(let i = 0; i < beatDivison; i++) {
      let hex = data.substring(2*i, 2*i+2)
      if(hex == '00') continue
      beatmap.timingPointsLines.push({ beat: (measure + i / beatDivison) * 4, time: stopsMap[hex] / 192 })
    }
  };

  /**
   * Parse a note line
   * @param  {String} line
   */
  var parseNote = function (measure, key, data) {
    let beatDivison = data.length / 2
    for(let i = 0; i < beatDivison; i++) {
      let hex = data.substring(2*i, 2*i+2)
      if(hex == '00') continue
      beatmap.notes.push({ beat: (measure + i / beatDivison) * 4, key: key, timing: getTiming(i, beatDivison), hitSound: hitSoundsMap[hex], soundTypes: [], objectName: 'note' })
      beatmap.hitSounds[hitSoundsMap[hex]] = true
    }
  };

  /**
   * Parse an event line
   * @param  {String} line
   */
   var getTiming = function(beat, size) {
    var divs = 3 * 128;
    var val = beat * divs / size;
    if (val % (divs / 4) === 0) {
        return 1;
    } else if (val % (divs / 8) === 0) {
        return 2;
    } else if (val % (divs / 12) === 0) {
        return 3;
    } else if (val % (divs / 16) === 0) {
        return 4;
    } else if (val % (divs / 24) === 0) {
        return 6;
    } else if (val % (divs / 32) === 0) {
        return 8;
    } else if (val % (divs / 48) === 0) {
        return 12;
    } else if (val % (divs / 64) === 0) {
        return 16;
    }
    return 16;
  }

  var parseData = function (measure, channel, data) {
    switch (channel) {
      case 1:
        parseTimeSound(measure, data)
        break;
      /*case 2:
        parseTimeSignature(measure, data)
        break;*/
      case 3:
        parseTimingPoint(measure, data)
        break;
      /*case 4:
        parseBGABase(measure, data)
        break;
      case 6:
        parseBGAPoor(measure, data)
        break;
      case 7:
        parseBGALayer(measure, data)
        break;*/
      case 8:
        parseExtendedTimingPoint(measure, data)
        break;
      case 9:
        parseStops(measure, data)
        break;
      /*case 9:
        parseBGALayer2(measure, data)
        break;*/
      case 11:
        parseNote(measure, 1, data)
        break;
      case 12:
        parseNote(measure, 2, data)
        break;
      case 13:
        parseNote(measure, 3, data)
        break;
      case 14:
        parseNote(measure, 4, data)
        break;
      case 15:
        parseNote(measure, 5, data)
        break;
      case 16:
        parseNote(measure, 0, data)
        break;
      case 18:
        parseNote(measure, 6, data)
        break;
      case 19:
        parseNote(measure, 7, data)
        break;
      case 22:
        parseNote(measure, 6, data)
        break;
      case 23:
        parseNote(measure, 7, data)
        break;
      case 24:
        parseNote(measure, 8, data)
        break;
      case 25:
        parseNote(measure, 9, data)
        break;
      default:
        break;
    }
  }

  /**
   * Read a single line, parse when key/value, store when further parsing needed
   * @param  {String} line
   */
  var readLine = function (line) {
    line = line.toString().trim();
    if (!line) { return; }

    let match = stopReg.exec(line)
    if (match) { stopsMap[match[1]] = Number(match[2]); return }
    match = backgroundReg.exec(line)
    if (match) { backgroundMap[match[1]] = match[2]; return }
    match = timingReg.exec(line)
    if (match) { extendedBPMMap[match[1]] = Number(match[2]); return }
    match = hitSoundReg.exec(line)
    if (match) { hitSoundsMap[match[1]] = match[2]; return }
    match = noteReg.exec(line)
    if (match) { parseData(Number(match[1]), Number(match[2]), match[3]); return }
    match = keyValReg.exec(line)
    if (match) { beatmap[match[1].toLowerCase()] = match[2]; return }
  };

  var processTimingPoints = function () {
    let currentBPM = beatmap.bpm ? Number(beatmap.bpm) : 130
    let currentBeat = 0
    let currentTime = 0
    beatmap.timingPoints.push({
      t: currentTime,
      x: currentBeat,
      dx: currentBPM / 60000,
      bpm: currentBPM,
      inclusive: true,
    })
    for(let timing of beatmap.timingPointsLines) {
      let beat = timing.beat
      let time = currentTime + (beat - currentBeat) * 60000 / currentBPM
      if(timing.bpm) {
        currentBPM = timing.bpm
        beatmap.timingPoints.push({
          t: time,
          x: beat,
          dx: currentBPM / 60000,
          bpm: currentBPM,
          inclusive: true,
        })
      } else {
        beatmap.timingPoints.push({
          t: time,
          x: beat,
          dx: 0,
          bpm: currentBPM,
          inclusive: true,
        })
        time += timing.time * 60000 / currentBPM
        beatmap.timingPoints.push({
          t: time,
          x: beat,
          dx: currentBPM / 60000,
          bpm: currentBPM,
          inclusive: false,
        })
      }
      currentBeat = beat
      currentTime = time
    }
  }

  var getTimingPoint = function (beat) {
    for(let i = 0; i < beatmap.timingPoints.length; i++) {
      if(beatmap.timingPoints[i + 1]) {
        if(beatmap.timingPoints[i + 1].inclusive && beat <= beatmap.timingPoints[i + 1].x) {
          return beatmap.timingPoints[i]
        } else if(!beatmap.timingPoints[i + 1].inclusive && beat < beatmap.timingPoints[i + 1].x) {
          return beatmap.timingPoints[i]
        }
      } else {
        return beatmap.timingPoints[i]
      }
    }
  }

  var getTime = function (beat) {
    let timingPoint = getTimingPoint(beat)
    return (beat - timingPoint.x) / (timingPoint.dx || 1) + timingPoint.t
  }

  /**
   * Compute everything that require the file to be completely parsed and return the beatmap
   * @return {Object} beatmap
   */
  var buildBeatmap = function () {
    if(beatmap.player == '2') return null

    beatmap.timingPointsLines.sort((a,b) => a.beat == b.beat ? a.time ? 1 : -1 : a.beat - b.beat)
    processTimingPoints()
    beatmap.notes.sort((a,b) => a.beat - b.beat)

    //let pendingLns = [];
    for(let note of beatmap.notes) {
      note.startTime = getTime(note.beat)
      beatmap.nbNotes++
    }

    for(let timeSound of beatmap.timeSounds) {
      timeSound.startTime = getTime(timeSound.beat)
    }

    let keyMode
    switch(extension) { // THERES PROBABLY A BETTER WAY
      case 'bms':
        keyMode = 8
        break;
      case 'bme':
        keyMode = 8
        break;
      case 'bml':
        keyMode = 8
        break;
      case 'pms':
        keyMode = 9
        break;
    }

    return {
      artist: beatmap.artist,
      title: beatmap.title,
      length: (beatmap.notes[beatmap.notes.length - 1].endTime ? beatmap.notes[beatmap.notes.length - 1].endTime :beatmap.notes[beatmap.notes.length - 1].startTime) / 1000,
      difficultyName: beatmap.difficulty,
      bpm: beatmap.bpm,
      timingWindows: 7,
      keys: keyMode,
      numberNotes: beatmap.nbNotes,
      numberLongnotes: beatmap.nbLns,
      backgroundFilename: '',
      notes: beatmap.notes,
      hitSoundsFilenames: Object.keys(beatmap.hitSounds),
      timeSounds: beatmap.timeSounds,
      offset: 0,
    };
  };

  return {
    readLine: readLine,
    buildBeatmap: buildBeatmap
  };
}

export default {
  /**
   * Parse the content of a .bms .bme .bml .pms file
   * @param  {String} content
   * @return {Object} beatmap
   */
  parseContent (content, extension) {
    var parser = beatmapParser(extension);
    content.toString().split(/[\n\r]+/).forEach(function (line) {
      parser.readLine(line);
    });
  
    return parser.buildBeatmap();
  }
}