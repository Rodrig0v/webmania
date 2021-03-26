'use strict';

function beatmapParser() {
  var beatmap = {
    nbNotes: 0,
    nbLns: 0,
    hitSounds: {},
    timingPoints: {},
    breakTimes: [],
    notes: [],
    backgroundMap: {},
    timingPointsMap: {},
    hitSoundsMap: {}
  };

  var bmsSection;

  var sectionReg     = /^\*---------------------- (.+)$/i;
  var keyValReg      = /^(#[a-zA-Z0-9]+)[ ]*(.+)$/i;
  var backgroundReg  = /^#BMP([a-zA-Z0-9]+)[ ]*(.+)$/i
  var timingReg      = /^#BPM([a-zA-Z0-9]+)[ ]*(.+)$/i
  var hitSoundReg    = /^#(WAV|OGG)([a-zA-Z0-9]+)[ ]*(.+)$/i
  var noteReg        = /^#([0-9][0-9][0-9])([a-zA-Z0-9][a-zA-Z0-9]):([a-zA-Z0-9]+)/i

  /**
   * Parse a timing line
   * @param  {String} line
   */
  var parseTimingPoint = function (id, bpm) {
    beatmap.timingPoints[id] = Number(bpm)
  };

  /**
   * Parse a timing line
   * @param  {String} line
   */
  var parsetimeSound = function (id, bpm) {
    beatmap.timingPoints[id] = Number(bpm)
  };

  /**
   * Parse a note line
   * @param  {String} line
   */
  var parseNote = function (measure, key, objects) {
    beatmap.notes.push({ key: key, startTime: measure})
    objects
    findTimingOfNote(0,0)
  };

  /**
   * Parse an event line
   * @param  {String} line
   */
  var findTimingOfNote = function (beatLength, noteTime) {
    beatLength
    noteTime
  }

  var parseData = function (measure, channel, data) {
    switch (channel) {
      case 1:
        parsetimeSound(measure, channel, data)
        break;
      case 2:
        parseTimingPoint()
        break;
      case 3:
        parseTimingPoint()
        break;
      case 4:
        parseTimingPoint()
        break;
      case 5:
        parseTimingPoint()
        break;
      case 6:
        parseTimingPoint()
        break;
      case 7:
        parseTimingPoint()
        break;
      case 8:
        parseTimingPoint()
        break;
      case 9:
        parseTimingPoint()
        break;
      case 11:
        parseNote(measure, 0, data)
        break;
      case 12:
        parseNote(measure, 1, data)
        break;
      case 13:
        parseNote(measure, 2, data)
        break;
      case 14:
        parseNote(measure, 3, data)
        break;
      case 15:
        parseNote(measure, 4, data)
        break;
      /*case 16:
        parseNote(measure, 7, data)
        break;*/
      case 18:
        parseNote(measure, 5, data)
        break;
      case 19:
        parseNote(measure, 6, data)
        break;
      default:
        break;
    }
  }

  /**
   * Compute the total time and the draining time of the beatmap
   */
  var computeDuration = function () {
    var firstObject = beatmap.notes[0];
    var lastObject = beatmap.notes[beatmap.notes.length - 1];

    var totalBreakTime = 0;

    beatmap.breakTimes.forEach(function (breakTime) {
      totalBreakTime += (breakTime.endTime - breakTime.startTime);
    });

    if (firstObject && lastObject) {
      beatmap.totalTime    = lastObject.startTime / 1000;
      beatmap.drainingTime = (lastObject.startTime - firstObject.startTime - totalBreakTime) / 1000;
    } else {
      beatmap.totalTime    = 0;
      beatmap.drainingTime = 0;
    }
  };

  /**
   * Read a single line, parse when key/value, store when further parsing needed
   * @param  {String|Buffer} line
   */
  var readLine = function (line) {
    line = line.toString().trim();
    if (!line) { return; }

    let match = sectionReg.exec(line);
    if (match) {
      bmsSection = match[1].toLowerCase();
      return;
    }

    switch (bmsSection) {
    case 'header field':
      match = backgroundReg.exec(line)
      if (match) { beatmap.backgroundMap(match[1], match[2]); return }
      match = timingReg.exec(line)
      if (match) { beatmap.timingPointsMap[match[1]] = Number(match[2]); return }
      match = hitSoundReg.exec(line)
      if (match) { beatmap.hitSoundsMap[match[2]] = match[3]; return }
      match = keyValReg.exec(line)
      if (match) { beatmap[match[1]] = match[2]; return; }
      break;
    case 'main data field':
      match = noteReg.exec(line)
      parseData(Number(match[1]), Number(match[2]), match[3])
      break;
    default:
      break;
    }
  };

  /**
   * Compute everything that require the file to be completely parsed and return the beatmap
   * @return {Object} beatmap
   */
  var buildBeatmap = function () {
    console.log(beatmap)
    computeDuration()

    return {
      artist: beatmap.Artist,
      title: beatmap.Title,
      length: beatmap.totalTime,
      difficultyName: beatmap.Version,
      bpm: beatmap.bpmMax,
      timingWindows: parseInt(beatmap.OverallDifficulty),
      keys: parseInt(beatmap.CircleSize),
      numberNotes: beatmap.nbNotes,
      numberLongnotes: beatmap.nbLns,
      songFilename: beatmap.AudioFilename,
      backgroundFilename: beatmap.bgFilename,
      notes: beatmap.notes,
      hitSoundsFilenames: Object.keys(beatmap.hitSounds),
      timeSounds: [],
    };
  };

  return {
    readLine: readLine,
    buildBeatmap: buildBeatmap
  };
}

export default {
  /**
   * Parse the content of a .bms file
   * @param  {String|Buffer} content
   * @return {Object} beatmap
   */
  parseContent (content) {
    var parser = beatmapParser();
    content.toString().split(/[\n\r]+/).forEach(function (line) {
      parser.readLine(line);
    });
  
    return parser.buildBeatmap();
  }
}