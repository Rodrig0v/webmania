'use strict';

function beatmapParser() {
  var beatmap = {
    timingPoints: [],
    timingPointsLines: [],
  }
  
  var tags = {
    chart: {
        sm: ["STEPSTYPE", "DESCRIPTION", "DIFFICULTY", "METER", "RADARVALUES", "NOTES"],
        ssc: ["CHARTNAME", "CHARTSTYLE", "CREDIT", "DESCRIPTION", "DIFFICULTY", "DISPLAYBPM", "METER", "NOTEDATA", "NOTES", "RADARVALUES", "STEPSTYPE"],
      },
      list: ["ATTACKS", "BGCHANGES", "BPMS", "COMBOS", "DELAYS", "FAKES", "FGCHANGES", "KEYSOUNDS", "LABELS", "SCROLLS", "SPEEDS", "STOPS", "TICKCOUNTS", "TIMESIGNATURES", "WARPS"]
  };

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
  };

  var processTimingPoints = function () {
    let currentBPM = beatmap.timingPointsLines[0].bpm
    let currentBeat = 0
    let currentTime = - Number(beatmap.OFFSET) * 1000
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
        time += timing.time
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

  var buildBeatmap = function(str, opts) {
    if (!opts) opts = {};
    let lines = str.replace(/\/\/.*$/gm, "").replace(/;/gm, "").split("#");
    for (let i in lines) {
        let parts = lines[i].trim().split(":");
        parts = [parts.shift(), parts.join(":")];
        let tag = parts.splice(0, 1)[0].replace(/;$/, "");
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

    for(let bpm of beatmap.BPMS) {
      beatmap.timingPointsLines.push({ beat: Number(bpm[0]), bpm: Number(bpm[1])})
    }
    for(let stop of beatmap.STOPS) {
      beatmap.timingPointsLines.push({ beat: Number(stop[0]), time: Number(stop[1]) * 1000})
    }
    
    beatmap.timingPointsLines.sort((a,b) => a.beat == b.beat ? a.time ? 1 : -1 : a.beat - b.beat)
    processTimingPoints()

    beatmap.NUMBERLONGNOTES = []
    beatmap.NUMBERNOTES = []
    beatmap.TOTALTIME = []
    beatmap.ACTUALNOTES = []
    for (let i in beatmap.NOTES) {
        beatmap.NUMBERLONGNOTES[i] = 0
        beatmap.NUMBERNOTES[i] = 0
        beatmap.ACTUALNOTES[i] = []
        beatmap.RADARVALUES[i] = beatmap.RADARVALUES[i].split(",");
        let notes = beatmap.NOTES[i].trim().split(/,\s*/);
        let bars = [];
        let pendingLns = [];
        for (let j in notes) {
            let barNotes = notes[j].trim().replace(/\s+/gm, " ").split(/\s+/);
            for (let k in barNotes) {
                barNotes[k] = barNotes[k].split("");
                let measure = Number(j)
                let beat = Number(k)
                let barDivision = barNotes.length
                let currentBeat = (measure + beat / barDivision) * 4
                let currentTime = getTime(currentBeat)
                let currentTiming = getTiming(beat, barDivision)
                for(let l = 0; l < barNotes[k].length; l++) {
                  let lane = l
                  let notetype = barNotes[beat][lane]
                  if(notetype == '1') {
                    let note = {
                      startTime: currentTime,
                      timing: currentTiming,
                      objectName: 'note',
                      hitSound: null,
                      soundTypes: [],
                      key: lane,
                    }
                    beatmap.ACTUALNOTES[i].push(note)
                    beatmap.NUMBERNOTES[i]++
                  } else if(notetype == '2' || notetype == '4') {
                    let note = {
                      startTime: currentTime,
                      timing: currentTiming,
                      objectName: 'longnote',
                      hitSound: null,
                      soundTypes: [],
                      key: lane,
                    }
                    beatmap.ACTUALNOTES[i].push(note)
                    beatmap.NUMBERLONGNOTES[i]++
                    pendingLns.push(note)
                  } else if(notetype == '3') {
                    let note = pendingLns.find((ln) => ln.key == lane)
                    pendingLns = pendingLns.filter((ln) => ln.key != lane)
                    note.endTime = currentTime
                  }
                }
            }
            bars.push([parseInt(j), barNotes]);
        }
        beatmap.NOTES[i] = bars;
        beatmap.TOTALTIME[i] = beatmap.ACTUALNOTES[i][beatmap.ACTUALNOTES[i].length - 1].endTime ? beatmap.ACTUALNOTES[i][beatmap.ACTUALNOTES[i].length - 1].endTime : beatmap.ACTUALNOTES[i][beatmap.ACTUALNOTES[i].length - 1].startTime
    }
    let returnvalue = []
    for(let i in beatmap.NOTES) {
      returnvalue.push(
        {
          artist: beatmap.ARTIST,
          title: beatmap.TITLE,
          length: beatmap.TOTALTIME[i] / 1000,
          difficultyName: beatmap.CHARTNAME[i] == null || beatmap.CHARTNAME[i] == '' ? beatmap.METER[i] : beatmap.CHARTNAME[i],
          bpm: beatmap.BPMS[0][1],
          timingWindows: 8,
          keys: sizes[beatmap.STEPSTYPE[i]],
          numberNotes: beatmap.NUMBERNOTES[i],
          numberLongnotes: beatmap.NUMBERLONGNOTES[i],
          backgroundFilename: beatmap.BACKGROUND == '' ? 'BG.png' : beatmap.BACKGROUND,
          notes: beatmap.ACTUALNOTES[i],
          hitSoundsFilenames: [beatmap.MUSIC],
          timeSounds: [{ startTime: 0, name: beatmap.MUSIC}],
          offset: 0,
        }
      )
    }

    return returnvalue
  }

  return {
    buildBeatmap: buildBeatmap
  };
}

export default {
  /**
   * Parse the content of a .sm file
   * @param  {String|Buffer} content
   * @return {Object} beatmap
   */
  parseContent (content) {
    var parser = beatmapParser();
  
    return parser.buildBeatmap(content);
  }
}