const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'BAO_PLAYER'

const player = $(".player");
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress');
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app ={
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs :[
        {
            name: 'Bài hát Gió Nổi Lên Rồi 起风了',
            singer : 'Châu Thâm (Zhou Shen)',
            path : './mp3/Bài hát Gió Nổi Lên Rồi 起风了 - Châu Thâm (Zhou Shen).mp3',
            image : './mp3/Bài hát Gió Nổi Lên Rồi 起风了 - Châu Thâm (Zhou Shen).jpg'
        },
        {
            name: 'Bài hát Nữ Nhi Tình 女儿情',
            singer : 'Đồng Lệ',
            path : './mp3/Bài hát Nữ Nhi Tình 女儿情 - Đồng Lệ.mp3',
            image : './mp3/Bài hát Nữ Nhi Tình 女儿情 - Đồng Lệ.jpg'
        },
        {
            name: 'Em Là Cố Chấp Duy Nhất Của Anh 你是我唯',
            singer : '的執著',
            path : './mp3/Em Là Cố Chấp Duy Nhất Của Anh 你是我唯一的執著.mp3',
            image : './mp3/Em Là Cố Chấp Duy Nhất Của Anh 你是我唯一的執著.jpg'
        },
        {
            name: 'Endless Love',
            singer : 'Thành Long (Jackie Chan), Kim Hee Sun',
            path : './mp3/Endless Love - Thành Long (Jackie Chan), Kim Hee Sun.mp3',
            image : './mp3/Endless Love - Thành Long (Jackie Chan), Kim Hee Sun.jpg'
        },
        {
            name: 'Hello',
            singer : 'Lionel Richie',
            path : './mp3/Hello - Lionel Richie.mp3',
            image : './mp3/Hello - Lionel Richie.jpg'
        },
        {
            name: 'Họa Tình',
            singer : 'Diêu Bối Na',
            path : './mp3/Họa Tình - Diêu Bối Na.mp3',
            image : './mp3/Họa Tình - Diêu Bối Na.jpg'
        },
        {
            name: 'Là Tự Em Đa Tình',
            singer : 'Hồ Dương Lâm (Joy Hu)',
            path : './mp3/Là Tự Em Đa Tình - Hồ Dương Lâm (Joy Hu).mp3',
            image : './mp3/Là Tự Em Đa Tình - Hồ Dương Lâm (Joy Hu).jpg'
        },
        {
            name: 'My Heart Will Go On ',
            singer : 'Celine Dion',
            path : './mp3/My Heart Will Go On - Celine Dion.mp3',
            image : './mp3/My Heart Will Go On  1- Celine Dion .jpg'
        },
        {
            name: 'Tay Trái Chỉ Trăng',
            singer : 'Tay Trái Chỉ Trăng',
            path : './mp3/Tay Trái Chỉ Trăng.mp3',
            image : './mp3/Tay Trái Chỉ Trăng.jpg'
        },
        {
            name: 'Woman In Love',
            singer : 'Barbra Streisand',
            path : './mp3/Woman In Love - Barbra Streisand.mp3',
            image : './mp3/Woman In Love - Barbra Streisand.jpg'
        },
        {
            name: 'Yesterday Once More',
            singer : 'The Carpenters',
            path : './mp3/Yesterday Once More - The Carpenters.mp3',
            image : './mp3/Yesterday Once More - The Carpenters.jpg'
        }
    ],
    setConfig : function(key,value){
        this.config[key] = value,
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render : function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })
        playlist.innerHTML =htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents : function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay // dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform : 'rotate(360deg)'}
        ],{ 
            duration : 10000, //10s
            iterations : Infinity
        })


        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;        
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
            audio.pause();
            }else{
            audio.play();
            }
        }

        // Khi bài hát được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi bài hát pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime/ audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua nhạc
        progress.onchange = function(e){
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        // Khi next bài nhạc
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            } else{
                _this.nextSong()
            }    
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài nhạc
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            } else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Bật tắt random Song
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý khi click vào repeat
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next bài nhạc khi audio ended
        audio.onended = function(){
            if (_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        // Lắng nghe khi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(
                songNode || e.target.closest('.option') ) {
                //Xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number (songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()                   
                    audio.play()
                    
                }
                //Xử lý khi click vào option
            }
        }
    },
        // Xử lý kéo xuống bài nhạc đang được phát
        scrollToActiveSong: function(){
            setTimeout(() => {
                if($('.song.active').dataset.index < 4){
                    $('.song.active').scrollIntoView({block:"end"})
                }else{
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block:'nearest',
                    })
                }
                
            }, 300);

        },

    loadCurrentSong : function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    loadConfig: function(){

        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function(){
        this.currentIndex ++
        if( this.currentIndex >= this.songs.length -1){
            this.currentIndex =0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex --
        if( this.currentIndex < 0 ){
            this.currentIndex = this.songs.length -1 
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        var newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex == this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start : function(){
        // Gán cấu hình config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        
        // Lắng nghe và sử lý các sự kiện ( Dom Event)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render Playlist
        this.render();

        // Hiển thị trạng thái ban đầu button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
   
}

app.start();