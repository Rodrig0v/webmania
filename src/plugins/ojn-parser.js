'use strict';

function OJNParser(hitSounds) {
  var OJN_SIGNATURE = 0x006E6A6F
  var genreMap = ["Ballad", "Rock", "Dance", "Techno", "Hip-hop", "Soul/R&B", "Jazz", "Funk", "Classical", "Traditional", "Etc"];

  var data = {
    hitSounds: hitSounds,
    header: {},
    Easy: {
      nbNotes: 0,
      nbLns: 0,
      timingLines: [],
      timingPoints: [],
      noteLines: [],
      notes: [],
      timeSounds: [],
    },
    Normal: {
      nbNotes: 0,
      nbLns: 0,
      timingLines: [],
      timingPoints: [],
      noteLines: [],
      notes: [],
      timeSounds: [],
    },
    Hard: {
      nbNotes: 0,
      nbLns: 0,
      timingLines: [],
      timingPoints: [],
      noteLines: [],
      notes: [],
      timeSounds: [],
    }
  }

  var currentDiff

  var parseTimingPoint = function (beat, bpm) {
    if(bpm == 0)
      return
    data[currentDiff].timingLines.push({ beat, bpm })
  };

  var parseTimeSignature = function (beat, time) {
    if(time == 0)
      return
    data[currentDiff].timingLines.push({ beat, time })
  };

  var parseTimeSound = function (beat, event) {
    if(event.hitSound == 0)
      return
    
    // MIN 1 ~ 15 MAX, special 0 = MAX
    let volume = ((event.volumePan >> 4) & 0x0F) / 16;
    if(volume == 0) volume = 1;

    // LEFT 1 ~ 8 CENTER 8 ~ 15 RIGHT, special: 0 = 8
    let pan = (event.volumePan & 0x0F)
    if(pan == 0) pan = 8
    pan -= 8
    pan /= 7

    event.hitSound--

    if(event.type % 8 > 3)
      event.hitSound += 1000;

    data[currentDiff].timeSounds.push({ beat, name: event.hitSound, volume, pan })
  };

  var parseNote = function (beat, key, timing, event) {
    if(event.hitSound == 0)
      return

    // MIN 1 ~ 15 MAX, special 0 = MAX
    let volume = ((event.volumePan >> 4) & 0x0F) / 16;
    if(volume == 0) volume = 1;

    // LEFT 1 ~ 8 CENTER 8 ~ 15 RIGHT, special: 0 = 8
    let pan = (event.volumePan & 0x0F)
    if(pan == 0) pan = 8
    pan -= 8
    pan /= 7

    event.hitSound--

    if(event.type % 8 > 3)
      event.hitSound += 1000;
    event.type %= 4;

    switch(event.type) {
      case 0:
        data[currentDiff].noteLines.push({ beat, key, timing, hitSound: event.hitSound, soundTypes: [], objectName: 'note', volume, pan })
        break;
      case 2:
        data[currentDiff].noteLines.push({ beat, key, timing, hitSound: event.hitSound, soundTypes: [], objectName: 'longnote', volume, pan, start: true })
        break;
      case 3:
        data[currentDiff].noteLines.push({ beat, key, timing, hitSound: event.hitSound, soundTypes: [], objectName: 'longnote', volume, pan, start: false })
        break;
    }
  };

  var processTimingPoints = function () {
    data[currentDiff].timingLines.sort((a,b) => a.beat == b.beat ? a.time ? 1 : -1 : a.beat - b.beat)
    for(let i = 1; i < data[currentDiff].timingLines.length ; i++) {
      if(data[currentDiff].timingLines[i].beat == data[currentDiff].timingLines[i - 1].beat && data[currentDiff].timingLines[i].bpm == data[currentDiff].timingLines[i - 1].bpm && data[currentDiff].timingLines[i].time == data[currentDiff].timingLines[i - 1].time) {
        data[currentDiff].timingLines.splice(i, 1)
        i--
      }
    }

    let currentBPM = data.header.bpm
    let currentBeat = 0
    let currentTime = 0
    data[currentDiff].timingPoints.push({
      t: currentTime,
      x: currentBeat,
      dx: currentBPM / 60000,
      bpm: currentBPM,
      inclusive: true,
    })
    for(let timing of data[currentDiff].timingLines) {
      let beat = timing.beat
      let time = currentTime + (beat - currentBeat) * 60000 / currentBPM
      if(timing.bpm) {
        currentBPM = timing.bpm
        data[currentDiff].timingPoints.push({
          t: time,
          x: beat,
          dx: currentBPM / 60000,
          bpm: currentBPM,
          inclusive: true,
        })
      } else {
        // i dont know what to doooo
      }
      currentBeat = beat
      currentTime = time
    }
  }

  var getTimingPoint = function (beat) {
    for(let i = 0; i < data[currentDiff].timingPoints.length; i++) {
      if(data[currentDiff].timingPoints[i + 1]) {
        if(data[currentDiff].timingPoints[i + 1].inclusive && beat <= data[currentDiff].timingPoints[i + 1].x) {
          return data[currentDiff].timingPoints[i]
        } else if(!data[currentDiff].timingPoints[i + 1].inclusive && beat < data[currentDiff].timingPoints[i + 1].x) {
          return data[currentDiff].timingPoints[i]
        }
      } else {
        return data[currentDiff].timingPoints[i]
      }
    }
  }

  var getTime = function (beat) {
    let timingPoint = getTimingPoint(beat)
    return (beat - timingPoint.x) / (timingPoint.dx || 1) + timingPoint.t
  }

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

  var processNotes = function() {
    data[currentDiff].noteLines.sort((a,b) => a.beat - b.beat)
    for(let i = 1; i < data[currentDiff].noteLines.length ; i++) {
      if(data[currentDiff].noteLines[i].beat == data[currentDiff].noteLines[i - 1].beat && data[currentDiff].noteLines[i].key == data[currentDiff].noteLines[i - 1].key) {
        data[currentDiff].noteLines.splice(i, 1)
        i--
      }
    }

    let pendingLns = [];
    for(let note of data[currentDiff].noteLines) {
      if(note.objectName == 'note' && pendingLns.find((ln) => ln.key == note.key) == null) {
        note.startTime = getTime(note.beat)
        data[currentDiff].nbNotes++
        data[currentDiff].notes.push(note)
      } else if(note.objectName == 'longnote' && note.start && pendingLns.find((ln) => ln.key == note.key) == null) {
        note.startTime = getTime(note.beat)
        data[currentDiff].nbLns++
        data[currentDiff].notes.push(note)
        pendingLns.push(note)
      } else {
        let ln = pendingLns.find((ln) => ln.key == note.key)
        if(ln == null) continue
        pendingLns = pendingLns.filter((ln) => ln.key != note.key)
        ln.endTime = getTime(note.beat)
        ln.endHitSound = note.hitSound
      }
    }
  }

  var processTimeSounds = function() {
    data[currentDiff].timeSounds.sort((a,b) => a.beat - b.beat)
    for(let i = 1; i < data[currentDiff].timeSounds.length ; i++) {
      if(data[currentDiff].timeSounds[i].beat == data[currentDiff].timeSounds[i - 1].beat && data[currentDiff].timeSounds[i].name == data[currentDiff].timeSounds[i - 1].name) {
        data[currentDiff].timeSounds.splice(i, 1)
        i--
      }
    }

    for(let timeSound of data[currentDiff].timeSounds) {
      timeSound.startTime = getTime(timeSound.beat)
    }
  }

  var parseOJN = function (buffer) {
    let dec = new TextDecoder('utf-8')
    let dataview = new DataView(buffer)
    let cursor = 0

    data.header.songId = dataview.getInt32(cursor, true);
    cursor += 4
    data.header.signature = dataview.getInt32(cursor, true);
    cursor += 4

    if(data.header.signature != OJN_SIGNATURE)
      return null;
    
    data.header.encodeVersion = dataview.getFloat32(cursor, true);
    cursor += 4
    data.header.genre = dataview.getInt32(cursor, true);
    data.header.genreString = genreMap[(data.header.genre < 0 || data.header.genre > 10) ? 10 : data.header.genre];
    cursor += 4
    data.header.bpm = dataview.getFloat32(cursor, true);
    cursor += 4

    data.Easy.level = dataview.getInt16(cursor, true);
    cursor += 2
    data.Normal.level = dataview.getInt16(cursor, true);
    cursor += 2
    data.Hard.level = dataview.getInt16(cursor, true);
    cursor += 2
    //ignore next short
    cursor += 2

    data.Easy.eventCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Normal.eventCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Hard.eventCount = dataview.getInt32(cursor, true);
    cursor += 4

    data.Easy.noteCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Normal.noteCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Hard.noteCount = dataview.getInt32(cursor, true);
    cursor += 4

    data.Easy.measureCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Normal.measureCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Hard.measureCount = dataview.getInt32(cursor, true);
    cursor += 4

    data.Easy.packageCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Normal.packageCount = dataview.getInt32(cursor, true);
    cursor += 4
    data.Hard.packageCount = dataview.getInt32(cursor, true);
    cursor += 4

    data.header.oldEncodeVersion = dataview.getInt16(cursor, true);
    cursor += 2
    data.header.oldSongId = dataview.getInt16(cursor, true);
    cursor += 2
    data.header.oldGenre = dec.decode(buffer.slice(cursor, cursor + 20));
    cursor += 20
    data.header.bmpSize = dataview.getInt32(cursor, true);
    cursor += 4
    data.header.oldFileVersion = dataview.getInt32(cursor, true);
    cursor += 4
    data.header.title = dec.decode(buffer.slice(cursor, cursor + 64));
    cursor += 64
    data.header.artist = dec.decode(buffer.slice(cursor, cursor + 32));
    cursor += 32
    data.header.noter = dec.decode(buffer.slice(cursor, cursor + 32));
    cursor += 32
    data.header.ojmFile = dec.decode(buffer.slice(cursor, cursor + 32));
    cursor += 32
    data.header.coverSize = dataview.getInt32(cursor, true);
    cursor += 4

    data.Easy.duration = dataview.getInt32(cursor, true);
    cursor += 4
    data.Normal.duration = dataview.getInt32(cursor, true);
    cursor += 4
    data.Hard.duration = dataview.getInt32(cursor, true);
    cursor += 4

    data.Easy.noteOffset = dataview.getInt32(cursor, true);
    cursor += 4
    data.Normal.noteOffset = dataview.getInt32(cursor, true);
    cursor += 4
    data.Hard.noteOffset = dataview.getInt32(cursor, true);
    cursor += 4

    data.header.coverOffset = dataview.getInt32(cursor, true);
    cursor += 4

    cursor = data.header.coverOffset
    data.image = 'data:image/png;base64,' + Buffer.from(buffer.slice(cursor, cursor + data.header.coverSize)).toString('base64')

    for(let difficulty of ['Easy', 'Normal', 'Hard']) {
      currentDiff = difficulty
      cursor = data[currentDiff].noteOffset
      for(let i = 0; i < data[currentDiff].packageCount; i++) {
        let currentPackage = {}
        currentPackage.measure = dataview.getInt32(cursor, true);
        cursor += 4
        currentPackage.channel = dataview.getInt16(cursor, true);
        cursor += 2
        currentPackage.events = dataview.getInt16(cursor, true);
        cursor += 2

        for(let j = 0; j < currentPackage.events; j++) {
          let beat = (currentPackage.measure + j / currentPackage.events) * 4
          if(currentPackage.channel == 0) {
            let time = dataview.getFloat32(cursor, true)
            cursor += 4
            parseTimeSignature(beat, time)
          } else if(currentPackage.channel == 1) {
            let bpm = dataview.getFloat32(cursor, true)
            cursor += 4
            parseTimingPoint(beat, bpm)
          } else if(currentPackage.channel > 8) {
            let event = {}
            event.hitSound = dataview.getInt16(cursor, true)
            cursor += 2
            event.volumePan = dataview.getInt8(cursor, true)
            cursor += 1
            event.type = dataview.getInt8(cursor, true)
            cursor += 1
            parseTimeSound(beat, event)
          } else {
            let event = {}
            event.hitSound = dataview.getInt16(cursor, true)
            cursor += 2
            event.volumePan = dataview.getInt8(cursor, true)
            cursor += 1
            event.type = dataview.getInt8(cursor, true)
            cursor += 1
            parseNote(beat, currentPackage.channel - 2, getTiming(j, currentPackage.events), event)
          }
        }
      }
    }
  }



  var buildDifficulties = function () {
    let difficulties = []

    for(let difficulty of ['Easy', 'Normal', 'Hard']) {
      currentDiff = difficulty

      processTimingPoints()

      processNotes()

      processTimeSounds()

      if(data[currentDiff].notes == 0)
        continue

      difficulties.push({
        beatmap: {
          artist: data.header.artist,
          title: data.header.title,
          length: (data[currentDiff].notes[data[currentDiff].notes.length - 1].endTime ? data[currentDiff].notes[data[currentDiff].notes.length - 1].endTime : data[currentDiff].notes[data[currentDiff].notes.length - 1].startTime) / 1000,
          difficultyName: currentDiff + ' - lvl ' + data[currentDiff].level,
          bpm: data.header.bpm,
          timingWindows: 5,
          keys: 7,
          numberNotes: data[currentDiff].nbNotes,
          numberLongnotes: data[currentDiff].nbLns,
          notes: data[currentDiff].notes,
          timeSounds: data[currentDiff].timeSounds,
          offset: 0,
        },
        image: data.image,
        hitSounds: data.hitSounds,
        starRating: 0,
      })
    }

    return difficulties
  };

  return {
    parseOJN: parseOJN,
    buildDifficulties: buildDifficulties
  };
}

export default {
  /**
   * Parse the content of a .ojn file
   * @param  {Buffer} buffer
   * @return {Object} beatmap
   */
  parseContent (buffer, hitSounds) {
    var parser = OJNParser(hitSounds);
      parser.parseOJN(buffer);
  
    return parser.buildDifficulties();
  }
}