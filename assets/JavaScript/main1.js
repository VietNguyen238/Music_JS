const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const cdThumb = $('.cd-thumb')
const title = $('.dashboard header h2')
const audio = $('#audio')
const togglPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const cd = $('.cd')

const app = {
    isCurrentIndex: 0,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Mặc mộc',
            singer: 'Phạm Nguyên Ngọc',
            path: '/assets/music/song1.mp3',
            image: '/assets/img/song1.jpg',
        },
        {
            name: 'Gió',
            singer: 'Jack',
            path: '/assets/music/song2.mp3',
            image: '/assets/img/song2.jpg',
        },
        {
            name: 'Nhất trên đời',
            singer: 'VANH',
            path: '/assets/music/song3.mp3',
            image: '/assets/img/song3.jpg',
        },
        {
            name: 'Không phải',
            singer: 'Duy Tân',
            path: '/assets/music/song4.mp3',
            image: '/assets/img/song4.jpg',
        },
        {
            name: 'Vicetone',
            singer: 'Naveda',
            path: '/assets/music/song5.mp3',
            image: '/assets/img/song5.jpg',
        },
        {
            name: 'Horang Suwolga',
            singer: 'Mộng Nhiên',
            path: '/assets/music/song6.mp3',
            image: '/assets/img/song6.jpg',
        },
        {
            name: 'Hôm nay em cưới rồi',
            singer: 'Khải Đăng',
            path: '/assets/music/song7.mp3',
            image: '/assets/img/song7.jpg',
        },
    ],

    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.isCurrentIndex]
            }
        })
    },

    render: function () {
        const html = this.songs.map((song, index) => {
            return `<div class="song ${index === this.isCurrentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb" style="background-image: url(${song.image})">
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
        playlist.innerHTML = html.join('')
    },

    handleEvent: function () {
        const _this = this
        const heightCdThumb = cdThumb.offsetHeight

        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(180deg)'
        }, {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // play and pause song
        togglPlay.onclick = () => {
            if (audio.paused) {
                audio.play()
                player.classList.add('playing')
                cdThumbAnimate.play()
            } else {
                audio.pause()
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
        }

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newScroll = heightCdThumb - scrollTop

            cd.style.width = newScroll > 0 ? newScroll + 'px' : 0
            cd.style.opacity = newScroll / scrollTop
            console.log(newScroll / scrollTop)
        }

        // update song time 
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPersent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPersent
            }
        }

        // 
        progress.oninput = (e) => {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        btnNext.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            _this.scrollToActiveView()
            player.classList.add('playing')
            audio.play()
        }

        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            _this.scrollToActiveView()
            player.classList.add('playing')
            audio.play()
        }

        audio.onended = () => {
            if (_this.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
        }

        btnRandom.onclick = () => {
            this.isRandom = !this.isRandom
            btnRandom.classList.toggle('active', this.isRandom)
        }

        btnRepeat.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }

        // Lắng nghe hành vi click vào playList
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.isCurrentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lý khi click vào Option
                if (e.target.closest('.option')) {

                }
            }
        }
    },

    scrollToActiveView: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: "smooth", 
                block: "end", 
                inline: "nearest"
            })
        }, 500)
    },

    loadCurrentSong: function () {
        title.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.isCurrentIndex++
        if (this.isCurrentIndex >= this.songs.length) {
            this.isCurrentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.isCurrentIndex--
        if (this.isCurrentIndex < 0) {
            this.isCurrentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.isCurrentIndex)
        this.isCurrentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        this.handleEvent()
        this.defineProperty()
        this.render()
        this.loadCurrentSong()

    }

}

app.start()