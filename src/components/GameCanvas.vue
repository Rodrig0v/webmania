<template>
  <v-main>
    <div id="canvasWrapper">
      <canvas id="gameCanvas"></canvas>
    </div>
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import info from '../models/info';
import Queue from 'denque';
import { Howl } from 'howler';

export default {
  name: 'GameField',
  mounted() {
    addEventListener("keydown", this.processKeyDown)
    addEventListener("keyup", this.processKeyUp)

    this.loadKeyMode()

    this.loadSkin()

    this.sound = new Howl({
      src: [require('@/assets/sound/cyber-loop.ogg')],
      loop: true,
      volume: this.volume,
      rate: this.bpm / 191,
    });

    this.start()
  },
  data() {
    return {
      addNotesInterval: null,
      canvas: null,
      context: null,
      effectImages: null,
      effectTime: 300,
      hintImage: null,
      interval: null,
      judgementImages: null,
      judgementTime: 400,
      keysDown: null,
      lastColumns: [],
      lastFps: new Queue(),
      lastHitId: 0,
      lastHitTime: 0,
      lastJudgement: null,
      lastNoteAddedTime: 0,
      lightingImage: null,
      notes: null,
      onGoingEffects: new Queue(),
      pattern: [2,1],
      patternIndex: 0
    }
  },
  computed: mapGetters([
    'bpm',
    'columnSize',
    'combo',
    'comboPosition',
    'comboSize',
    'currentKeys',
    'effectSize',
    'fps',
    'hitPosition',
    'judgementPosition',
    'judgementSize',
    'keyMode',
    'od',
    'scrollSpeed',
    'showFps',
    'skin',
    'soundOn',
    'volume'
  ]),
  methods: {
    ...mapActions([
      'breakCombo',
      'processKeyTap',
      'toggleShift'
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
    hasKey(keyCode) {
      for(let i = 0; i < this.currentKeys.length; i++) {
        if(keyCode == this.currentKeys[i].code) {
          return i;
        }
      }
      return null;
    },
    processKeyDown(event) {
      if(!event.repeat) {
        if (event.char == 'Shift') {
          this.toggleShift({ value: true })
        }
        let now = Date.now();
        let id = this.hasKey(event.code)
        if(id != null) {
          this.keysDown[id] = true
          let difference = this.notes[id].length > 0 ? Math.abs(this.notes[id].peekFront().time - now) : Number.POSITIVE_INFINITY
          if(difference < info.judgementWindows[this.od][info.judgementWindows[this.od].length - 1]) {
            this.notes[id].shift()
            this.lastHitTime = now
            this.lastJudgement = this.getJudgement(difference)
            if(this.lastJudgement == 5) {
              this.breakCombo()
            } else {
              this.onGoingEffects.push({ id: id, time: Date.now() })
              this.processKeyTap({ value: 1 })
            }
          }
        }
      }
    },
    processKeyUp(event) {
      if (event.code == 'Shift') {
        this.toggleShift({ value: false })
      }
      let id = this.hasKey(event.code)
        if (id != null) {
        this.keysDown[id] = false
      }
      
    },
    start() {
      this.canvas = document.getElementById("gameCanvas")
      this.processResize()
      this.context = this.canvas.getContext("2d")
      //this.context.globalCompositeOperation = "screen"
      this.addNotes()
      this.addNotesInterval = setInterval(() => this.addNotes(), 1000.0)
      this.interval = setInterval(this.updateCanvas, 1000.0 / this.fps)
      window.addEventListener("resize", this.processResize)
      this.canvas.addEventListener("bpmChanged", this.processBpmChange)
      this.canvas.addEventListener("fpsChanged", this.processFpsChange)
      this.canvas.addEventListener("keyModeChanged", this.processKeyModeChange)
      this.canvas.addEventListener("skinChanged", this.processSkinChange)
      this.canvas.addEventListener("makeFullscreen", this.processFullScreen)
      this.canvas.addEventListener("volumeChanged", this.processVolumeChange)
      this.canvas.addEventListener("soundChanged", this.processSoundChange)
      this.canvas.addEventListener("resetGame", this.processReset)
      if(this.soundOn) {
        this.sound.play()
      }
    },
    updateCanvas() {
      this.checkMisses()
      this.clear()
      this.drawHint()
      this.drawLighting()
      this.drawNotes()
      this.drawCombo()
      this.drawJudgement()
      this.drawReceptors()
      this.drawEffects()
      if(this.showFps)
        this.drawFps()
    },
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    drawHint() {
      this.context.drawImage(
          this.hintImage,
          (this.canvas.width - (this.canvas.width * this.columnSize * this.keyMode)) / 2 ,
          this.canvas.height - (this.hitPosition * this.canvas.height) - (this.hintImage.height / 2),
          this.canvas.width * this.columnSize * this.keyMode,
          this.hintImage.height)
    },
    drawLighting() {
      for(let i = 0; i < this.currentKeys.length ; i++) {
        if (this.keysDown[i]) {
          this.context.drawImage(this.lightingImages[i], ((this.canvas.width - (this.columnSize * this.canvas.width * this.keyMode)) / 2) + (this.columnSize * this.canvas.width * i), this.canvas.height - 640 - (this.hitPosition * this.canvas.height), this.columnSize * this.canvas.width, 640)
        }
      }
    },
    drawCombo() {
      if(this.combo == 0) return
      var comboString = this.combo.toString()
      var comboHeight = this.comboSize * this.canvas.height
      for(let i = 0; i < comboString.length; i++) {
        var comboWidth = comboHeight * this.comboImages[comboString[i]].width / this.comboImages[comboString[i]].height
        this.context.drawImage(
          this.comboImages[comboString[i]],
          (this.canvas.width / 2) - (comboWidth * comboString.length / 2) + (comboWidth * i),
          this.canvas.height - (this.comboPosition * this.canvas.height) - (comboHeight / 2),
          comboWidth,
          comboHeight) //TODO
      }
    },
    drawJudgement() {
      let difference = Date.now() - this.lastHitTime
      if(difference < this.judgementTime) {
        let judgementHeight = Math.max(this.canvas.height * this.judgementSize * 1.5 - difference / (this.judgementTime / 2) * (this.canvas.height * this.judgementSize * 1.5 - this.canvas.height * this.judgementSize), this.canvas.height * this.judgementSize)
        let judgementWidth = judgementHeight * this.judgementImages[this.lastJudgement].width / this.judgementImages[this.lastJudgement].height
        this.context.drawImage(
          this.judgementImages[this.lastJudgement],
          (this.canvas.width / 2) - (judgementWidth / 2),
          this.canvas.height - (this.judgementPosition * this.canvas.height) - (judgementHeight / 2),
          judgementWidth,
          judgementHeight)
      }
    },
    drawEffects() {
      let now = Date.now();
      this.context.globalCompositeOperation = 'screen';
      this.removeOldItems(this.onGoingEffects, this.effectTime, () => {} )
      for(let i = 0; i < this.onGoingEffects.length; i++) {
        let difference = now - this.onGoingEffects.peekAt(i).time
        let index = Math.floor((difference / this.effectTime) * this.effectImages.length )
        this.context.drawImage(
          this.effectImages[index],
          this.onGoingEffects.peekAt(i).id * (this.canvas.width * this.columnSize) + (this.canvas.width * this.columnSize / 2) - this.canvas.width * this.effectSize + ((this.canvas.width - (this.canvas.width * this.columnSize * this.keyMode)) / 2),
          this.canvas.height - (this.hitPosition * this.canvas.height) - this.canvas.width * this.effectSize,
          this.canvas.width * this.effectSize * 2,
          this.canvas.width * this.effectSize * 2)
      }
      this.context.globalCompositeOperation = 'source-over';
    },
    drawReceptors() {
      for(let i = 0; i < this.currentKeys.length ; i++) {
        let receptorWidth = this.columnSize * this.canvas.width
        let receptorHeight =  receptorWidth * this.pressedReceptorImages[i].height / this.pressedReceptorImages[i].width
        if (this.keysDown[i]) {
          this.context.drawImage(
            this.pressedReceptorImages[i],
            ((this.canvas.width - (receptorWidth * this.keyMode)) / 2) + (receptorWidth * i),
            this.canvas.height - (this.hitPosition * this.canvas.height) - (receptorHeight / 2),
            receptorWidth,
            receptorHeight
          )
        } else {
          this.context.drawImage(
            this.receptorImages[i],
            ((this.canvas.width - (receptorWidth * this.keyMode)) / 2) + (receptorWidth * i),
            this.canvas.height - (this.hitPosition * this.canvas.height) - (receptorHeight / 2),
            receptorWidth,
            receptorHeight
          )
        }
      }
    },
    drawNotes() {
      let now = Date.now();
      let playableHeight = this.canvas.height - (this.hitPosition * this.canvas.height)
      let offset = this.scrollSpeed //miliseconds that will appear on screen
      let noteWidth = this.columnSize * this.canvas.width
      for(let column = 0; column < this.notes.length; column++) {
        for(let i = 0; i < this.notes[column].length; i++) {
          let difference = this.notes[column].peekAt(i).time - now
          if(difference < offset) {
            let noteHeight = noteWidth * this.noteImages[column].height / this.noteImages[column].width
            this.context.drawImage(
              this.noteImages[column],
              ((this.canvas.width - (noteWidth * this.keyMode)) / 2) + (noteWidth * column),
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
    drawFps() {
      this.lastFps.push(Date.now())
      if(this.lastFps.length == 1) {
        return
      }
      this.context.font = "30px Arial";
      this.context.fillStyle = "red";
      this.context.textAlign = "bottom";
      this.context.fillText((1000.0 * this.lastFps.length / (this.lastFps.peekBack() - this.lastFps.peekFront())).toFixed(0), this.canvas.width - 60, this.canvas.height)
      if(this.lastFps.length > 100) {
        this.lastFps.shift()
      }
    },
    removeOldItems(queue, interval, onRemove) {
      let now = Date.now()
      while(queue.peekFront() != null && now - queue.peekFront().time >= interval) {
        onRemove(queue.shift())
      }
    },
    addNotes() {
      let now = Date.now()
      let init = this.lastNoteAddedTime
      let offset = now - this.lastNoteAddedTime + 30000
      if(offset > 30000) {
        init = Date.now()
        offset = 30000
      }
      for(let i = init + (60000 / (this.bpm * 4)); i < init + offset; i += (60000 / (this.bpm * 4)) ) {
        if(this.keyMode == 1 < 3 || this.lastColumns == null) {
          this.lastColumns = []
          let column = Math.floor((Math.random() * this.keyMode))
          this.notes[column].push({ time: i })
          this.lastNoteAddedTime = i
          this.lastColumns.push(column)
        } else if(this.keyMode == 4) {
          let availableNumbers = Array.from(Array(this.keyMode).keys()).filter((i) => !this.lastColumns.includes(i))
          if(this.patternIndex == 1)
            this.lastColumns = []
          for(let j = 0; j < this.pattern[this.patternIndex]; j++) {
            let column = Math.floor(Math.random() * availableNumbers.length)
            this.notes[availableNumbers[column]].push({ time: i })
            this.lastNoteAddedTime = i
            this.lastColumns.push(availableNumbers[column])
            availableNumbers.splice(column, 1)
          }
          this.patternIndex = (this.patternIndex + 1) % this.pattern.length
        } else {
          let availableNumbers = Array.from(Array(this.keyMode).keys()).filter((i) => !this.lastColumns.includes(i))
          this.lastColumns = []
          let column = Math.floor(Math.random() * availableNumbers.length)
          this.notes[availableNumbers[column]].push({ time: i })
          this.lastNoteAddedTime = i
          this.lastColumns.push(availableNumbers[column])
        }
      }
    },
    checkMisses() {
      for(let column of this.notes) {
        this.removeOldItems(column, info.judgementWindows[this.od][info.judgementWindows[this.od].length - 1], () => {
          this.lastHitTime = Date.now()
          this.lastJudgement = 5
          this.breakCombo()
        })
      }
    },
    getJudgement(difference) {
      for(let i = 0; i < info.judgementWindows[this.od].length; i++) {
        if(difference < info.judgementWindows[this.od][i]) {
          return i;
        }
      }
      return 5;
    },
    clearNotes() {
      for(var queue of this.notes) {
        queue.clear()
      }
    },
    processBpmChange() {
      this.clearNotes()
      this.lastNoteAddedTime = 0
      this.lastColumns = null
      this.sound.rate(this.bpm / 191)
      this.addNotes()
    },
    processFpsChange() {
      clearInterval(this.interval)
      this.interval = setInterval(this.updateCanvas, 1000.0 / this.fps)
      this.lastFps.clear()
    },
    processSkinChange() {
      this.loadSkin()
    },
    processKeyModeChange() {
      this.loadKeyMode()
      this.processSkinChange()
      this.processBpmChange()
    },
    processFullScreen() {
      if(this.canvas.webkitRequestFullScreen) {
        this.canvas.webkitRequestFullScreen()
      } else {
        this.canvas.requestFullscreen()
      }
    },
    processSoundChange() {
      if(this.soundOn) {
        this.sound.play()
      } else {
        this.sound.stop()
      }
    },
    processVolumeChange() {
      this.sound.volume(this.volume)
    },
    processReset() {
      this.processSkinChange()
      this.processKeyModeChange()
      this.processFpsChange()
      this.processVolumeChange()
      this.processSoundChange()
    },
    processResize() {
      var screenWidth = window.screen.width
      var screenHeight = window.screen.height
      var width = window.innerWidth
      var height = document.fullscreenElement ? window.innerHeight : window.innerHeight - document.getElementById('header').offsetHeight - document.getElementById('footer').offsetHeight
      var screenScale = screenWidth / screenHeight
      var scale = width / height
      var canvasWrapper = document.getElementById('canvasWrapper')
      canvasWrapper.style.width = Math.round(width) + 'px'
      canvasWrapper.style.height = Math.round(height) + 'px'

      if ( screenScale > scale ) {
        this.canvas.width = width
        this.canvas.height = width / screenScale
        this.canvas.style.width = Math.round(width) + 'px'
        this.canvas.style.height = Math.round(width / screenScale) + 'px'
      }
      else {
        this.canvas.width = height * screenScale
        this.canvas.height = height
        this.canvas.style.width = Math.round(height * screenScale) + 'px'
        this.canvas.style.height = Math.round(height) + 'px'
      }
    },
    loadSkin() {
      this.lightingImages = Array.from({length: info.skins[this.skin][this.keyMode].lightingImages.length}, () => new Image())
      for(let i = 0; i < this.lightingImages.length; i++) {
        this.lightingImages[i].src = info.skins[this.skin][this.keyMode].lightingImages[i]
      }

      this.comboImages = Array.from({length: info.skins[this.skin].comboImages.length}, () => new Image())
      for(let i = 0; i < this.comboImages.length; i++) {
        this.comboImages[i].src = info.skins[this.skin].comboImages[i]
      }

      this.receptorImages = Array.from({length: info.skins[this.skin][this.keyMode].receptorImages.length}, () => new Image())
      for(let i = 0; i < this.receptorImages.length; i++) {
        this.receptorImages[i].src = info.skins[this.skin][this.keyMode].receptorImages[i]
      }

      this.pressedReceptorImages = Array.from({length: info.skins[this.skin][this.keyMode].pressedReceptorImages.length}, () => new Image())
      for(let i = 0; i < this.pressedReceptorImages.length; i++) {
        this.pressedReceptorImages[i].src = info.skins[this.skin][this.keyMode].pressedReceptorImages[i]
      }

      this.hintImage = new Image()
      this.hintImage.src = info.skins[this.skin].hintImage

      this.judgementImages = Array.from({length: info.skins[this.skin].judgementImages.length}, () => new Image())
      for(let i = 0; i < this.judgementImages.length; i++) {
        this.judgementImages[i].src = info.skins[this.skin].judgementImages[i]
      }

      this.effectImages = Array.from({length: info.skins[this.skin].effectImages.length}, () => new Image())
      for(let i = 0; i < this.effectImages.length; i++) {
        this.effectImages[i].src = info.skins[this.skin].effectImages[i]
      }

      this.noteImages = Array.from({length: info.skins[this.skin][this.keyMode].noteImages.length}, () => new Image());
      for(let i = 0; i < this.noteImages.length; i++) {
        this.noteImages[i].src = info.skins[this.skin][this.keyMode].noteImages[i]
      }
    },
    loadKeyMode() {
      this.keysDown = []
      this.notes = []
      for(let i = 0; i < this.keyMode; i++) {
        this.keysDown.push(false)
        this.notes.push(new Queue())
      }
    }
  },
  destroyed () {
    removeEventListener("keydown", this.processKeyDown);
    removeEventListener("keyup", this.processKeyUp);
    window.removeEventListener("resize", this.processResize)
    this.canvas.removeEventListener("bpmChanged", this.processBpmChange)
    this.canvas.removeEventListener("fpsChanged", this.processFpsChange)
    this.canvas.removeEventListener("skinChanged", this.processSkinChange)
    this.canvas.removeEventListener("keyModeChanged", this.processKeyModeChange)
    this.canvas.removeEventListener("makeFullscreen", this.processFullScreen)
    this.canvas.removeEventListener("volumeChanged", this.processVolumeChange)
    this.canvas.removeEventListener("soundChanged", this.processSoundChange)
    this.canvas.removeEventListener("resetGame", this.processReset)

    clearInterval(this.interval)
  }
}
</script>

<style>
#gameCanvas {
    width: 100%;
    height: 100%;
    background: black;
}
#canvasWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>