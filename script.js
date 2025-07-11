// console.log(`hello world`);
let currentSong = new Audio();
let play = document.querySelector("#play");
let currentSongIndex = 0;

let l = 0;
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad minutes and seconds with a leading zero if less than 10
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const paddedSeconds = (remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);

    return `${paddedMinutes}:${paddedSeconds}`;
}
async function getSongs() {
    let getting = await fetch(`http://127.0.0.1:3000/assets/Songs/`);
    let response = await getting.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let el = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 1; i < el.length; i++) {
        if (el[i].href.endsWith(".mp3")) {
            songs.push(el[i].href);
        }
    }
    return songs;
}
async function getArtists() {
    let getting = await fetch("http://127.0.0.1:3000/assets/Songs/");
    let response = await getting.text();
    let song = document.createElement("div");
    song.innerHTML = response;
    let artist = song.getElementsByTagName("a");
    let artists = [];
    for (let i = 1; i < artist.length; i++) {

        let pusher = ((artist[i].innerText.split(";"))[1].split(".mp3"))[0];
        artists.push(pusher);
    }
    return artists;
}
function playAudio(songs, index) {
    currentSong.src = songs;
    currentSongIndex = index;
    currentSong.play();
}

async function main() {
    let songs = await getSongs();
    let artists = await getArtists();

    currentSong.src = songs[0];
    document.querySelector(".songinfo").innerHTML = `${songs[0].split("/Songs/")[1].split(";")[0].replaceAll("%20", " ")}`;
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}`;
    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songduration").innerHTML = `${formatTime(currentSong.duration)}`;
    });
    l = songs.length;
    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (let i = 0; i < songs.length; i++) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <div class = "justToFormat">
                            <img src="assets/images/music.svg" style="filter: invert(1);" class="mnote">
                            <div class="details">
                                <div class="songName">${songs[i].split("/Songs/")[1].split(";")[0].replaceAll("%20", " ")}</div>
                                <div class="Artists">${artists[i]}</div>
                            </div>
                            </div>
                            <img src="assets/images/play.svg" class="playing" alt="play">
                        </li>`;
    }

    let play1 = Array.from(document.querySelectorAll(".playing"));


    let playbox = Array.from(document.querySelector(".songList").firstElementChild.getElementsByTagName("li"));
    for (let i = 0; i < songs.length; i++) {
        (playbox[i]).addEventListener("click", e => {
            document.querySelector(".songinfo").innerHTML = `${songs[i].split("/Songs/")[1].split(";")[0].replaceAll("%20", " ")}`;
            if (currentSong.paused) {
                playAudio(songs[i], i);
                play.src = "assets/images/pause.svg";
                play1[currentSongIndex].src = "assets/images/pause.svg";
            }
            else {
                currentSong.pause();
                play.src = "assets/images/play.svg";
                play1[currentSongIndex].src = "assets/images/play.svg";
            }

        });
    }
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}`;
        document.querySelector(".songduration").innerHTML = `${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = 100 * (currentSong.currentTime / currentSong.duration) + "%";
        document.querySelector(".done").style.width = 100 * (currentSong.currentTime / currentSong.duration) + "%";
        if(currentSong.currentTime == currentSong.duration){
            next();
        }
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(currentSong);
        document.querySelector(".circle").style.left = 100 * (e.clientX - 604) / (1296 - 604) + "%";
        document.querySelector(".done").style.width = 100 * ((e.clientX - 600) / (1296 - 600)) + "%";
        currentSong.currentTime = currentSong.duration * ((e.clientX - 600) / (1296 - 600));
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.duration * ((e.clientX - 600) / (1296 - 600)))}`;

    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {

            play.src = "assets/images/pause.svg";
            currentSong.play();
            play1[currentSongIndex].src = "assets/images/pause.svg";
        }
        else {
            // console.log(2);

            currentSong.pause();
            play.src = "assets/images/play.svg";
            play1[currentSongIndex].src = "assets/images/play.svg";
        }
    });
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // console.log(document.querySelector("#prev"));
    document.querySelector("#prev").addEventListener("click", () => {
        let status = currentSong.paused;

        currentSong.pause();
        play.src = "assets/images/play.svg";
            play1[currentSongIndex].src = "assets/images/play.svg";

        if (currentSongIndex > 0) {
            currentSongIndex--;
        }
        else {
            currentSongIndex = songs.length-1;
        }
        currentSong.src = songs[currentSongIndex];
        document.querySelector(".songinfo").innerHTML = `${songs[currentSongIndex].split("/Songs/")[1].split(";")[0].replaceAll("%20", " ")}`;
        if(status == false){
            currentSong.play();
            play.src = "assets/images/pause.svg";
            play1[currentSongIndex].src = "assets/images/pause.svg";

        }
    })
    document.querySelector("#next").addEventListener("click", next);
    function next(){
        let status = currentSong.paused;
        if(currentSong.ended){
            status = false;
            console.log(status);
            
        }
        currentSong.pause();
        play.src = "assets/images/play.svg";
        play1[currentSongIndex].src = "assets/images/play.svg";

        if (currentSongIndex < songs.length-1) {
            currentSongIndex++;
        }
        else {
            currentSongIndex = 0;
        }
        currentSong.src = songs[currentSongIndex];
        document.querySelector(".songinfo").innerHTML = `${songs[currentSongIndex].split("/Songs/")[1].split(";")[0].replaceAll("%20", " ")}`;
        if(status == false){
            currentSong.play();
            play.src = "assets/images/pause.svg";
            play1[currentSongIndex].src = "assets/images/pause.svg";

        }
    }
    console.log(document.querySelector(".vol").children[1]);
    
    document.querySelector(".vol").children[1].addEventListener("change",(e)=>{
        currentSong.volume = (e.target.value)/100;
        // console.log((e.target.value)/100);
        
    })
}

main();

