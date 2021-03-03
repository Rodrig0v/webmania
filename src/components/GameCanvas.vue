<template>
  <canvas id="gameCanvas"></canvas>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import info from '../models/info';

export default {
  name: 'GameField',
  mounted() {
    addEventListener("keydown", this.processKeyDown)
    addEventListener("keyup", this.processKeyUp)

    this.lightingImages = Array.from({length: info.skins.default.lightingImages.length}, () => new Image())
    for(let i = 0; i < this.lightingImages.length; i++) {
      this.lightingImages[i].src = info.skins.default.lightingImages[i]
    }

    this.receptorImages = Array.from({length: info.skins.default.receptorImages.length}, () => new Image())
    for(let i = 0; i < this.receptorImages.length; i++) {
      this.receptorImages[i].src = info.skins.default.receptorImages[i]
    }

    this.pressedReceptorImages = Array.from({length: info.skins.default.pressedReceptorImages.length}, () => new Image())
    for(let i = 0; i < this.pressedReceptorImages.length; i++) {
      this.pressedReceptorImages[i].src = info.skins.default.pressedReceptorImages[i]
    }

    this.hintImage = new Image()
    this.hintImage.src = info.skins.default.hintImage

    this.judgementImages = Array.from({length: info.skins.default.judgementImages.length}, () => new Image())
    for(let i = 0; i < this.judgementImages.length; i++) {
      this.judgementImages[i].src = info.skins.default.judgementImages[i]
    }

    this.effectImages = Array.from({length: info.skins.default.effectImages.length}, () => new Image())
    for(let i = 0; i < this.effectImages.length; i++) {
      this.effectImages[i].src = info.skins.default.effectImages[i]
    }

    this.noteImages = Array.from({length: info.skins.default.noteImages.length}, () => new Image());
    for(let i = 0; i < this.noteImages.length; i++) {
      this.noteImages[i].src = info.skins.default.noteImages[i]
    }

    this.hitPosition = info.skins.default.hitPosition

    this.judgementWindows = info.judgementWindows

    this.start()
  },
  data() {
    return {
      width: 600,
      height: 1080,
      hitPosition: null,
      canvas: null,
      context: null,
      interval: null,
      addNotesInterval: null,
      hintImage: null,
      lightingImage: null,
      judgementImages: null,
      judgementTime: 400,
      effectImages: null,
      effectTime: 300,
      lastJudgement: null,
      lastHitId: 0,
      lastHitTime: 0,
      keysDown: [false, false, false, false, false, false, false],
      onGoingEffects: [],
      notes: [[],[],[],[],[],[],[]],
      lastNoteAddedTime: 0,
      judgementWindows: null
    }
  },
  computed: mapGetters([
    'currentKeys',
    'keyMode',
    'effectsOn',
    'bpm',
    'scrollSpeed',
    'fps'
  ]),
  methods: {
    ...mapActions([
      'toggleShift',
      'processKeyTap',
      'breakCombo'
    ]),
    tintImage(imgElement,tintColor) {
        // create hidden canvas (using image dimensions)
        var canvas = document.createElement("canvas");
        canvas.width = imgElement.offsetWidth;
        canvas.height = imgElement.offsetHeight;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(imgElement,0,0);

        var map = ctx.getImageData(0,0,320,240);
        var imdata = map.data;

        // convert image to grayscale
        var r,g,b,avg;
        for(var p = 0, len = imdata.length; p < len; p+=4) {
            r = imdata[p]
            g = imdata[p+1];
            b = imdata[p+2];
            
            avg = Math.floor((r+g+b)/3);

            imdata[p] = imdata[p+1] = imdata[p+2] = avg;
        }

        ctx.putImageData(map,0,0);

        // overlay filled rectangle using lighter composition
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle=tintColor;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // replace image source with canvas data
        imgElement.src = canvas.toDataURL()
    },
    hasKey(eventKey) {
      for(let keyConfig of this.currentKeys) {
        if(eventKey.toLowerCase() == keyConfig.keyBind.toLowerCase()) {
          return keyConfig.id;
        }
      }
      return null;
    },
    processKeyDown(event) {
      if(!event.repeat) {
        if (event.key == 'Shift') {
          this.toggleShift({ value: true })
        }
        let now = Date.now();
        let id = this.hasKey(event.key)
        if(id != null) {
          this.keysDown[id] = true
          let difference = this.notes[id].length > 0 ? Math.abs(this.notes[id][0].time - now) : Number.POSITIVE_INFINITY
          if(difference < this.judgementWindows[5]) {
            this.notes[id].shift()
            this.lastHitTime = now
            this.lastJudgement = this.getJudgement(difference)
            if(this.lastJudgement == 5) {
              this.breakCombo()
            } else {
              this.onGoingEffects.push({ id: id, time: Date.now() })
              this.processKeyTap({ amount: 1 })
            }
          }
        }
      }
    },
    processKeyUp(event) {
      if (event.key == 'Shift') {
        this.toggleShift({ value: false })
      }
      let id = this.hasKey(event.key)
        if (id != null) {
        this.keysDown[id] = false
      }
      
    },
    start() {
      this.canvas = document.getElementById("gameCanvas")
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.context = this.canvas.getContext("2d")
      //this.context.globalCompositeOperation = "screen"
      this.addNotes(Date.now(), 30000)
      this.addNotesInterval = setInterval(() => this.addNotes(this.lastNoteAddedTime, 1000), 1000)
      this.interval = setInterval(this.updateCanvas, 1 / this.fps)
      this.canvas.addEventListener("bpmChanged", this.processBpmChange)
      this.canvas.addEventListener("fpsChanged", this.processFpsChange)
      this.canvas.addEventListener("makeFullscreen", this.processFullScreen)
    },
    updateCanvas() {
      this.checkMisses()
      this.clear()
      this.drawHint()
      this.drawLighting()
      this.drawNotes()
      this.drawJudgement()
      this.drawReceptors()
      if(this.effectsOn)
        this.drawEffects()
    },
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    drawHint() {
      this.context.drawImage(
          this.hintImage,
          0,
          this.canvas.height - this.hitPosition - 64,
          this.canvas.width,
          128)
    },
    drawLighting() {
      for(let keyConfig of this.currentKeys) {
        if (this.keysDown[keyConfig.id]) {
          this.context.drawImage(this.lightingImages[keyConfig.id], (this.canvas.width / 7) * keyConfig.id, this.canvas.height - 640 - this.hitPosition, (this.canvas.width / 7), 640)
        }
      }
    },
    drawJudgement() {
      let difference = Date.now() - this.lastHitTime
      let multiplier = 0.12;
      if(difference < this.judgementTime) {
        let judgeHeight = Math.max(this.width * multiplier * 1.5 - difference / (this.judgementTime / 2) * (this.width * multiplier * 1.5 - this.width * multiplier), this.width * multiplier)
        let judgeWidth = judgeHeight * (188 / 91)
        this.context.drawImage(
          this.judgementImages[this.lastJudgement],
          (this.canvas.width / 2) - (judgeWidth / 2),
          this.canvas.height * 0.6 - (judgeHeight / 2),
          judgeWidth,
          judgeHeight)
      }
    },
    drawEffects() {
      let now = Date.now();
      let multiplier = 0.38
      this.context.globalCompositeOperation = 'screen';
      this.removeOldItems(this.onGoingEffects, this.effectTime, () => {} )
      for(let hitEffect of this.onGoingEffects) {
        let difference = now - hitEffect.time
        let index = Math.floor((difference / this.effectTime) * this.effectImages.length )
        this.context.drawImage(
          this.effectImages[index],
          hitEffect.id * (this.canvas.width / 7) + (this.canvas.width / 14) - this.canvas.width * multiplier,
          this.canvas.height - this.hitPosition - this.canvas.width * multiplier,
          this.canvas.width * multiplier * 2,
          this.canvas.width * multiplier * 2)
      }
      this.context.globalCompositeOperation = 'source-over';
    },
    drawReceptors() {
      for(let keyConfig of this.currentKeys) {
        if (this.keysDown[keyConfig.id]) {
          this.context.drawImage(this.pressedReceptorImages[keyConfig.id], (this.canvas.width / 7) * keyConfig.id, this.canvas.height - this.hitPosition + 5, (this.canvas.width / 7), this.hitPosition - 5)
        } else {
          this.context.drawImage(this.receptorImages[keyConfig.id], (this.canvas.width / 7) * keyConfig.id, this.canvas.height - this.hitPosition + 5, (this.canvas.width / 7), this.hitPosition - 5)
        }
      }
    },
    drawNotes() {
      let now = Date.now();
      let playableHeight = this.canvas.height - this.hitPosition
      let offset = playableHeight / (this.scrollSpeed / 15) //miliseconds that will appear on screen
      let noteWidth = this.canvas.width / 7
      let noteHeight = noteWidth * (82 / 256)
      for(let column = 0; column < this.notes.length; column++) {
        for(let i = 0; i < this.notes[column].length; i++) {
          let difference = this.notes[column][i].time - now
          if(difference < offset) {
            this.context.drawImage(
              this.noteImages[column],
              (noteWidth * column),
              playableHeight - (difference * playableHeight / offset) - (noteHeight / 2), //height
              noteWidth,
              noteHeight,
            )
          } else {
            break
          }
        }
      }
    },
    removeOldItems(array, interval, onRemove) {
      let now = Date.now()
      for(let i = 0; i < array.length; i++) {
        if(now - array[i].time >= interval) {
          onRemove(array.shift())
          i--
        } else {
          break
        }
      }
    },
    addNotes(init, offset) {
      for(let i = init + (60000 / (this.bpm * 4)); i < init + offset; i += (60000 / (this.bpm * 4)) ) {
        let column = Math.floor((Math.random() * 7))
        this.notes[column].push({ time: i })
        this.lastNoteAddedTime = i
      }
    },
    checkMisses() {
      for(let column of this.notes) {
        this.removeOldItems(column, this.judgementWindows[5], () => {
          this.lastHitTime = Date.now()
          this.lastJudgement = 5
          this.breakCombo()
        })
      }
    },
    getJudgement(difference) {
      for(let i = 0; i < this.judgementWindows.length; i++) {
        if(difference < this.judgementWindows[i]) {
          return i;
        }
      }
      return 5;
    },
    processBpmChange() {
      this.notes = [[],[],[],[],[],[],[]]
      this.addNotes(Date.now(), 30000)
    },
    processFpsChange() {
      clearInterval(this.interval)
      console.log(this.fps)
      this.interval = setInterval(this.updateCanvas, 1000 / this.fps)
    },
    processFullScreen() {
      this.canvas.webkitRequestFullScreen()
    }
  },
  destroyed () {
    removeEventListener("keydown", this.processKeyDown);
    removeEventListener("keyup", this.processKeyUp);
    this.canvas.removeEventListener("bpmChanged", this.processBpmChange)
    this.canvas.removeEventListener("fpsChanged", this.processFpsChange)
    this.canvas.removeEventListener("makeFullscreen", this.processFullScreen)

    clearInterval(this.interval)
  }
}
</script>

<style>
#gameCanvas {
    position: absolute;
    width: 450px;
    height: 800px;
}
</style>