console.log("lets write js")

let currentSong = new Audio()
let songs
let currFolder

//convert seconds to minutes of song duration
function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return "00:00"
    }
    const minutes = Math.floor(seconds /60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(folder){
    currFolder = folder
    let a = await fetch(`https://github.com/RamakrushnaBarik/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show all the song in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = " "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div> ${song.replaceAll("%20"," ")}</div>
                        </div>
                        <div class="playnow">
                            <span>play now</span>
                            <img class="invert" src="play.svg" alt="">
                        </div>
                    </li>`
    }

    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        }) 
    })
    return songs
    
}

// playing the music 
const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/tree/main/songs/spotify_clone_project/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }
    
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
} 

// async function displayAlbums(){
//     let a = await fetch(`http://127.0.0.1:5500/spotify_clone_project/songs/`)
//     let response = await a.text()
//     let div = document.createElement("div")
//     div.innerHTML = response
//     let anchors = div.getElementsByTagName("a")
//     let array = Array.from(anchors)
//        for (let index = 0; index < array.length; index++) {
//         const e = array[index];
        
//        }
//         if(e.href.includes("/spotify_clone_project/songs")){
//             let folder = e.href.split("/").slice(-1)[0]
//             //get the metadataof the folder
//             let a = await fetch(`http://127.0.0.1:5500/spotify_clone_project/songs/${folder}/info.json`)
//             let response = await a.json()
//             console.log(response)
//             card-container.innerHTML = card-container.innerHTML + <div data-folder="ncs" class="card">
//             <div class="play">
//                 <img class="invert" src="play.svg" alt="">
//             </div>
//             <img class="imgg" src="spotify_clone_project/songs/${folder}/cover.jpg" alt="">
//             <h2>Happy Beats</h2>
//             <p>Hits to boost your mood and fil you with happiness</p>
//         </div>
//         }
//     })
// }

async function main(){
    
    // get the list of all songs
    await getSongs("spotify_clone_project/songs/ncs")
    playMusic(songs[0] , true)

    //display all the albumes on the page
    // displayAlbums()

    // attach an event listener to play , next and privious
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "playy.svg"
        }
    })

    // listener for time update event of song
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime , currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        //seekbar move wit play music duration
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)* 100 + "%"
    })
    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)* 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime =((currentSong.duration)*percent)/100
    })
    //add an eventlisten to hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //add an eventlisten to close svg or button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    //add event listener to privious and next button
    previous.addEventListener("click", ()=>{
        console.log('work')
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })
    next.addEventListener("click", ()=>{
        console.log('work1')
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })

    // add an event to volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`tree/main/songs/spotify_clone_project/songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
    // add event listener to mute volume
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = 0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value=50
        }
    })

}
main()


