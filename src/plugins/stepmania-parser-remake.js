'use strict';

function beatmapParser() {
  var keyValReg     = /^#([a-zA-Z0-9]+):([^;]*);?$/
  var beatmapKeyValReg = /^(.*):(.*)$/
  var bpmReg = /^(.*)=(.*)$/
  var metadata = { keyTimings: [], beatmaps: [] }

  var sizes = {
    'dance-threepanel': 3,
    'dance-single': 4,
    'dance-solo': 6,
    'dance-double': 8,
    'dance-couple': 8,
    'pump-single': 5,
    'pump-halfdouble': 6,
    'pump-double': 10,
    'pump-couple': 10,
    'ez2-single': 5,
    'ez2-double': 10,
    'ez2-real': 7,
    'para-single': 5,
    'ds3ddx-single': 8,
    'maniax-single': 4,
    'maniax-double': 8,
    'techno-single4': 4,
    'techno-single5': 5,
    'techno-single8': 8,
    'techno-double4': 8,
    'techno-double5': 10,
    'pnm-five': 5,
    'pnm-nine': 9,
  };

  var beatmapMetadata = {
    0: 'mode',
    1: 'name',
    2: 'difficulty',
    3: 'meter',
    4: 'radar',
  }

  var getTiming = function(beat, measurelength) {
    var divs = 3 * 128;
    var val = beat * divs / measurelength;
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
  };

  var getKeyTiming = function(beat) {
    for(let i = 0; i < metadata.keyTimings.length; i++) {
      if(metadata.keyTimings[i].beat > beat) return metadata.keyTimings[i]
    }
    return metadata.keyTimings[metadata.keyTimings.length - 1]
  }

  var processKeyTimings = function() {
    let bpms = metadata.bpms.split(',')
    let match = bpmReg.exec(bpms[0])
    metadata.keyTimings.push({ beat: Number(match[1]), startTime: -metadata.offset, bpm: Number(match[2]) })
    for(let i = 1; i < bpms.length; i++) {
      match = bpmReg.exec(bpms[i])
      metadata.keyTimings.push({ beat: Number(match[1]), startTime: bpms[i-1].startTime + (Number(match[1]) - bpms[i-1].beat) * bpms[i-1].bpm, bpm: Number(match[2]) })
    }
  }

  var buildBeatmap = function(lines) {
    let currentLine = 0
    while(lines[currentLine] != '#NOTES:') {
      let match = keyValReg.exec(lines[currentLine])
      if(match) {
        metadata[match[1].toLowerCase()] = match[2]
      }
      currentLine++
    }
    processKeyTimings()
    while(currentLine != lines.length) {
      if(lines[currentLine] == '#NOTES:') {
        currentLine++
        let beatmap = { notes: [] }
        let beatmapMetadataIndex = 0
        let currentBeat = 0
        let pendingLns = []
        let firstBeat = -metadata.offset
        while(lines[currentLine] != ';') {
          if(beatmapMetadataIndex < 5) {
            let match = beatmapKeyValReg.exec(lines[currentLine])
            if(match) {
              beatmap[beatmapMetadata[beatmapMetadataIndex]] = match[1]
              beatmapMetadataIndex++
              currentLine++
              continue
            } else {
              currentLine++
              continue
            }
          }
          let measure = []
          while(lines[currentLine] != ',' || lines[currentLine] != ';') {
            measure.push(lines[currentLine])
            currentLine++
          }
          for(let beat = 0; beat < measure.length; beat++) {
            let lanes = measure[beat].split("")
            for(let lane = 0; lane < lanes.length; lane++) {
              let keyTiming = getKeyTiming(currentBeat + beat / measure.length)
              let time = firstBeat + keyTiming.startTime + 60000 / keyTiming.bpm * 4
              if(lanes[lane] == '1') {
                let note = {
                  startTime: time,
                  timing: getTiming(beat, measure.length),
                  objectName: 'note',
                  hitSound: null,
                  soundTypes: [],
                  key: lane,
                }
                beatmap.notes.push(note)
                beatmap.nbnotes++
              } else if(lanes[lane] == '2' || lanes[lane] == '4') {
                let note = {
                  startTime: time,
                  timing: getTiming(beat, measure.length),
                  objectName: 'longnote',
                  hitSound: null,
                  soundTypes: [],
                  key: lane,
                }
                beatmap.notes.push(note)
                beatmap.nblongnotes++
                pendingLns.push(note)
              } else if(lanes[lane] == '3') {
                let note = pendingLns.find((ln) => ln.key == lane)
                pendingLns = pendingLns.filter((ln) => ln.key != lane)
                note.endTime = time
              }
            }
          }
          currentBeat++
        }
        metadata.beatmaps.push(beatmap)
        currentLine++
      } else {
        currentLine++
      }
    }
    
    let returnvalue = []
    for(let beatmap of metadata.beatmaps) {
      returnvalue.push(
        {
          artist: metadata.artist,
          title: metadata.title,
          length: (beatmap.notes[0] - beatmap.notes[beatmap.notes.length - 1]) / 1000,
          difficultyName: beatmap.difficulty + ' ' + beatmap.meter,
          bpm: metadata.keyTimings[0].bpm,
          timingWindows: 8,
          keys: sizes[beatmap.mode],
          numberNotes: beatmap.nbnotes,
          numberLongnotes: beatmap.nblongnotes,
          backgroundFilename: metadata.background == '' ? 'BG.png' : metadata.background,
          notes: beatmap.notes,
          hitSoundsFilenames: [],
          timeSounds: [{ startTime: 0, name: metadata.music}], // SEE HOW OFFSET WORKS
        }
      )
    }

    console.log(returnvalue)

    return returnvalue
  }

    /*for (let i in lines) {
        let parts = lines[i].trim().split(":");
        parts = [parts.shift(), parts.join(":")];
        let tag = parts.splice(0, 1)[0].replace(/^#/, "");
        if (!tag || parts.length === 0) continue;
        let val = (parts.length === 1 ? parts[0] : parts);
        if (tag === "NOTES" && val.indexOf(":") > -1) {
            let cParts = val.split(":");
            for (let j in tags.chart.ssc) {
                let cTag = tags.chart.ssc[j];
                if (!beatmap[cTag]) beatmap[cTag] = [];
            }
            for (let j in tags.chart.sm) {
                beatmap[tags.chart.sm[j]].push(cParts[j].trim());
            }
        } else if (tags.chart.ssc.indexOf(tag) > -1) {
            if (!beatmap[tag]) beatmap[tag] = [];
            beatmap[tag].push(val);
        } else if (tags.list.indexOf(tag) > -1) {
            let items = val.replace(/\s+/gm, "").split(",").filter(function(x) { return !!x; });
            let data = [];
            for (let j in items) {
                let lParts = items[j].split("=");
                data.push(lParts);
            }
            beatmap[tag] = data;
        } else {
            beatmap[tag] = val;
        }
    }
    beatmap.NUMBERLONGNOTES = []
    beatmap.NUMBERNOTES = []
    beatmap.TOTALTIME = []
    beatmap.ACTUALNOTES = []
    for (let i in beatmap.NOTES) {
        beatmap.NUMBERLONGNOTES[i] = 0
        beatmap.NUMBERNOTES[i] = 0
        beatmap.ACTUALNOTES[i] = []
        beatmap.RADARVALUES[i] = beatmap.RADARVALUES[i].split(",");
        let notes = beatmap.NOTES[i].trim().split(/,\s*[]/);
        let bars = [];
        let pendingLns = [];
        let firstBeat = - Number(beatmap.OFFSET) * 1000
        for (let j in notes) {
            let barNotes = notes[j].trim().replace(/\s+/gm, " ").split(/\s+/);
            for (let k in barNotes) {
                barNotes[k] = barNotes[k].split("");
                for(let l = 0; l < barNotes[k].length; l++) {
                  let notetype = barNotes[k][l]
                  if(notetype == '1') {
                    let note = {
                      startTime: firstBeat + j * getBeatLength(i,j) + (k / barNotes.length) * getBeatLength(i,j),
                      timing: getTiming(k, barNotes.length),
                      objectName: 'note',
                      hitSound: null,
                      soundTypes: [],
                      key: l,
                    }
                    beatmap.ACTUALNOTES[i].push(note)
                    beatmap.NUMBERNOTES[i]++
                  } else if(notetype == '2' || notetype == '4') {
                    let note = {
                      startTime: firstBeat + j * getBeatLength(i,j) + (k / barNotes.length) * getBeatLength(i,j),
                      timing: getTiming(k, barNotes.length),
                      objectName: 'longnote',
                      hitSound: null,
                      soundTypes: [],
                      key: l,
                    }
                    beatmap.ACTUALNOTES[i].push(note)
                    beatmap.NUMBERLONGNOTES[i]++
                    pendingLns.push(note)
                  } else if(notetype == '3') {
                    let note = pendingLns.find((ln) => ln.key == l)
                    pendingLns = pendingLns.filter((ln) => ln.key != l)
                    note.endTime = firstBeat + j * getBeatLength(i,j) + (k / barNotes.length) * getBeatLength(i,j)
                  }
                }
            }
            bars.push([parseInt(j), barNotes]);
        }
        beatmap.NOTES[i] = bars;
        beatmap.TOTALTIME[i] = beatmap.ACTUALNOTES[i][beatmap.ACTUALNOTES[i].length - 1].startTime
    }
    
  }*/

  return {
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
  
    return parser.buildBeatmap(content.toString().replace(/\/\/.*$/gm, "").replace(/^[ ]*/gm, "").replace(/[ ]*$/gm, "").split(/[\n\r]+/));
  }
}