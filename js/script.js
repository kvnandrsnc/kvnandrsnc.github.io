// select all required tags or elements
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

// load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    // calling load music function once window loaded
    loadMusic(musicIndex);
    playingNow();
})

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `img/${allMusic[indexNumb - 1].img}.jpeg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
    playingNow();
}

// play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// next music function
function nextMusic(){
    // increment of index by 1
    musicIndex++;
    // if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// prev music function
function prevMusic(){
    // decrement of index by 1
    musicIndex--;
    // if musicIndex is less than 1 then musicIndex will be array length so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play or music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPause = wrapper.classList.contains("paused");
    // if isMusicPaused is true then call pauseMusic else call playMusic 
    isMusicPause ? pauseMusic() : playMusic();
    playingNow();
});

// next music btn event
nextBtn.addEventListener("click", () => {
    // calling next music function
    nextMusic(); 
});

// prev music btn event
prevBtn.addEventListener("click", () => {
    // calling prev music function
    prevMusic(); 
});

// update progress bar with according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    // getting current time of song
    const currentTime = e.target.currentTime;
    // getting total duration of song
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        // adding 0 if sec is less than 10
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }

        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);

    // adding 0 if sec is less than 10
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    // getting width of the progress bar
    let progressWidthval = progressArea.clientWidth;
    // getting offset x value
    let clickedOffSetX = e.offsetX;
    // getting song total duration
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

// work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; // getting the innerText of icon
    // let's different changes on different icon click using switch
    switch(getText){
        case "repeat":
            // if this icon is repeat the change it to repeat_one
            repeatBtn.innerText = "repeat_one"
            repeatBtn.setAttribute("title", "Song looped")
            break;
        case "repeat_one":
            // if this icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle"
            repeatBtn.setAttribute("title", "Playback shuffle")
            break;
        case "shuffle":
            // if this icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    }
});

// above we just changed the icon, now let's work on what to do after the song ended
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText; // getting the innerText of icon
    // let's different changes on different icon click using switch
    switch(getText){
        case "repeat":
            // if this icon is repeat then simply we call the nextMusic function so the next song will play
            nextMusic();
            break;
        case "repeat_one":
            // if this icon is repeat_one then we'll change the current playing song current time to 0 so song will play from beginning
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic(); 
            break;
        case "shuffle":
            // generating random index between the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex); // this loop run until the next random number won't be the same of current music index
            musicIndex = randIndex; // passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex); // calling loadMusic function
            playMusic(); // calling playMusic function
            // playingNow();
            break;
    }
    
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    // pass the song name, artist from the array to li
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration"></span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);

        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }

        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // adding time duration attribute which we'll use below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

// play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        // remove playing class from all other li expect the last one which is clicked
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            // get that audio duration value and pass to .audio-duration innerText
            let adDuration = audioTag.getAttribute("t-duration");
            // passing t-duration value to audio duration innerText
            audioTag.innerText = adDuration;
        }

        // if there is an li tag which li-index is equal to musicIndex then this music is playing now and we'll style it
        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        // adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// play song on li click
function clicked(element){
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    // passing that li index to musicIndex
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}









