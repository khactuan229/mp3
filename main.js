/**
 * 1 Render songs  OK
 * 2 Scroll top   OK
 * 3 Play/ pause/ seek OK
 * 4 Cd rotate OK
 * 5 Next / prev
 * 6 Random
 * 7 Repeat when ended
 * 8 Active song
 * 9 Scroll active song in to view
 * 10 Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $('.playlist')
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play') 
const player = $('.player');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const PLAYER_NAME = 'name'
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_NAME)) || {},
    songs:[
        {
            name: 'Có sẽ trả mà',
            singer:'Bray',
            image:'./assets/img/image song1.png',
            part:'./assets/music/song1.mp3'
        },
        {
            name: 'Thói quen',
            singer:'Bray',
            image:'./assets/img/image song2.png',
            part:'./assets/music/song2.mp3'
        },
        {
            name: 'Thuốc lá và phê',
            singer:'Bray',
            image:'./assets/img/image song3.png',
            part:'./assets/music/song3.mp3'
        },
        {
            name: 'Ex hate me',
            singer:'Bray',
            image:'./assets/img/image song4.png',
            part:'./assets/music/song4.mp3'
        },
        {
            name: 'Đừng đỗ lỗi cho bọn trẻ',
            singer:'Bray',
            image:'./assets/img/image song5.png',
            part:'./assets/music/song5.mp3'
        },
        {
            name: 'Cưới thôi',
            singer:'Bray',
            image:'./assets/img/image song6.png',
            part:'./assets/music/song6.mp3'
        },
        {
            name: 'Để tôi ôm em bằng giai điệu này',
            singer:'Kai Dinh',
            image:'./assets/img/image song7.png',
            part:'./assets/music/song7.mp3'
        },
        {
            name: 'Hãy để anh được cùng em đau',
            singer:'SIVAN',
            image:'./assets/img/image song8.png',
            part:'./assets/music/song8.mp3'
        },
        {
            name: 'Lạc trôi',
            singer:'SonTungMTP',
            image:'./assets/img/image song9.png',
            part:'./assets/music/song9.mp3'
        },
        {
            name: 'Vài câu nói có khiến người thay đổi',
            singer:'GREY',
            image:'./assets/img/image song10.png',
            part:'./assets/music/song10.mp3'
        },
    ],
    setconfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_NAME, JSON.stringify(this.config));
    },
    render:function(){
        const _this = this;
        var htmls = this.songs.map(function(song, index){
            return `<div class="song ${index === _this.currentIndex?'active':''}"data-index = "${index}">
            <div class="thumb"
             style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })

        playList.innerHTML = htmls.join('')
    },
    halderEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        // xu ly cd to nho
        document.onscroll = function(){
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : '0'
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xu ly khi cd quay
          const cdThumbAnimate = cdThumb.animate([{
                transform: 'rotate(360deg)'
            }], {
                duration: 10000,
                iterations: Infinity
            })
            cdThumbAnimate.pause()

        // xu ly khi click play
        playBtn.onclick = function(e) {
            if(_this.isPlaying) {
                audio.pause()
            }
            else{
                audio.play()
            }
        }

        // khi song on
        audio.onplay = function(e) {
            _this.isPlaying = true
            cdThumbAnimate.play()
            player.classList.add('playing')
        }

        //khi song pause
        audio.onpause = function(e) {
            _this.isPlaying = false
            cdThumbAnimate.pause()
            player.classList.remove('playing')
        }
        // khi tien do bai hat thay doi
        audio.ontimeupdate = function(e) {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // xu ly khi seek
        progress.oninput = function(e) {
            const seek = audio.duration / 100 * e.target.value
            audio.currentTime = seek
        }

        // xu khi  khi next
        nextBtn.onclick = function(e) {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToView()
        }

        //xu ly khi prev
        prevBtn.onclick = function(e) {
            if(_this.isRandom) {
                _this.playRandomSong()
            }else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToView()

        }

        //xu ly khi click random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setconfig('isRandom' , _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        } 

        //xu ly khi click repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setconfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //xu ly khi next song khi ended song
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //lang nghe hanh vi click vao playList
        playList.onclick = function(e) {
            songNote = e.target.closest('.song:not(.active)')
            if(songNote || e.target.closest('.option')) {
                // xu ly khi click vao song
                if(songNote) {
                    _this.currentIndex = Number(songNote.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // xu ly khi click vao option
            }
        }
    },

    defindPropreties:function(){
        Object.defineProperty(this, 'currentSong', {
            get:function(){
                return this.songs[this.currentIndex]
            } 
        })
    },
    scrollToView:function(){
        const _this = this
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth', 
                block: _this.currentIndex < 2 ? 'center' : 'center'
            })
        }, 200);
    },
    loadConfig: function() {
        this.isRandom = this.isRandom.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong:function(){
        const heading = $('header h2')
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.part
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1 
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex  = Math.floor(Math.random()*this.songs.length)
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(this.currentIndex == newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    
    start: function(){  
        //loadconfig
        this.loadConfig() 
        // dinh nghia thuoc tinh
        this.defindPropreties()
        // render ra man hinh
        this.render()
        // xu ly su kien
        this.halderEvents()
        // loadCurrentSong
        this.loadCurrentSong()

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }   

}


app.start()