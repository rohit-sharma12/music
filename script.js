console.log('hello coder ');
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div')
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    return songs

}
const playMusic = (track, pause=false) => {
    currentSong.src = `/${folder}/` + track
    if(!pause){
        currentSong.play()
        play.src = 'pause.svg'
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track)
    document.querySelector('.songtime').innerHTML = '00:00/00:00'
}
async function main() {

    songs = await getSongs()
   playMusic(songs[0], true)

    let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><i class="fa-solid fa-music"></i>
                            <div class="info">
                                <div>${song.replaceAll('%20', '')}</div>
                                <div>Rohit</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                 <img src="play.svg" alt="">
                            </div>
        </li>`
    }
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())

        })
        // console.log(e.querySelector('.info').firstElementChild.innerHTML.trim());
       })

    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = 'pause.svg'
        }
        else {
            currentSong.pause()
            play.src = 'play.svg'
        }
    })
    //time update
    currentSong.addEventListener('timeupdate', () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime/ currentSong.duration) * 100 + '%'
    })
    document.querySelector('.seekbar').addEventListener('click', e=> {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + '%'
        currentSong.currentTime = ((currentSong.duration)* percent)/100
    })

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0'
    })

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-120%'
    })

    //work on prev and nexr button

    previous.addEventListener('click',() => {
        console.log('prevoius song');
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split('/').slice(-1) [0])
        if((index-1) >= 0) {
            playMusic(songs[index-1])
        }
    })
    next.addEventListener('click',() => {
        console.log('next song');
        let index = songs.indexOf(currentSong.src.split('/').slice(-1) [0])
        if((index+1) < songs.length) {
            playMusic(songs[index+1])
        }
        
    })

    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        console.log(e.target.value, '/ 100')
        currentSong.volume = parseInt(e.target.value)/100
        
    })
}

main()
