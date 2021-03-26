import OsuParser from '../plugins/osu-parser'
import O2jamParser from '../plugins/o2jam-parser'
import BeatmaniaParser from '../plugins/beatmania-parser'
import StepmaniaParser from '../plugins/stepmania-parser'
import * as fflate from 'fflate';

var getFileEntriesFromDirectory = async function(directory) {
  return new Promise((resolve, reject) => {
    directory.createReader().readEntries((entries) => resolve(entries), (e) => reject(e))
  })
}

var readAllFileEntries = async function(fileEntries) {
  let promises = []
  for(let fileEntry of fileEntries) {
    if(fileEntry.isFile) {
      promises.push(readFileEntry(fileEntry))
    }
  }
  return Promise.all(promises)
}

var readFileEntry = async function(fileEntry) {
  return new Promise((resolve, reject) => {
    fileEntry.file((file) => resolve(file), (e) => reject(e))
  })
}

var readFileAsArrayBuffer = async function(file) {
  return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(e.target.result);
      fileReader.onerror = (e) => reject(e.target.error.message);
      fileReader.readAsArrayBuffer(file);
  });
}

/*var readFileAsDataURL = async function(file) {
  return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(e.target.result);
      fileReader.onerror = (e) => reject(e.target.error.message);
      fileReader.readAsArrayBuffer(file);
  });
}*/

var unzipFile = async function(zip) {
  return new Promise((resolve, reject) => {
      fflate.unzip(new Uint8Array(zip), (err, unzipped) => !err ? resolve(unzipped) : reject(err));
  });
}

var processBeatmaniaFolder = async function(files) {
  var difficultyFiles = []
  for(let file of files) {
    if(file.name.match(/\.bms$/i) != null) {
      difficultyFiles.push(file)
    }
  }
  let difficulties = []
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let beatmap = BeatmaniaParser.parseContent(enc.decode(await readFileAsArrayBuffer(difficultyFile)))
    let difficulty = await processDifficulty(files, beatmap)
    if(difficulty)
      difficulties.push(difficulty)
  }
  return difficulties
}


var processO2jamFolder = async function(files) {
  O2jamParser.parseContent(files)
}

var processStepmaniaFolder = async function(files) {
  var difficultyFiles = []
  for(let file of files) {
    if(file.name.match(/\.sm$/i) != null || file.name.match(/\.scc$/i) != null) {
      difficultyFiles.push(file)
    }
  }
  let difficulties = []
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let beatmaps
    try {
    beatmaps = StepmaniaParser.parseContent(enc.decode(await readFileAsArrayBuffer(difficultyFile)))
    } catch(err) {
      console.log(err)
    }
    for(let beatmap of beatmaps) {
      let difficulty = await processDifficulty(files, beatmap)
      if(difficulty)
        difficulties.push(difficulty)
    }
  }
  return difficulties
}

var processOsuFolder = async function(files) {
  var difficultyFiles = []
  for(let file of files) {
    if(file.name.match(/\.osu$/i) != null) {
      difficultyFiles.push(file)
    }
  }
  let difficulties = []
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let beatmap = OsuParser.parseContent(enc.decode(await readFileAsArrayBuffer(difficultyFile)))
    let difficulty = await processDifficulty(files, beatmap)
    if(difficulty)
      difficulties.push(difficulty)
  }
  return difficulties
}

