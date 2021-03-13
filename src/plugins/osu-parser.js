'use strict';

import { exists as _exists, createReadStream } from 'fs';
import Queue from 'denque';

function beatmapParser() {
  var beatmap = {
    nbNotes: 0,
    nbLns: 0,
    timingPoints: [],
    breakTimes: [],
    notes: []
  };

  var osuSection;
  var members;

  var timingLines    = [];
  var objectLines    = [];
  var eventsLines    = [];
  var sectionReg     = /^\[([a-zA-Z0-9]+)\]$/;
  var keyValReg      = /^([a-zA-Z0-9]+)[ ]*:[ ]*(.+)$/;

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
      note.timing = Math.round(timing.beatLength / (timing.beatLength - ((note.startTime - timing.offset) % timing.beatLength)));
      if(note.timing > 20) {
        note.timing = 1;
      }
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
    } else if ((objectType & 128) == 128) {
      // Longnote
      beatmap.nbLns++;
      note.objectName  = 'longnote';
      note.endTime  = parseInt(members[5]);
    } else {
      // Unknown
      return;
    }

    beatmap.notes[Math.floor(parseInt(members[0]) * beatmap.CircleSize / 512)].push(note);
  };

  /**
   * Parse an event line
   * @param  {String} line
   */
  var parseEvent = function (line) {
    /**
     * Background line : 0,0,"bg.jpg"
     * TODO: confirm that the second member is always zero
     *
     * Breaktimes lines : 2,1000,2000
     * second integer is start offset
     * third integer is end offset
     */
    members = line.split(',');

    if (members[0] == '0' && members[1] == '0' && members[2]) {
      var bgName = members[2].trim();

      if (bgName.charAt(0) == '"' && bgName.charAt(bgName.length - 1) == '"') {
        beatmap.bgFilename = bgName.substring(1, bgName.length - 1);
      } else {
        beatmap.bgFilename = bgName;
      }
    } else if (members[0] == '2' && /^[0-9]+$/.test(members[1]) && /^[0-9]+$/.test(members[2])) {
      beatmap.breakTimes.push({
        startTime: parseInt(members[1]),
        endTime: parseInt(members[2])
      });
    }
  };

  /**
   * Compute the total time and the draining time of the beatmap
   */
  var computeDuration = function () {
    var firstObject = beatmap.notes[0];
    var lastObject  = beatmap.notes[beatmap.notes.length - 1];

    var totalBreakTime = 0;

    beatmap.breakTimes.forEach(function (breakTime) {
      totalBreakTime += (breakTime.endTime - breakTime.startTime);
    });

    if (firstObject && lastObject) {
      beatmap.totalTime    = Math.floor(lastObject.startTime / 1000);
      beatmap.drainingTime = Math.floor((lastObject.startTime - firstObject.startTime - totalBreakTime) / 1000);
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

    if(beatmap.CircleSize < 1 || beatmap.CircleSize > 7) {
      return null;
    }

    if (beatmap.Tags) {
      beatmap.tagsArray = beatmap.Tags.split(' ');
    }

    eventsLines.forEach(parseEvent);
    beatmap.breakTimes.sort(function (a, b) { return (a.startTime > b.startTime ? 1 : -1); });

    for(let i = 0; i < beatmap.CircleSize; i++) {
      beatmap.notes.push(new Queue());
    }

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

    computeDuration();

    return beatmap;
  };

  return {
    readLine: readLine,
    buildBeatmap: buildBeatmap
  };
}

export default {
  /**
   * Parse a .osu file
   * @param  {String}   file  path to the file
   * @param  {Function} callback(err, beatmap)
   */
  parseFile (file, callback) {
    _exists(file, function (exists) {
      if (!exists) {
        callback(new Error('file does not exist'));
        return;
      }
  
      var parser = beatmapParser();
      var stream = createReadStream(file);
      var buffer = '';
  
  
      stream.on('data', function (chunk) {
        buffer   += chunk;
        var lines = buffer.split(/\r?\n/);
        buffer    = lines.pop() || '';
        lines.forEach(parser.readLine);
      });
  
      stream.on('error', function (err) {
        callback(err);
      });
  
      stream.on('end', function () {
        buffer.split(/\r?\n/).forEach(parser.readLine);
        callback(null, parser.buildBeatmap());
      });
    });
  },
  /**
   * Parse a stream containing .osu content
   * @param  {Stream}   stream
   * @param  {Function} callback(err, beatmap)
   */
  parseStream (stream, callback) {
    var parser = beatmapParser();
    var buffer = '';
  
    stream.on('data', function (chunk) {
      buffer   += chunk.toString();
      var lines = buffer.split(/\r?\n/);
      buffer    = lines.pop() || '';
      lines.forEach(parser.readLine);
    });
  
    stream.on('error', function (err) {
      callback(err);
    });
  
    stream.on('end', function () {
      buffer.split(/\r?\n/).forEach(parser.readLine);
      callback(null, parser.buildBeatmap());
    });
  },
  /**
   * Parse the content of a .osu
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