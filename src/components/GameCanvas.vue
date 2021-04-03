<template>
  <div id='canvasWrapper'>
    <canvas
    id='gameCanvas'
    v-on:fpsChanged="this.processFpsChange"
    v-on:keyModeChanged="this.processKeyModeChange"
    v-on:skinChanged="this.processSkinChange"
    v-on:makeFullscreen="this.processFullScreen"
    v-on:volumeChanged="this.processVolumeChange"
    v-on:resetGame="this.processReset"
    v-on:loadSong="this.processLoadSong"
    ></canvas>
  </div>
</template>

<script>

// TODOS
// do pattern generator
// pick column position start or center
// show correct errors when parsing file fails
// bms: add LN support
// fix weird ln glitch
// clicking pick a song when a file is already uploaded doesn't have any indication to drag again if you'd like to add more songs (don't know if this is intentional to not overload the engine)
// Hide LN Cap

import { mapActions, mapGetters } from 'vuex';
import info from '../models/info';
import Queue from 'denque';
import { Howl, Howler } from 'howler';

export default {
  name: 'GameField',
  mounted() {
    addEventListener('keydown', this.processKeyDown)
    addEventListener('keyup', this.processKeyUp)

    this.loadKeyMode()

    this.loadSkin()

    Howler.volume(this.volume)

    /*this.song = new Howl({
      src: [require('@/assets/sound/cyber-loop.ogg')],
      loop: true,
      volume: this.volume,
      rate: this.bpm / 191,
    });*/

    this.start()
  },
  data() {
    return {
      /* Current map */
      accuracy: 0,
      combo: 0,
      difficulty: null,
      judgements: [0,0,0,0,0,0],
      keyMode: 4,
      length: 0,
      notes: [],
      timingWindows: 0,
      totalAccuracy: 0,
      songRate: 1,
      hitSounds: {},
      timeSounds: [],
      loadedSounds: null,
      totalSounds: null,
      backgroundImage: null,
      /* General */
      helperCanvas: null,
      helperContext: null,
      canvas: null,
      context: null,
      loading: false,
      pauseStartTime: null,
      pauseStopTime: null,
      paused: false,
      countdownStartTime: 0,
      playStartTime: 0,
      playing: false,
      skinData: null,
      webmaniaBackgroundImage: null,
      lastOffsetChangeTime: 0,
      /* Settings */
      offsetChangeTime: 3000,
      countdownTime: 2000,
      effectTime: 250,
      judgementEffectTime: 200,
      judgementTime: 400,
      lineWidth: 0.003,
      textSize: 0.05,
      margin: 0.02,
      /* Timers */
      addNotesInterval: null,
      gameLoopInterval: null,
      /* Draw Helpers */
      floatingLns: new Queue(),
      keysDown: null,
      lastOffsets: new Queue(),
      lastFps: new Queue(),
      lastHitTime: 0,
      lastJudgement: null,
      onGoingEffects: new Queue(),
      /* Pattern variables*/
      patternIndex: 0,
      pattern: [2,1],
      lastNoteAddedTime: 0,
      lastColumns: [],
      /* Custom background */
      lastFrameTime: null,
      particles: [],
      maxParticleWidth: 0.05,
      minParticleWidth: 0.005,
      numParticles: 100,
      particleSpeedMultiplier: 0.01,
    }
  },
  computed: mapGetters([
    'accuracySize',
    'audioOffset',
    'bmsStyle',
    'backgroundOpacity',
    'columnSize',
    'comboPosition',
    'comboSize',
    'effectSize',
    'fps',
    'fpsSize',
    'hitPosition',
    'hitPosition',
    'infoSize',
    'judgementBounce',
    'judgementPosition',
    'judgementSize',
    'judgementsSize',
    'keyBindings',
    'laneCoverBottomFade',
    'laneCoverBottomPosition',
    'laneCoverTopFade',
    'laneCoverTopPosition',
    'offsetSizeX',
    'offsetSizeY',
    'scrollSpeed',
    'showAccuracy',
    'showBackground',
    'showCombo',
    'showEffects',
    'showFps',
    'showHint',
    'showInfo',
    'showJudgement',
    'showJudgements',
    'showLaneCoverBottom',
    'showLaneCoverTop',
    'showLighting',
    'showOffset',
    'showReceptors',
    'showSongMeter',
    'skin',
    'songMeterSize',
    'upScroll',
    'visualOffset',
    'volume',
  ]),
  methods: {
    ...mapActions([
      'changeGeneralParameter'
    ]),
    hasKey(keyCode) {
      for(let i = 0; i < this.keyBindings[this.keyMode].length; i++) {
        if(keyCode == this.keyBindings[this.keyMode][i].code) {
          return i
        }
      }
      return null
    },
    processKeyDown(event) {
      if(!event.repeat) {
        if (event.code == this.keyBindings['pause'].code && !this.loading) {
          this.playPause()
        }
        if (event.code == this.keyBindings['restart'].code && !this.loading) {
          this.restart()
        }
        if (event.code == this.keyBindings['fullScreen'].code) {
          this.processFullScreen()
        }
        if (event.code == this.keyBindings['incrementAudioOffset'].code) {
          if(this.audioOffset + (event.shiftKey ? 1 : 5) <= 1500) {
            this.changeGeneralParameter({ id: 'audioOffset', value: this.audioOffset + (event.shiftKey ? 1 : 5) })
            if(this.playing) {
             this.resetTimeSounds()
            }
          }
          this.lastOffsetChangeTime = Date.now()
        }
        if (event.code == this.keyBindings['decrementAudioOffset'].code) {
          if(this.audioOffset - (event.shiftKey ? 1 : 5) >= -1500) {
            this.changeGeneralParameter({ id: 'audioOffset', value: this.audioOffset - (event.shiftKey ? 1 : 5) })
            if(this.playing) {
              this.resetTimeSounds()
            }
          }
          this.lastOffsetChangeTime = Date.now()
        }
        /*if (event.code == 'KeyG') {
          for(let timeSound of this.timeSounds) {
            console.log(timeSound.howl.seek())
            console.log((Date.now() - this.playStartTime - timeSound.startTime - this.audioOffset) / 1000 / this.songRate)
          }
        }*/
        let now = Date.now()
        let id = this.hasKey(event.code)
        let maxTimingWindow = this.getTimingWindow(5)
        if(id != null) {
          this.keysDown[id] = true
          if(this.playing && !this.paused) {
            let note = this.getFirstActiveNote(this.notes[id])
            if(note == null || note.pressed) return
            let offset = now - this.playStartTime - note.startTime
            if(Math.abs(offset) <= maxTimingWindow) {
              if(note.objectName == 'note')
                this.notes[id].shift()
              this.lastHitTime = now
              this.lastJudgement = this.getJudgement(offset)
              if(this.lastJudgement == 5) {
                if(note.objectName == 'longnote')
                  note.missed = true
                this.breakCombo()
                this.lastOffsets.push({ offset: -this.getTimingWindow(4), startTime: now })
              } else {
                if(note.objectName == 'longnote')
                  note.pressed = true
                if(note.hitSound != null && this.hitSounds[note.hitSound] != null) {
                  this.hitSounds[note.hitSound].play()
                }
                this.processKeyTap(id, offset, this.lastJudgement)
              }
            } 
          }
        }
      }
    },
    processKeyUp(event) {
      let id = this.hasKey(event.code)
      let now = Date.now()
      let earlyTimingWindow = this.getTimingWindow(5)
      if (id != null) {
        this.keysDown[id] = false
        if(this.playing && !this.paused) {
          let note = this.getFirstActiveNote(this.notes[id])
          if(note != null && note.objectName == 'longnote') {
            let offset = now - this.playStartTime - note.endTime
            if(note.pressed && offset < -earlyTimingWindow) {  // Released longnote too soon
              note.missed = true
              note.pressed = false
              this.lastHitTime = now
              this.lastJudgement = 5
              this.breakCombo()
              this.lastOffsets.push({ offset: -this.getTimingWindow(4), startTime: now })
            }
            else if(note.pressed && Math.abs(offset) < earlyTimingWindow) { // Released in time
              this.notes[id].shift()
              this.lastHitTime = now
              this.lastJudgement = this.getJudgement(offset)
              if(this.lastJudgement == 5) {
                this.breakCombo()
                this.lastOffsets.push({ offset: -this.getTimingWindow(4), startTime: now })
              } else {
                this.processKeyTap(id, offset, this.lastJudgement)
              }
            }
          }
        }
      }
    },
    processKeyTap(column, offset, judgement) {
      let now = Date.now()
      let maxOffset = this.getTimingWindow(4)
      this.combo += 1
      this.lastOffsets.push({ offset: offset < 0 ? Math.max(offset, -maxOffset) : Math.min(offset, maxOffset), startTime: now})
      this.onGoingEffects.push({ id: column, startTime: now })
      this.judgements[judgement] += 1
      this.accuracy += this.getAccuracy(judgement)
      this.totalAccuracy += this.getAccuracy(0)
    },
    playPause() {
      if(!this.playing) return
      if(this.paused) { // play
        this.playStartTime = this.playStartTime + Date.now() - this.pauseStartTime + this.countdownTime
        this.pauseStopTime = Date.now()
        this.countdownStartTime = Date.now()
        this.paused = false
      } else { // pause
        this.pauseStartTime = Date.now() - this.pauseStopTime < this.countdownTime ? Date.now() + this.countdownTime - (Date.now() - this.pauseStopTime) : Date.now()
        this.countdownStartTime = 0
        this.paused = true
        this.resetTimeSounds()
      }
    },
    resetTimeSounds() {
      for(let timeSound of this.timeSounds) {
        if(timeSound.start) {
          timeSound.start = false
          if(this.hitSounds[timeSound.name] == null) continue
          this.hitSounds[timeSound.name].stop(timeSound.id)
        }
      }
    },
    restart() {
      this.processLoadSong({ detail: this.difficulty, restart: true })
    },
    start() {
      /*for(let i = 0; i < this.numParticles; i++) {
        let sizePercentage = Math.random() * (this.maxParticleWidth - this.minParticleWidth) + this.minParticleWidth
        this.particles.push({
          widthPercentage: Math.random(),
          heightPercentage: Math.random(),
          sizePercentage: sizePercentage,
          speed: sizePercentage * this.particleSpeedMultiplier,
          column: Math.floor(Math.random() * this.skinData.noteImages.length)
        })
      }*/
      this.webmaniaBackgroundImage = new Image()
      this.webmaniaBackgroundImage.src = require('@/assets/app/background.jpg')

      this.canvas = document.getElementById('gameCanvas')
      this.context = this.canvas.getContext('2d')
      this.canvas.width = window.screen.width
      this.canvas.height = window.screen.height

      this.helperCanvas = document.createElement("canvas")
      this.helperContext = this.helperCanvas.getContext('2d')
      this.helperCanvas.width = this.canvas.width
      this.helperCanvas.height = this.canvas.height
      
      //this.addNotes()
      //this.addNotesInterval = setInterval(() => this.addNotes(), 1000.0)
      this.gameLoopInterval = setInterval(this.updateCanvas, 1000.0 / this.fps)
    },
    updateCanvas() {
      if(this.playing && !this.paused)
        this.checkMisses()
      if(this.playing && !this.paused)
        this.checkTimeSounds()
      this.clear()
      if(this.showBackground)
        this.drawBackground()
      if(this.upScroll) {
        this.context.save()
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(1, -1)
        this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      }
      if(this.showHint)
        this.drawHint()
      if(this.showLighting)
        this.drawLighting()
      if(this.playing)
        this.drawNotes()
      if(this.showLaneCoverTop)
        this.drawLaneCoverTop()
      if(this.showLaneCoverBottom)
        this.drawLaneCoverBottom()
      if(this.showReceptors)
        this.drawReceptors()
      if(this.showEffects)
        this.drawEffects()
      if(this.upScroll)
        this.context.restore()
      if(this.showCombo)
        this.drawCombo()
      if(this.showJudgement)
        this.drawJudgement()
      if(this.showSongMeter)
        this.drawSongMeter()
      if(this.showAccuracy)
        this.drawAccuracy()
      if(this.showInfo && this.difficulty != null)
        this.drawInfo()
      if(this.showJudgements)
        this.drawJudgements()
      if(this.showOffset)
        this.drawOffset()
      if(Date.now() - this.countdownTime - 200 < this.countdownStartTime)
        this.drawCountdown()
      if(this.paused)
        this.drawPaused()
      if(!this.playing) {
        if(this.loading) {
          this.drawLoading()
        } else {
          this.drawSelectSong()
        }
      }
      if(this.showFps)
        this.drawFps()
      if(Date.now() - this.lastOffsetChangeTime < this.offsetChangeTime)
        this.drawOffsetChange()
    },
    checkTimeSounds() {
      for(let timeSound of this.timeSounds) {
        if(!timeSound.start && Date.now() - this.playStartTime >= (timeSound.startTime + this.audioOffset) / this.songRate) {
          timeSound.start = true
          if(this.hitSounds[timeSound.name] == null || (Date.now() - this.playStartTime - timeSound.startTime - this.audioOffset) / 1000 * this.songRate >= this.hitSounds[timeSound.name].duration()) continue
          this.hitSounds[timeSound.name].once('play', () => {
            this.hitSounds[timeSound.name].seek((Date.now() - this.playStartTime - timeSound.startTime - this.audioOffset) / 1000 * this.songRate , timeSound.id)
          })
          timeSound.id = this.hitSounds[timeSound.name].play()
        } 
      }
    },
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.fillStyle = 'black'
      this.context.beginPath();
      this.context.rect(0, 0, this.canvas.width, this.canvas.height);
      this.context.closePath();
      this.context.fill();
    },
    drawLaneCoverTop() {
      let widthStart = this.canvas.width / 2 - this.canvas.width * this.columnSize * this.keyMode / 2
      let widthLength = this.canvas.width * this.columnSize * this.keyMode
      let gradientHeight = this.canvas.height * this.laneCoverTopFade
      let coverHeight = this.canvas.height * this.laneCoverTopPosition
      let gradient = this.context.createLinearGradient(0, coverHeight, 0, coverHeight + gradientHeight)
      gradient.addColorStop(0, "black");
      gradient.addColorStop(1, "transparent");

      this.context.fillStyle = 'black';
      this.context.fillRect(widthStart, 0, widthLength, coverHeight);

      this.context.fillStyle = gradient;
      this.context.fillRect(widthStart, coverHeight, widthLength, gradientHeight)
    },
    drawLaneCoverBottom() {
      let widthStart = this.canvas.width / 2 - this.canvas.width * this.columnSize * this.keyMode / 2
      let widthLength = this.canvas.width * this.columnSize * this.keyMode
      let gradientHeight = this.canvas.height * this.laneCoverBottomFade
      let coverHeight = this.canvas.height * this.laneCoverBottomPosition
      let gradient = this.context.createLinearGradient(0, this.canvas.height - coverHeight, 0, this.canvas.height - coverHeight - gradientHeight)
      gradient.addColorStop(0, "black");
      gradient.addColorStop(1, "transparent");

      this.context.fillStyle = 'black';
      this.context.fillRect(widthStart, this.canvas.height - coverHeight, widthLength, coverHeight);

      this.context.fillStyle = gradient;
      this.context.fillRect(widthStart, this.canvas.height - coverHeight - gradientHeight, widthLength, gradientHeight)
    },
    drawPaused() {
      this.context.font = (this.canvas.height * this.textSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'middle'
      this.context.textAlign = 'center'
      this.context.fillText(this.$t('general.paused'), this.canvas.width / 2, this.canvas.height / 2)
    },
    drawOffsetChange() {
      this.context.font = (this.canvas.height * this.textSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'top'
      this.context.textAlign = 'left'
      this.context.fillText(this.$t('general.newaudiooffset') + this.audioOffset.toFixed(0) + ' ms', this.margin * this.canvas.height, this.margin * this.canvas.height)
    },
    drawBackground() {
      this.context.globalAlpha = this.backgroundOpacity;
      this.context.drawImage(this.backgroundImage ? this.backgroundImage : this.webmaniaBackgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height)
      this.context.globalAlpha = 1.0;

      this.context.fillStyle = 'black'
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 - this.columnSize * this.keyMode * this.canvas.width / 2, 0, this.columnSize * this.keyMode * this.canvas.width, this.canvas.height);
      this.context.closePath();
      this.context.fill();
      /*} else {
        /*let now = Date.now()
        if(!this.lastFrameTime)
          this.lastFrameTime = now
        for(let particle of this.particles) {
          if(particle.heightPercentage >= 1) {
            particle.widthPercentage = Math.random()
            particle.sizePercentage = Math.random() * (this.maxParticleWidth - this.minParticleWidth) + this.minParticleWidth
            particle.heightPercentage = - (particle.sizePercentage * this.skinData.noteImages[particle.column].height / this.skinData.noteImages[particle.column].width)
            particle.speed = particle.sizePercentage * this.particleSpeedMultiplier
            particle.column = Math.floor(Math.random() * this.skinData.noteImages.length)
          } else {
            particle.heightPercentage += particle.speed * (now - this.lastFrameTime)
            this.particles.sort((a,b) => a.sizePercentage > b.sizePercentage ? 1 : -1)
            let maxParticleHeight = this.maxParticleWidth * this.skinData.noteImages[particle.column].height / this.skinData.noteImages[particle.column].width
            this.context.drawImage(
              this.skinData.noteImages[particle.column],
              particle.widthPercentage * (this.canvas.width + this.canvas.width * 2 * this.maxParticleWidth) - this.canvas.width * this.maxParticleWidth,
              particle.heightPercentage * (this.canvas.height + this.canvas.height * 2 * maxParticleHeight) - this.canvas.height * maxParticleHeight,
              particle.sizePercentage * this.canvas.width,
              particle.sizePercentage * this.canvas.height * this.skinData.noteImages[particle.column].height / this.skinData.noteImages[particle.column].width
            )
          }
        }
        this.lastFrameTime = now
      }*/
    },
    drawInfo() {
      let margin = this.canvas.height * this.margin
      this.context.font = (this.canvas.height * this.infoSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'bottom'
      this.context.textAlign = 'left'
      this.context.fillText('OD' + this.timingWindows.toFixed(0) + ', ' + (this.songRate * this.difficulty.beatmap.bpm).toFixed(0) + 'bpm, ' + this.songRate.toFixed(2) + 'x', margin, this.canvas.height - margin)

    },
    drawSongMeter() {
      let margin = this.canvas.height * this.margin
      let now = Date.now()
      let lineWidth = this.canvas.height * this.lineWidth
      let radius = this.canvas.height * this.songMeterSize / 2
      let timeElapsed = this.paused ? this.pauseStartTime - this.playStartTime : now - this.playStartTime
      let timeRatio = timeElapsed < 0 ? 0 : timeElapsed / this.length
      let radians = this.playStartTime == 0 || this.length == 0 ? 0 : 2 * Math.PI * timeRatio
      let accuracyHeight = this.showAccuracy ? this.accuracySize * this.canvas.height : 0

      this.context.fillStyle = '#1976d2'
      this.context.beginPath()
      this.context.moveTo(this.canvas.width - radius - lineWidth - margin, radius + lineWidth + margin + accuracyHeight)
      this.context.arc(this.canvas.width - radius - lineWidth - margin,radius + lineWidth + margin + accuracyHeight, radius, - Math.PI / 2, radians - Math.PI / 2)
      this.context.lineTo(this.canvas.width - radius - lineWidth - margin, radius + lineWidth + margin + accuracyHeight)
      this.context.closePath()
      this.context.fill()

      this.context.lineWidth = lineWidth;
      this.context.strokeStyle = 'white'
      this.context.stroke
      this.context.beginPath()
      this.context.arc(this.canvas.width - radius - lineWidth - margin, radius + lineWidth + margin + accuracyHeight, radius, 0, 2 * Math.PI)
      this.context.closePath()
      this.context.stroke()

    },
    drawCountdown() {
      let now = Date.now()
      this.context.font = (this.canvas.height * this.textSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'middle'
      this.context.textAlign = 'center'
      let playableHeight = this.canvas.height - (this.hitPosition * this.canvas.height)
      let screenTime = this.scrollSpeed
      this.context.fillText('3', this.canvas.width / 2, playableHeight - (this.countdownStartTime - now + (this.countdownTime * 1 / 4)) * playableHeight / screenTime)
      this.context.fillText('2', this.canvas.width / 2, playableHeight - (this.countdownStartTime - now + (this.countdownTime * 2 / 4)) * playableHeight / screenTime)
      this.context.fillText('1', this.canvas.width / 2, playableHeight - (this.countdownStartTime - now + (this.countdownTime * 3 / 4)) * playableHeight / screenTime)
    },
    drawLoading() {
      this.context.font = (this.canvas.height * this.textSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'middle'
      this.context.textAlign = 'center'
      this.context.fillText(this.$t('general.loading'), this.canvas.width / 2, this.canvas.height / 2)
    },
    drawReady() {
      this.context.font = (this.canvas.height * this.textSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'middle'
      this.context.textAlign = 'center'
      this.context.fillText(this.$t('general.pressanykey'), this.canvas.width / 2, this.canvas.height / 2)
    },
    drawSelectSong() {
      this.context.font = (this.canvas.height * this.textSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'middle'
      this.context.textAlign = 'center'
      this.context.fillText(this.$t('general.pick'), this.canvas.width / 2, this.canvas.height / 2)
    },
    drawHint() {
      let hintImage = this.skinData.hintImage
      this.context.drawImage(
          hintImage,
          (this.canvas.width - (this.canvas.width * this.columnSize * this.keyMode)) / 2 ,
          this.canvas.height - (this.hitPosition * this.canvas.height) - (hintImage.height / 2),
          this.canvas.width * this.columnSize * this.keyMode,
          hintImage.height)
    },
    drawLighting() {
      for(let i = 0; i < this.keyBindings[this.keyMode].length ; i++) {
        if (this.keysDown[i]) {
          let lightingImage = this.skinData.noteColored ? this.skinData.lightingImage : this.skinData.lightingImages[i]
          let lightingWidth = this.columnSize * this.canvas.width
          let lightingHeight = lightingWidth * lightingImage.height / lightingImage.width
          this.context.drawImage(lightingImage,
          ((this.canvas.width - (lightingWidth * this.keyMode)) / 2) + (lightingWidth * i),
          this.canvas.height - lightingHeight - (this.hitPosition * this.canvas.height),
          lightingWidth,
          lightingHeight)
        }
      }
    },
    drawCombo() {
      if(this.combo == 0) return
      /*let comboString = this.combo.toString()
      let comboHeight = this.comboSize * this.canvas.height
      for(let i = 0; i < comboString.length; i++) {
        let comboImage = this.skinData.comboImages[comboString[i]]
        let comboWidth = comboHeight * comboImage.width / comboImage.height
        this.context.drawImage(
          comboImage,
          (this.canvas.width / 2) - (comboWidth * comboString.length / 2) + (comboWidth * i),
          this.canvas.height - (this.comboPosition * this.canvas.height) - (comboHeight / 2),
          comboWidth,
          comboHeight)
      }*/

      this.context.font = (this.canvas.height * this.comboSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'middle'
      this.context.textAlign = 'center'
      this.context.fillText(this.combo.toFixed(0), this.canvas.width / 2, this.canvas.height - this.canvas.height * this.comboPosition)
    },
    drawJudgement() {
      let difference = Date.now() - this.lastHitTime
      if(difference < this.judgementTime) {
        let judgementImage = this.skinData.judgementImages[this.lastJudgement]
        let judgementHeight = Math.max(this.canvas.height * this.judgementSize * (1 + this.judgementBounce) - difference / this.judgementEffectTime * (this.canvas.height * this.judgementSize * (1 + this.judgementBounce) - this.canvas.height * this.judgementSize), this.canvas.height * this.judgementSize)
        let judgementWidth = judgementHeight * judgementImage.width / judgementImage.height
        this.context.drawImage(
          judgementImage,
          (this.canvas.width / 2) - (judgementWidth / 2),
          this.canvas.height - (this.judgementPosition * this.canvas.height) - (judgementHeight / 2),
          judgementWidth,
          judgementHeight)
      }
    },
    drawEffects() {
      let now = Date.now()
      this.context.globalCompositeOperation = 'screen'
      this.removeOldEffects()
      for(let i = 0; i < this.onGoingEffects.length; i++) {
        let difference = now - this.onGoingEffects.peekAt(i).startTime
        let index = Math.floor((difference / this.effectTime) * this.skinData.effectImages.length )
        this.context.drawImage(
          this.skinData.effectImages[index],
          this.onGoingEffects.peekAt(i).id * (this.canvas.width * this.columnSize) + (this.canvas.width * this.columnSize / 2) - this.canvas.width * this.effectSize + ((this.canvas.width - (this.canvas.width * this.columnSize * this.keyMode)) / 2),
          this.canvas.height - (this.hitPosition * this.canvas.height) - this.canvas.width * this.effectSize,
          this.canvas.width * this.effectSize * 2,
          this.canvas.width * this.effectSize * 2)
      }
      this.context.globalCompositeOperation = 'source-over'
    },
    drawReceptors() {
      for(let i = 0; i < this.keyBindings[this.keyMode].length ; i++) {
        let receptorImage = this.skinData.noteColored ? this.skinData.receptorImage : this.skinData.receptorImages[i]
        let receptorDownImage = this.skinData.noteColored ? this.skinData.receptorDownImage : this.skinData.receptorDownImages[i]
        let receptorWidth = this.columnSize * this.canvas.width
        let receptorHeight =  receptorWidth * receptorImage.height / receptorImage.width
        let receptorStartX = ((this.canvas.width - (receptorWidth * this.keyMode)) / 2) + (receptorWidth * i)
        let receptorStartY = this.canvas.height - (this.hitPosition * this.canvas.height) - (receptorHeight / 2)

        this.context.save()
        this.context.translate(receptorStartX + receptorWidth / 2, receptorStartY + receptorHeight / 2);
        if(this.upScroll)
          this.context.scale(1, -1)
        if(this.skinData.rotate)
          this.context.rotate(this.skinData.rotate[this.keyMode][i])
        this.context.translate(-receptorStartX - receptorWidth / 2, -receptorStartY - receptorHeight / 2);

        if (this.keysDown[i]) {
          this.context.drawImage(
            receptorDownImage,
            receptorStartX,
            receptorStartY,
            receptorWidth,
            receptorHeight
          )
        } else {
          this.context.drawImage(
            receptorImage,
            receptorStartX,
            receptorStartY,
            receptorWidth,
            receptorHeight
          )
        }

        this.context.restore()
      }
    },
    drawNotes() {
      let now = Date.now()
      let playableHeight = this.canvas.height - (this.hitPosition * this.canvas.height)
      let screenTime = this.scrollSpeed //miliseconds that will appear on screen
      let noteWidth = this.columnSize * this.canvas.width
      for(let column = 0; column < this.notes.length; column++) {
        for(let i = 0; i < this.notes[column].length; i++) {
          let note = this.notes[column].peekAt(i)
          let difference = this.paused ? this.playStartTime + this.visualOffset + note.startTime - this.pauseStartTime : this.playStartTime + this.visualOffset + note.startTime - now
          if(difference < screenTime) {
            let noteImage = this.skinData.noteColored ? (this.skinData.noteImages[note.timing] != null ? this.skinData.noteImages[note.timing] : this.skinData.noteImages[16]) : this.skinData.noteImages[column]
            let noteHeight = noteWidth * noteImage.height / noteImage.width

            if(note.objectName == 'longnote') {
              let lnBodyImage = this.skinData.noteColored ? this.skinData.lnBodyImage : this.skinData.lnBodyImages[column]
              let lnCapImage = this.skinData.noteColored ? this.skinData.lnCapImage : this.skinData.lnCapImages[column]
              let capDifference = this.paused ? this.playStartTime + this.visualOffset + note.endTime - this.pauseStartTime : this.playStartTime + this.visualOffset + note.endTime - now
              let capHeight = noteWidth * lnCapImage.height / lnCapImage.width
              let pressedBodyHeight = capDifference * playableHeight / screenTime
              let bodyHeight = (capDifference - difference) * playableHeight / screenTime

              this.helperContext.clearRect(0, 0, this.helperCanvas.width, this.helperCanvas.height)
              
              this.helperContext.drawImage( // longnote body
                lnBodyImage,
                ((this.canvas.width - (noteWidth * this.keyMode)) / 2) + (noteWidth * column),
                playableHeight - (difference * playableHeight / screenTime) - bodyHeight,
                noteWidth,
                note.pressed && difference < 0 ? pressedBodyHeight : bodyHeight,
              )
              this.helperContext.drawImage( // longnote cap
                lnCapImage,
                ((this.canvas.width - (noteWidth * this.keyMode)) / 2) + (noteWidth * column),
                playableHeight - (capDifference * playableHeight / screenTime) - capHeight / 2,
                noteWidth,
                capHeight,
              )

              let noteStartX = ((this.canvas.width - (noteWidth * this.keyMode)) / 2) + (noteWidth * column)
              let noteStartY = note.pressed && difference < 0 ? playableHeight - (noteHeight / 2) : playableHeight - (difference * playableHeight / screenTime) - (noteHeight / 2)

              this.helperContext.save()
              this.helperContext.translate(noteStartX + noteWidth / 2, noteStartY + noteHeight / 2);
              if(this.upScroll)
                this.helperContext.scale(1, -1)
              if(this.skinData.rotate)
                this.helperContext.rotate(this.skinData.rotate[this.keyMode][column])
              this.helperContext.translate(-noteStartX - noteWidth / 2, -noteStartY - noteHeight / 2);
              
              this.helperContext.drawImage( // longnote bottom
                noteImage,
                noteStartX,
                noteStartY,
                noteWidth,
                noteHeight,
              )

              this.helperContext.restore()
              
              if(note.missed) {
                this.context.globalAlpha = 0.5
              }
              this.context.drawImage(this.helperCanvas, 0, 0, this.canvas.width, this.canvas.height)
              this.context.globalAlpha = 1.0
            } else {
              let noteStartX = ((this.canvas.width - (noteWidth * this.keyMode)) / 2) + (noteWidth * column)
              let noteStartY = playableHeight - (difference * playableHeight / screenTime) - (noteHeight / 2)

              this.context.save()
              this.context.translate(noteStartX + noteWidth / 2, noteStartY + noteHeight / 2);
              if(this.upScroll)
                this.context.scale(1, -1)
              if(this.skinData.rotate)
                this.context.rotate(this.skinData.rotate[this.keyMode][column])
              this.context.translate(-noteStartX - noteWidth / 2, -noteStartY - noteHeight / 2);

              this.context.drawImage( //regular note
                noteImage,
                noteStartX,
                noteStartY,
                noteWidth,
                noteHeight,
              )

              this.context.restore()
            }
          } else {
            break
          }
        }
      }
    },
    drawFps() {
      let margin = this.canvas.height * this.margin
      this.lastFps.push(Date.now())
      if(this.lastFps.length == 1) {
        return
      }
      this.context.font = (this.canvas.height * this.fpsSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'red'
      this.context.textBaseline = 'bottom'
      this.context.textAlign = 'right'
      this.context.fillText((1000.0 * this.lastFps.length / (this.lastFps.peekBack() - this.lastFps.peekFront())).toFixed(0), this.canvas.width - margin, this.canvas.height - margin)
      if(this.lastFps.length > 100) {
        this.lastFps.shift()
      }
    },
    drawOffset() {
      let now = Date.now()
      while(this.lastOffsets.peekFront() != null && now - this.lastOffsets.peekFront().startTime >= this.offsetChangeTime) {
        this.lastOffsets.shift()
      }

      let offsetSizeX = this.canvas.width * this.offsetSizeX
      let offsetSizeY = this.canvas.height * this.offsetSizeY

      let maxOffset = this.getTimingWindow(4)
      let blueWidth = offsetSizeX * this.getTimingWindow(1) / maxOffset / 2
      let greenWidth = offsetSizeX * this.getTimingWindow(3) / maxOffset / 2 - blueWidth
      let yellowWidth = offsetSizeX / 2 - greenWidth - blueWidth

      this.context.fillStyle = 'rgba(0,0,0,0.5)' //black
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 - offsetSizeX / 2, this.canvas.height - offsetSizeY, offsetSizeX, offsetSizeY);
      this.context.closePath();
      this.context.fill();

      this.context.fillStyle = '#2ebbe6' //blue
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 - blueWidth , this.canvas.height - offsetSizeY * 0.625, 2 * blueWidth, offsetSizeY * 0.25);
      this.context.closePath();
      this.context.fill();

      this.context.fillStyle = '#53e80a' //green
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 - blueWidth - greenWidth, this.canvas.height - offsetSizeY * 0.625, greenWidth, offsetSizeY * 0.25);
      this.context.closePath();
      this.context.fill();
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 + blueWidth, this.canvas.height - offsetSizeY * 0.625, greenWidth, offsetSizeY * 0.25);
      this.context.closePath();
      this.context.fill();

      this.context.fillStyle = '#dead50' //yellow
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 - offsetSizeX / 2, this.canvas.height - offsetSizeY * 0.625, yellowWidth, offsetSizeY * 0.25);
      this.context.closePath();
      this.context.fill();
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 + blueWidth + greenWidth, this.canvas.height - offsetSizeY * 0.625, yellowWidth, offsetSizeY * 0.25);
      this.context.closePath();
      this.context.fill();

      this.context.fillStyle = 'white' //white 5%
      this.context.beginPath();
      this.context.rect(this.canvas.width / 2 - 1.5, this.canvas.height - offsetSizeY, 3, offsetSizeY);
      this.context.closePath();
      this.context.fill();

      this.context.globalCompositeOperation = 'screen'

      for(let i = 0; i < this.lastOffsets.length; i++) {
        let offset = this.lastOffsets.peekAt(i).offset
        let offsetWidth = (offset + maxOffset) / (maxOffset * 2) * offsetSizeX

        this.context.fillStyle = this.getOffsetColor(offset)

        this.context.beginPath();
        this.context.rect(this.canvas.width / 2 - offsetSizeX / 2 - 1.5 + offsetWidth, this.canvas.height - offsetSizeY, 3, offsetSizeY);
        this.context.closePath();
        this.context.fill();
      }

      this.context.globalCompositeOperation ='source-over'
    },
    getOffsetColor(offset) {
      let x = this.getJudgement(offset)
      if(x < 2) return 'rgba(46, 187, 230, 1)'
      if(x < 4) return 'rgba(83, 232, 10, 1)'
      return 'rgba(222, 173, 80, 1)'
    },
    drawAccuracy() {
      let margin = this.canvas.height * this.margin
      this.context.font = (this.canvas.height * this.accuracySize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'top'
      this.context.textAlign = 'right'
      this.context.fillText(this.totalAccuracy == 0 ? '100.00%' : (this.accuracy / this.totalAccuracy * 100).toFixed(2) + '%', this.canvas.width - margin, margin)
    },
    drawJudgements() {
      let margin = this.canvas.width * this.margin
      this.context.font = (this.canvas.height * this.judgementsSize).toFixed(0) + 'px Arial'
      this.context.fillStyle = 'white'
      this.context.textBaseline = 'top'
      this.context.textAlign = 'left'
      let judgementHeight = this.judgementsSize * this.canvas.height
      let startHeight = (this.canvas.height / 2) - (3 * judgementHeight)
      for(let i = 0; i < 6; i++) {
        let judgementImage = this.skinData.judgementImages[i]
        let judgementWidth = judgementHeight * judgementImage.width / judgementImage.height
        this.context.drawImage( //regular note
              judgementImage,
              margin,
              startHeight + judgementHeight * i,
              judgementWidth,
              judgementHeight,
        )
        this.context.fillText(this.judgements[i], judgementWidth + 2 * margin, startHeight + judgementHeight * i)
      }
    },
    removeOldEffects() {
      let queue = this.onGoingEffects
      let screenTime = this.effectTime
      let now = Date.now()
      while(queue.peekFront() != null && now - queue.peekFront().startTime >= screenTime) {
        queue.shift()
      }
    },
    addNotes() {
      let now = Date.now()
      let init = this.lastNoteAddedTime
      let offset = now - this.lastNoteAddedTime + 30000
      if(offset > 30000) {
        init = now
        offset = 30000
      }
      for(let i = init + (60000 / (this.bpm * 4)); i < init + offset; i += (60000 / (this.bpm * 4)) ) {
        if(this.keyMode == 1 < 3 || this.lastColumns == null) {
          this.lastColumns = []
          let column = Math.floor((Math.random() * this.keyMode))
          this.notes[column].push({ startTime: i })
          this.lastNoteAddedTime = i
          this.lastColumns.push(column)
        } else if(this.keyMode == 4) {
          let availableNumbers = Array.from(Array(this.keyMode).keys()).filter((i) => !this.lastColumns.includes(i))
          if(this.patternIndex == 1)
            this.lastColumns = []
          for(let j = 0; j < this.pattern[this.patternIndex]; j++) {
            let column = Math.floor(Math.random() * availableNumbers.length)
            this.notes[availableNumbers[column]].push({ startTime: i, endTime: i + 60000 / (this.bpm * 4) })
            this.lastNoteAddedTime = i
            this.lastColumns.push(availableNumbers[column])
            availableNumbers.splice(column, 1)
          }
          this.patternIndex = (this.patternIndex + 1) % this.pattern.length
        } else {
          let availableNumbers = Array.from(Array(this.keyMode).keys()).filter((i) => !this.lastColumns.includes(i))
          this.lastColumns = []
          let column = Math.floor(Math.random() * availableNumbers.length)
          this.notes[availableNumbers[column]].push({ startTime: i })
          this.lastNoteAddedTime = i
          this.lastColumns.push(availableNumbers[column])
        }
      }
    },
    getFirstActiveNote(queue) {
      for(let i = 0; i < queue.length; i++) {
        let note = queue.peekAt(i)
        if(!note.missed) {
          return note
        }
      }
      return null
    },
    checkMisses() {
      let now = Date.now()
      let lateTimingWindow = this.getTimingWindow(4)
      for(let queue of this.notes) {
        let processed = false
        while(processed != true) {
          let note = this.getFirstActiveNote(queue)
          note != null && ((note.objectName == 'longnote' && now - this.playStartTime - note.endTime >= lateTimingWindow) || now - this.playStartTime - note.startTime >= lateTimingWindow) && note.missed != true
          if(note == null) { // Empty
            processed = true
          } else if(note.objectName == 'longnote') { // Missed Longnote
            if(now - this.playStartTime - note.startTime >= lateTimingWindow && !note.pressed) { // Missed start
              note.missed = true
              this.lastHitTime = now
              this.lastJudgement = 5
              this.breakCombo()
            } else if(note.pressed && now - this.playStartTime - note.endTime >= lateTimingWindow) { // Missed end
              queue.shift()
              this.lastHitTime = now
              this.lastJudgement = 5
              this.breakCombo()
            } else {
              processed = true
            }
          } else { // Missed Normal note
            if(now - this.playStartTime - note.startTime >= lateTimingWindow) {
              queue.shift()
              this.lastHitTime = now
              this.lastJudgement = 5
              this.breakCombo()
            } else {
              processed = true
            }
          }
        }
      }
    },
    breakCombo() {
      this.combo = 0
      this.judgements[5] += 1
      this.totalAccuracy += this.getAccuracy(0)
    },
    getAccuracy(judgement) {
      switch(judgement) {
        case 0:
          return 300
        case 1:
          return 300
        case 2:
          return 200
        case 3:
          return 100
        case 4:
          return 50
        case 5:
          return 0
      }
      return 0
    },
    getTimingWindow(judgement) {
      switch(judgement) {
        case 0:
          return 17
        case 1:
          return 65 - this.timingWindows * 3
        case 2:
          return 98 - this.timingWindows * 3
        case 3:
          return 128 - this.timingWindows * 3
        case 4:
          return 152 - this.timingWindows * 3
        case 5:
          return 189 - this.timingWindows * 3
      }
      return 0
    },
    getJudgement(timing) {
      if(timing <= -this.getTimingWindow(4))
        return 5
      let absTiming = Math.abs(timing)
      for(let i = 0; i < 6; i++) {
        if(absTiming <= this.getTimingWindow(i)) {
          return i
        }
      }
    },
    clearNotes() {
      for(var queue of this.notes) {
        queue.clear()
      }
    },
    processFpsChange() {
      clearInterval(this.gameLoopInterval)
      this.gameLoopInterval = setInterval(this.updateCanvas, 1000.0 / this.fps)
      this.lastFps.clear()
    },
    processSkinChange() {
      this.loadSkin()
    },
    processKeyModeChange() {
      this.loadKeyMode()
      this.processSkinChange()
    },
    processFullScreen() {
      if(this.canvas.webkitRequestFullScreen) {
        this.canvas.webkitRequestFullScreen()
      } else {
        this.canvas.requestFullscreen()
      }
    },
    processVolumeChange() {
      Howler.volume(this.volume)
    },
    processReset() {
      this.processSkinChange()
      this.processKeyModeChange()
      this.processFpsChange()
      this.processVolumeChange()
    },
    processLoadSong(event) {
      if(event.restart && this.difficulty == null) return
      this.combo = 0
      this.accuracy = 0
      this.totalAccuracy = 0
      this.judgements = [0,0,0,0,0,0,0]
      this.playing = false
      this.paused = false
      this.loading = true
      this.difficulty = event.detail
      this.keyMode = event.detail.beatmap.keys
      if(event.detail.image) {
        this.backgroundImage = new Image()
        this.backgroundImage.src = event.detail.image
      }
      this.timingWindows = event.detail.timingWindows
      this.songRate = event.detail.songRate
      this.length = event.detail.beatmap.length * 1000 / this.songRate
      this.notes = []
      for(let i = 0; i < event.detail.beatmap.keys; i++) {
        this.notes.push(new Queue())
      }
      for(let note of event.detail.beatmap.notes) {
        this.notes[note.key].push({
          startTime: (note.startTime + event.detail.beatmap.offset) / this.songRate ,
          endTime: (note.endTime + event.detail.beatmap.offset) / this.songRate ,
          hitSound: note.hitSound,
          objectName: note.objectName,
          timing: note.timing,
        })
      }
      let scratchNotes = []
      if(this.keyMode == 8 && event.detail.mods.noscratch) {
        this.keyMode = 7
        scratchNotes = this.notes[0]
        this.notes[0] = this.notes[1]
        this.notes[1] = this.notes[2]
        this.notes[2] = this.notes[3]
        this.notes[3] = this.notes[4]
        this.notes[4] = this.notes[5]
        this.notes[5] = this.notes[6]
        this.notes[6] = this.notes[7]
        this.notes.pop()
      } else {
        if(this.keyMode == 8 && this.bmsStyle == 'bmsright') {
          this.bmsLeft = false
          let temp = this.notes[0]
          this.notes[0] = this.notes[7]
          this.notes[7] = temp
        } else {
          this.bmsLeft = true
        }
      }
      if(event.detail.mods.mirror) {
        this.notes = this.notes.reverse(this.notes)
      }
      if(event.detail.mods.random) {
        this.shuffle(this.notes)
      }
      this.processKeyModeChange()
      if(event.restart) {
        for(let hitSound of Object.values(this.hitSounds)) {
          if(hitSound == null) continue
          hitSound.stop()
          hitSound.seek(0)
        }
        for(let timeSound of this.timeSounds) {
          if(timeSound.start) {
            timeSound.start = false
          }
        }
        this.startSong()
      } else {
        for(let hitSound of Object.values(this.hitSounds)) {
          if(hitSound == null) continue
          hitSound.unload()
        }
        this.hitSounds = {}
        this.timeSounds = []
        this.loadedSounds = 0
        this.totalSounds = 0
        for(let hitSound of Object.entries(event.detail.hitSounds)) {
          if(hitSound[1] == null)
            continue
          this.hitSounds[hitSound[0]] = new Howl({
            src: [hitSound[1]],
            rate: this.songRate,
          })
          this.totalSounds++
          this.hitSounds[hitSound[0]].once('load', () => {
            this.loadedSounds++
            if(this.loadedSounds == this.totalSounds)
              this.startSong()
          })
          this.hitSounds[hitSound[0]].once('loaderror', () => {
            this.hitSounds[hitSound[0]] = null
            this.loadedSounds++
            if(this.loadedSounds == this.totalSounds)
              this.startSong()
          })
        }
        for(let timeSound of event.detail.beatmap.timeSounds) {
          if(this.hitSounds[timeSound.name] == null) continue
          let localTimeSound = {
            start: false,
            startTime: timeSound.startTime,
            name: timeSound.name
          }
          this.timeSounds.push(localTimeSound)
        }
        for(let i = 0; i < scratchNotes.length; i++) {
          if(scratchNotes.peekAt(i).hitSound != null && this.hitSounds[scratchNotes.peekAt(i).hitSound] != null)
            this.timeSounds.push({
              start: false,
              startTime: scratchNotes.peekAt(i).startTime,
              name: scratchNotes.peekAt(i).hitSound
            })
        }
        this.timeSounds.sort((a,b) => a.startTime - b.startTime)

        if(this.loadedSounds == this.totalSounds)
          this.startSong()
      }
    },
    startSong() {
      this.loading = false
      this.playing = true
      this.playStartTime = Date.now() + this.countdownTime
      this.pauseStartTime = 0
      this.countdownStartTime = Date.now()
    },
    loadSkin() {
      this.skinData = {}

      if(info.skins[this.skin].noteColored) {
        this.skinData.noteColored = true
        
        this.skinData.lightingImage = new Image()
        this.skinData.lightingImage.src = info.skins[this.skin].lightingImage

        this.skinData.receptorImage = new Image()
        this.skinData.receptorImage.src = info.skins[this.skin].receptorImage

        this.skinData.receptorDownImage = new Image()
        this.skinData.receptorDownImage.src = info.skins[this.skin].receptorDownImage

        this.skinData.lnBodyImage = new Image()
        this.skinData.lnBodyImage.src = info.skins[this.skin].lnBodyImage

        this.skinData.lnCapImage = new Image()
        this.skinData.lnCapImage.src = info.skins[this.skin].lnCapImage

        this.skinData.noteImages = {}

        if(info.skins[this.skin].rotate) {
          this.skinData.rotate = info.skins[this.skin].rotate
        }
        let infoImages = Object.entries(info.skins[this.skin].noteImages)
        for(let i = 0; i < infoImages.length; i++) {
          this.skinData.noteImages[infoImages[i][0]] = new Image()
          this.skinData.noteImages[infoImages[i][0]].src = infoImages[i][1]
        }

      } else {
        let skinmode = this.keyMode
        if(skinmode == 8) {
          switch(this.bmsStyle) {
            case 'bmsnone':
              break;
            case 'bmsleft':
              skinmode = this.bmsStyle
              break;
            case 'bmsright':
              skinmode = this.bmsStyle
              break;
          }
          if(this.playing) {
            if(this.bmsLeft && skinmode == 'bmsright') {
              this.bmsLeft = false
              let temp = this.notes[0]
              this.notes[0] = this.notes[7]
              this.notes[7] = temp
            }
            else if(!this.bmsLeft && skinmode != 'bmsright') {
              this.bmsLeft = true
              let temp = this.notes[0]
              this.notes[0] = this.notes[7]
              this.notes[7] = temp
            }
          }
        }
        this.skinData.lightingImages = Array.from({length: info.skins[this.skin][skinmode].lightingImages.length}, () => new Image())
        for(let i = 0; i < this.skinData.lightingImages.length; i++) {
          this.skinData.lightingImages[i].src = info.skins[this.skin][skinmode].lightingImages[i]
        }

        this.skinData.receptorImages = Array.from({length: info.skins[this.skin][skinmode].receptorImages.length}, () => new Image())
        for(let i = 0; i < this.skinData.receptorImages.length; i++) {
          this.skinData.receptorImages[i].src = info.skins[this.skin][skinmode].receptorImages[i]
        }

        this.skinData.receptorDownImages = Array.from({length: info.skins[this.skin][skinmode].receptorDownImages.length}, () => new Image())
        for(let i = 0; i < this.skinData.receptorDownImages.length; i++) {
          this.skinData.receptorDownImages[i].src = info.skins[this.skin][skinmode].receptorDownImages[i]
        }

        this.skinData.lnBodyImages = Array.from({length: info.skins[this.skin][skinmode].lnBodyImages.length}, () => new Image())
        for(let i = 0; i < this.skinData.lnBodyImages.length; i++) {
          this.skinData.lnBodyImages[i].src = info.skins[this.skin][skinmode].lnBodyImages[i]
        }

        this.skinData.lnCapImages = Array.from({length: info.skins[this.skin][skinmode].lnCapImages.length}, () => new Image())
        for(let i = 0; i < this.skinData.lnCapImages.length; i++) {
          this.skinData.lnCapImages[i].src = info.skins[this.skin][skinmode].lnCapImages[i]
        }

        this.skinData.noteImages = Array.from({length: info.skins[this.skin][skinmode].noteImages.length}, () => new Image())
        for(let i = 0; i < this.skinData.noteImages.length; i++) {
          this.skinData.noteImages[i].src = info.skins[this.skin][skinmode].noteImages[i]
        }
      }

      /*this.skinData.comboImages = Array.from({length: info.skins[this.skin].comboImages.length}, () => new Image())
      for(let i = 0; i < this.skinData.comboImages.length; i++) {
        this.skinData.comboImages[i].src = info.skins[this.skin].comboImages[i]
      }*/

      this.skinData.hintImage = new Image()
      this.skinData.hintImage.src = info.skins[this.skin].hintImage

      this.skinData.judgementImages = Array.from({length: info.skins[this.skin].judgementImages.length}, () => new Image())
      for(let i = 0; i < this.skinData.judgementImages.length; i++) {
        this.skinData.judgementImages[i].src = info.skins[this.skin].judgementImages[i]
      }

      this.skinData.effectImages = Array.from({length: info.skins[this.skin].effectImages.length}, () => new Image())
      for(let i = 0; i < this.skinData.effectImages.length; i++) {
        this.skinData.effectImages[i].src = info.skins[this.skin].effectImages[i]
      }
    },
    loadKeyMode() {
      this.keysDown = []
      for(let i = 0; i < this.keyMode; i++) {
        this.keysDown.push(false)
      }
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
  },
  destroyed () {
    removeEventListener('keydown', this.processKeyDown)
    removeEventListener('keyup', this.processKeyUp)

    clearInterval(this.gameLoopInterval)
    //clearInterval(this.addNotesInterval)
  }
}
</script>

<style>
#gameCanvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
#canvasWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>