'use strict';

function beatmapParser() {
  var beatmap = {
    nbNotes: 0,
    nbLns: 0,
    timingPoints: [],
    notes: [],
    hitSounds: {},
    timeSounds: [],
  };

  var osuSection;
  var members;

  var timingLines    = [];
  var objectLines    = [];
  var eventsLines    = [];
  var sectionReg     = /^\[([a-zA-Z0-9]+)\]$/;
  var keyValReg      = /^([a-zA-Z0-9]+)[ ]*:[ ]*(.+)$/;
  var backgroundReg  = /^0,(.+),"(.+)".*$/;
  var sampleReg1     = /^Sample,(.+),(.+),"(.+)",(.+)$/;
  var sampleReg2     = /^5,(.+),(.+),"(.+)",(.+)$/;

  /**
   * Get the timing point affecting a specific offset
   * @param  {Integer} offset
   * @return {Object} timingPoint
   */
  var getTimingPoint = function (offset) {
    for (var i = beatmap.timingPoints.length - 1; i >= 0; i--) {
      if (beatmap.timingPoints[i].offset <= offset) { return beatmap.timingPoints[i]; }
    }
    return beatmap.timingPoints[0];
  };

  /**
   * Parse hitSound member
   * @param  {String} str         hitSound member (sample:add:customSampleIndex:Volume:hitSound)
   * @return {Object} hitSound    the hitSound filename
   */
   var parsehitSound = function (str) {
    if (!str) return '';

    var adds = str.split(':');

    return adds[4]
  };

  /**
   * Parse a timing line
   * @param  {String} line
   */
  var parseTimingPoint = function (line) {
    members = line.split(',');

    var timingPoint = {
      offset:            parseInt(members[0]),
      beatLength:        parseFloat(members[1]),
      velocity:          1,
      timingSignature:   parseInt(members[2]),
      sampleSetId:       parseInt(members[3]),
      customSampleIndex: parseInt(members[4]),
      sampleVolume:      parseInt(members[5]),
      timingChange:      (members[6] == 1),
      kiaiTimeActive:    (members[7] == 1)
    };

    if (!isNaN(timingPoint.beatLength) && timingPoint.beatLength !== 0) {
      if (timingPoint.beatLength > 0) {
        // If positive, beatLength is the length of a beat in milliseconds
        var bpm        = Math.round(60000 / timingPoint.beatLength);
        beatmap.bpmMin = beatmap.bpmMin ? Math.min(beatmap.bpmMin, bpm) : bpm;
        beatmap.bpmMax = beatmap.bpmMax ? Math.max(beatmap.bpmMax, bpm) : bpm;
        timingPoint.bpm    = bpm;
      } else {
        // If negative, beatLength is a velocity factor
        timingPoint.velocity = Math.abs(100 / timingPoint.beatLength);
      }
    }

    beatmap.timingPoints.push(timingPoint);
  };

  /**
   * Parse an object line
   * @param  {String} line
   */
  var parseNote = function (line) {
    members = line.split(',');

    var soundType  = members[4];
    var objectType = members[3];

    var note = {
      startTime:  parseInt(members[2]),
      hitSound: null,
      soundTypes: [],
    };

    /**
     * sound type is a bitwise flag enum
     * 0 : normal
     * 2 : whistle
     * 4 : finish
     * 8 : clap
     */
    if ((soundType & 2) == 2)              { note.soundTypes.push('whistle'); }
    if ((soundType & 4) == 4)              { note.soundTypes.push('finish');  }
    if ((soundType & 8) == 8)              { note.soundTypes.push('clap');    }
    if (note.soundTypes.length === 0) { note.soundTypes.push('normal'); }

    /**
     * Calculate note time signature
     */
     var timing = getTimingPoint(note.startTime);

     if (timing) {
       note.timing = findTimingOfNote(timing.beatLength, (timing.beatLength - ((note.startTime - timing.offset) % timing.beatLength)))
     } else {
       note.timing = 1
     }

    /**
     * object type is a bitwise flag enum
     * 1: note/circle
     * 2: slider
     * 8: spinner
     * 128: longnote
     */
    if ((objectType & 1) == 1) {
      // Note
      beatmap.nbNotes++;
      note.objectName = 'note';
      note.endTime = note.startTime
      let hitSound = parsehitSound(members[5])
      if(hitSound != '') {
        note.hitSound = hitSound
        beatmap.hitSounds[hitSound] = true
      }
    } else if ((objectType & 128) == 128) {
      // Longnote
      beatmap.nbLns++;
      note.objectName  = 'longnote';
      note.endTime  = parseInt(members[5]);
      let hitSound = parsehitSound(members[6])
      if(hitSound != '') {
        note.hitSound = hitSound
        beatmap.hitSounds[hitSound] = true
      }
    } else {
      // Unknown
      return;
    }

    note.key = Math.floor(parseInt(members[0]) * beatmap.CircleSize / 512)

    beatmap.notes.push(note);
  };

  /**
   * Parse an event line
   * @param  {String} line
   */
  var findTimingOfNote = function (beatLength, noteTime) {
    let timings = [
      [1, [0, beatLength]],
      [2, [beatLength / 2,]],
      [3, [beatLength / 3, beatLength * 2 / 3]],
      [4, [beatLength / 4, beatLength * 3 / 4]],
      [6, [beatLength / 6, beatLength * 5 / 6]],
      [8, [beatLength / 8, beatLength * 3 / 8, beatLength * 5 / 8, beatLength * 7 / 8]],
      [12, [beatLength / 12, beatLength * 5 / 12, beatLength * 7 / 12, beatLength * 11 / 12]],
      [16, [beatLength / 16, beatLength * 3 / 16, beatLength * 5 / 16, beatLength * 7 / 16, beatLength * 9 / 16, beatLength * 11 / 16, beatLength * 13 / 16, beatLength * 15 / 16]],
    ]
    let difference = Number.POSITIVE_INFINITY
    let result = 16

    for(let i = 0; i < timings.length; i++) {
      for(let j = 0; j < timings[i][1].length; j++) {
        if(Math.abs(noteTime - timings[i][1][j]) < difference) {
          difference = Math.abs(noteTime - timings[i][1][j])
          result = timings[i][0]
        }
      }
    }

    return result
  }

  /**
   * Parse an event line
   * @param  {String} line
   */
  var parseEvent = function (line) {
    /**
     * Background line : 0,0,"bg.jpg"
     * TODO: confirm that the second member is always zero
     */
    let match
    match = backgroundReg.exec(line)
    if(match) {
      beatmap.bgFilename = match[2]
      return
    }
    match = sampleReg1.exec(line)
    if(match) {
      beatmap.timeSounds.push({ startTime: Number(match[1]), name: match[3]})
      return
    }
    match = sampleReg2.exec(line)
    if(match) {
      beatmap.timeSounds.push({ startTime: Number(match[1]), name: match[3]})
      return
    }
  };

  /**
   * Read a single line, parse when key/value, store when further parsing needed
   * @param  {String|Buffer} line
   */
  var readLine = function (line) {
    line = line.toString().trim();
    if (!line) { return; }

    var match = sectionReg.exec(line);
    if (match) {
      osuSection = match[1].toLowerCase();
      return;
    }

    switch (osuSection) {
    case 'timingpoints':
      timingLines.push(line);
      break;
    case 'hitobjects':
      objectLines.push(line);
      break;
    case 'events':
      eventsLines.push(line);
      break;
    default:
      if (!osuSection) {
        match = /^osu file format (v[0-9]+)$/.exec(line);
        if (match) {
          beatmap.fileFormat = match[1];
          return;
        }
      }

      /**
       * Apart from events, timingpoints and hitobjects sections, lines are "key: value"
       */
      match = keyValReg.exec(line);
      if (match) { beatmap[match[1]] = match[2]; }
    }
  };

  /**
   * Compute everything that require the file to be completely parsed and return the beatmap
   * @return {Object} beatmap
   */
  var buildBeatmap = function () {
    if(beatmap.Mode != 3) {
      return null;
    }

    if(beatmap.CircleSize < 1 || beatmap.CircleSize > 10) {
      return null;
    }

    if (beatmap.Tags) {
      beatmap.tagsArray = beatmap.Tags.split(' ');
    }

    eventsLines.forEach(parseEvent);

    timingLines.forEach(parseTimingPoint);
    beatmap.timingPoints.sort(function (a, b) { return (a.offset > b.offset ? 1 : -1); });

    var timingPoints = beatmap.timingPoints;

    for (let i = 1, l = timingPoints.length; i < l; i++) {
      if (timingPoints[i].bpm == null) {
        timingPoints[i].beatLength = timingPoints[i - 1].beatLength;
        timingPoints[i].bpm        = timingPoints[i - 1].bpm;
      }
    }

    objectLines.forEach(parseNote);
    beatmap.notes.sort(function (a, b) { return (a.startTime > b.startTime ? 1 : -1); });

    if(beatmap.AudioFilename != 'virtual') {
      beatmap.timeSounds.push({ startTime: Number(beatmap.AudioLeadIn), name: beatmap.AudioFilename })
      beatmap.hitSounds[beatmap.AudioFilename] = true
    }
    beatmap.timeSounds.sort(function (a, b) { return (a.startTime > b.startTime ? 1 : -1); });

    return {
      artist: beatmap.Artist,
      title: beatmap.Title,
      length: (beatmap.notes[beatmap.notes.length - 1].endTime ? beatmap.notes[beatmap.notes.length - 1].endTime : beatmap.notes[beatmap.notes.length - 1].startTime) / 1000,
      difficultyName: beatmap.Version,
      bpm: beatmap.bpmMax,
      timingWindows: parseInt(beatmap.OverallDifficulty),
      keys: parseInt(beatmap.CircleSize),
      numberNotes: beatmap.nbNotes,
      numberLongnotes: beatmap.nbLns,
      backgroundFilename: beatmap.bgFilename,
      notes: beatmap.notes,
      hitSoundsFilenames: Object.keys(beatmap.hitSounds),
      timeSounds: beatmap.timeSounds,
      offset: 70,
    };
  };

  return {
    readLine: readLine,
    buildBeatmap: buildBeatmap
  };
}

export default {
  /**
   * Parse the content of a .osu file
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