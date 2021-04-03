import OsuParser from '../plugins/osu-parser'
import OJNParser from '../plugins/ojn-parser'
import OJMParser from '../plugins/ojm-parser'
import BeatmaniaParser from '../plugins/beatmania-parser'
import StepmaniaParser from '../plugins/stepmania-parser'
import * as fflate from 'fflate';

var findFile = function(fileName, files) {
  let folder = files
  let actualFileName = fileName
  let path = fileName.split('\\')
  if(path.length == 1)
    path = fileName.split('/')
  if(path.length > 1) {
    for(let i = 0; i < path.length - 1; i++) {
      folder = folder.find((file) => file.name.toLowerCase() == path[i].toLowerCase()).files
    }
    actualFileName = path[path.length - 1]
  }
  let file = folder.find((file) => file.name.toLowerCase() == actualFileName.toLowerCase())
  if(file != null) return file
  // try another file with same name but different extension
  return folder.find(
    (file) =>
    file.name.match(/\.[a-zA-Z0-9]+/) != null && actualFileName.match(/\.[a-zA-Z0-9]+/) != null
      ?
        file.name.substring(0, file.name.length - file.name.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase()
        ==
        actualFileName.substring(0, actualFileName.length - actualFileName.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase()
      :
      false
  )
}

var findFileInZip = function(fileName, zipContent) {
  let folder = zipContent
  let actualFileName = fileName
  let path = fileName.split('\\')
  if(path.length == 1)
    path = fileName.split('/')
  if(path.length > 1) {
    for(let i = 0; i < path.length - 1; i++) {
      folder = folder[path[i]]
    }
    actualFileName = path[path.length - 1]
  }
  let file = Object.keys(folder).find((filename) => filename == actualFileName)
  if(file != null) return file
  // try another file with same name but different extension
  return Object.keys(folder).find(
    (filename) =>
    filename.match(/\.[a-zA-Z0-9]+/) != null && actualFileName.match(/\.[a-zA-Z0-9]+/) != null
      ?
        file.name.substring(0, filename.length - filename.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase()
        ==
        actualFileName.substring(0, actualFileName.length - actualFileName.match(/\.[a-zA-Z0-9]+/)[0].length).toLowerCase()
      :
      false
  )
}

var getFileEntriesFromDirectory = async function(directory) {
  var dirReader = directory.createReader();
  var allEntries = [];
  var numEntries = -1
  
  while(numEntries != allEntries.length) {
    numEntries = allEntries.length
    allEntries = allEntries.concat(await readDirectory(dirReader))
  }

  return allEntries;
}

var readDirectory = async function(reader) {
  return new Promise((resolve, reject) => {
    reader.readEntries((entries) => resolve(entries), (e) => reject(e))
  })
}

var readAllFileEntries = async function(fileEntries) {
  let files = []
  for(let fileEntry of fileEntries) {
    if(fileEntry.isFile) {
      files.push(await readFileEntry(fileEntry))
    } else if(fileEntry.isDirectory) {
      let fileEntries = await getFileEntriesFromDirectory(fileEntry);
      files.push({ name: fileEntry.name, files: await readAllFileEntries(fileEntries) })
    }
  }
  return files
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

var unzipFile = async function(zip) {
  return new Promise((resolve, reject) => {
      fflate.unzip(new Uint8Array(zip), (err, unzipped) => !err ? resolve(unzipped) : reject(err));
  });
}

var processBeatmaniaFolder = async function(files) {
  var difficultyFiles = []
  for(let file of files) {
    if(file.name.match(/\.bms$/i) != null || file.name.match(/\.bme$/i) != null || file.name.match(/\.bml$/i) != null || file.name.match(/\.pms$/i) != null) {
      difficultyFiles.push(file)
    }
  }
  let difficulties = []
  let hitSounds = {}
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let beatmap = BeatmaniaParser.parseContent(enc.decode(await readFileAsArrayBuffer(difficultyFile)), difficultyFile.name.match(/\.([a-zA-Z0-9]+)$/i)[1])
    if(beatmap == null) continue
    let difficulty = await processDifficulty(files, beatmap, hitSounds)
    if(difficulty)
      difficulties.push(difficulty)
  }
  return difficulties
}

var processStepmaniaFolder = async function(files) {
  var difficultyFiles = []
  for(let file of files) {
    if(file.name.match(/\.sm$/i) != null || file.name.match(/\.ssc$/i) != null) {
      difficultyFiles.push(file)
    }
  }
  let difficulties = []
  let hitSounds = {}
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let beatmaps
    try {
    beatmaps = StepmaniaParser.parseContent(enc.decode(await readFileAsArrayBuffer(difficultyFile)))
    } catch(err) {
      console.log(err)
    }
    for(let beatmap of beatmaps) {
      let difficulty = await processDifficulty(files, beatmap, hitSounds)
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
  let hitSounds = {}
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let beatmap = OsuParser.parseContent(enc.decode(await readFileAsArrayBuffer(difficultyFile)))
    if(beatmap == null) continue
    let difficulty = await processDifficulty(files, beatmap, hitSounds)
    if(difficulty)
      difficulties.push(difficulty)
  }
  return difficulties
}

var processDifficulty = async function(files, beatmap, hitSounds) {
    let image
    try {
      let promises = []
      for(let hitSoundFilename of beatmap.hitSoundsFilenames) {
        if(hitSounds[hitSoundFilename]) continue
        promises.push(new Promise((resolve) => {
          let hitSoundFile = findFile(hitSoundFilename, files)
          if(hitSoundFile != null)
            readFileAsArrayBuffer(hitSoundFile).then((value) => {
              hitSounds[hitSoundFilename] = 'data:audio/' + hitSoundFile.name.match(/\.([a-zA-Z0-9]+)$/i)[1] + ';base64,' + Buffer.from(value).toString('base64')
            })
            resolve()
        }))
      }
      await Promise.all(promises)
      let imageFile = await findFile(beatmap.backgroundFilename, files)
      if(imageFile != null)
        image = 'data:image/png;base64,' + Buffer.from(await readFileAsArrayBuffer(imageFile)).toString('base64')
    } catch(err) {
      console.log(err)
      return null
    }
    return { beatmap: beatmap, image: image, hitSounds: hitSounds, starRating: 0 }
}

var processO2jamFolder = async function(files) {
  let ojnFile
  let ojmFile
  for(let file of files) {
    if(file.name.match(/\.ojn$/i) != null) {
      ojnFile = file
    }
    if(file.name.match(/\.ojm$/i) != null) {
      ojmFile = file
    }
  }
  let hitSounds = OJMParser.parseContent(await readFileAsArrayBuffer(ojmFile))
  let difficulties = OJNParser.parseContent(await readFileAsArrayBuffer(ojnFile), hitSounds)
  return difficulties
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
  let hitSounds = {}
  var enc = new TextDecoder('utf-8');
  for(var difficultyFile of difficultyFiles) {
    let image
    let beatmap = OsuParser.parseContent(enc.decode(difficultyFile))
    if(beatmap == null) continue
    try {
      let promises = []
      for(let hitSoundFilename of beatmap.hitSoundsFilenames) {
        if(hitSounds[hitSoundFilename]) continue
        promises.push(new Promise((resolve) => {
          let hitSoundFile = findFileInZip(hitSoundFilename, zipContent)
          if(hitSoundFile != null)
            hitSounds[hitSoundFilename] = 'data:audio/' + hitSoundFile.match(/\.([a-zA-Z0-9]+)$/i)[1] + ';base64,' + Buffer.from(zipContent[hitSoundFile]).toString('base64')
          resolve()
        }))
      }
      await Promise.all(promises)
      let imageFile = await findFileInZip(beatmap.backgroundFilename, zipContent)
      if(imageFile != null)
        image ='data:image/png;base64,' + Buffer.from(zipContent[imageFile]).toString('base64');
    } catch(err) {
      console.log(err)
      continue
    }
    difficulties.push({ beatmap: beatmap, image: image, hitSounds: hitSounds, starRating: 0 })
  }
  return difficulties
}

export default {
  async parseFiles(items) {
    let files = []
    if(items.length == 0) return files
    if(items.length == 1 && items[0].isDirectory) {
      let fileEntries = await getFileEntriesFromDirectory(items[0]);
      files = await readAllFileEntries(fileEntries)
    } else {
      files = await readAllFileEntries(items)
    }
    for(let file of files) {
      let extension = file.name.match(/\.([a-zA-Z0-9]+)$/i)
      if(extension == null) continue
      switch(extension[1]) {
        case 'osz':
          return processOsz(file)
        case 'osu':
          return processOsuFolder(files)
        case 'ojn':
          return processO2jamFolder(files)
        case 'bms':
        case 'bme':
        case 'bml':
        case 'pms':
          return processBeatmaniaFolder(files)
        case 'sm':
        case 'ssc':
          return processStepmaniaFolder(files)
      }
    }
    throw 'invalidformat';
  }
}