var processDifficulty = async function(files, beatmap) {
    let image
    let hitSounds = {}
    let timeSounds = []
    try {
      for(let hitSoundFilename of beatmap.hitSoundsFilenames) {
        let hitSoundFile = files.find((file) => file.name.toLowerCase() == hitSoundFilename.toLowerCase())
        if(hitSoundFile == null) {
          hitSoundFile = files.find((file) => file.name.substring(0, file.name.length - file.name.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase() == hitSoundFilename.substring(0, hitSoundFilename.length - hitSoundFilename.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase())
        }
        if(hitSoundFile == null) continue
        hitSounds[hitSoundFilename] = 'data:audio/' + hitSoundFile.name.match(/\.([a-zA-Z0-9]+)$/i)[1] + ';base64,' + Buffer.from(await readFileAsArrayBuffer(hitSoundFile)).toString('base64')
      }
      for(let timeSound of beatmap.timeSounds) {
        let timeSoundFile = files.find((file) => file.name.toLowerCase() == timeSound.name.toLowerCase())
        if(timeSoundFile == null) {
          timeSoundFile = files.find((file) => file.name.substring(0, file.name.length - file.name.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase() == timeSound.name.substring(0, timeSound.name.length - timeSound.name.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase())
        }
        if(timeSoundFile == null) continue
        timeSounds.push({ startTime: timeSound.startTime , sound: 'data:audio/' + timeSoundFile.name.match(/\.([a-zA-Z0-9]+)$/i)[1] + ';base64,' + Buffer.from(await readFileAsArrayBuffer(timeSoundFile)).toString('base64') })
      }
      let imageFile = files.find((file) => file.name == beatmap.backgroundFilename)
      if(imageFile != null)
        image = 'data:image/png;base64,' + Buffer.from(await readFileAsArrayBuffer(imageFile)).toString('base64')
      else
        image = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    } catch(err) {
      console.log(err)
      return null
    }
    return { beatmap: beatmap, image: image, hitSounds: hitSounds, timeSounds: timeSounds }
}

var processOsz = async function(file) {
  let zipFile, zipContent
  try {
    zipFile = await readFileAsArrayBuffer(file)
    zipContent = await unzipFile(zipFile)
  } catch(err) {
      throw 'corruptosz'
  }
  let difficultyFiles = []
  for(let filename of Object.keys(zipContent)) {
    if(filename.match(/\.osu$/i) != null) {
      difficultyFiles.push(zipContent[filename])
    }
  }
  let difficulties = []
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let image
    let beatmap = OsuParser.parseContent(enc.decode(difficultyFile))
    let hitSounds = {}
    let timeSounds = []
    try {
      for(let hitSoundFilename of beatmap.hitSoundsFilenames) {
        console.log(hitSoundFilename)
        let hitSoundFile = Object.keys(zipContent).find((filename) => filename == hitSoundFilename)
        if(hitSoundFile == null) {
          hitSoundFile = Object.keys(zipContent).find((filename) => filename.substring(0, filename.length - filename.match(/\.[a-zA-Z0-9]+/)[0].length) == hitSoundFilename.substring(0, hitSoundFilename.length - hitSoundFilename.match(/\.[a-zA-Z0-9]+/)[0].length))
        }
        hitSounds[hitSoundFilename] = 'data:audio/' + hitSoundFile.match(/\.([a-zA-Z0-9]+)$/i)[1] + ';base64,' + Buffer.from(zipContent[hitSoundFile]).toString('base64')
      }
      for(let timeSound of beatmap.timeSounds) {
        let timeSoundFile = Object.keys(zipContent).find((filename) => filename.toLowerCase() == timeSound.name.toLowerCase())
        if(timeSoundFile != null) {
          timeSounds.push({ startTime: timeSound.startTime , sound: 'data:audio/' + timeSoundFile.match(/\.([a-zA-Z0-9]+)$/i)[1] + ';base64,' + Buffer.from(zipContent[timeSoundFile]).toString('base64') })
        }
      }
      if(zipContent[beatmap.backgroundFilename] != null)
        image ='data:image/png;base64,' + Buffer.from(zipContent[beatmap.backgroundFilename]).toString('base64');
    } catch(err) {
      console.log(err)
      continue
    }
    difficulties.push({ beatmap: beatmap, image: image, hitSounds: hitSounds, timeSounds: timeSounds })
  }
  return difficulties
}

export default {
  async parseFiles(items) {
    let files = []
    if(items.length == 0) return files
    if(items[0].isDirectory) {
      let fileEntries = await getFileEntriesFromDirectory(items[0]);
      files = await readAllFileEntries(fileEntries)
    } else {
      files = await readAllFileEntries(items)
    }
    for(let file of files) {
      let extension = file.name.match(/\.([a-zA-Z0-9]+)$/i)[1]
      switch(extension) {
        case 'osz':
          return processOsz(file)
        case 'osu':
          return processOsuFolder(files)
        case 'ojn':
          return processO2jamFolder(files)
        case 'bms':
          return processBeatmaniaFolder(files)
        case 'sm':
        case 'ssc':
          return processStepmaniaFolder(files)
      }
    }
    throw 'invalidformat';
  }
}