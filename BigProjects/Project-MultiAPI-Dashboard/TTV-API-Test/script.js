import { initalData } from './constants.js'

let searchbtn = document.getElementById("searchbtn")
let searchinput = document.getElementById("query")
let searchTerm
let displayDiv = document.getElementById("content")

function ttvSearch(){
    searchTerm = searchinput.value
    fetch(`https://cors-anywhere.herokuapp.com/https://api.twitch.tv/helix/search/categories?query=${searchTerm}`,{
        method: 'get',
        headers: {
            "Client-ID": initalData.clientID,
            "Authorization": initalData.accessToken
        }
    }).then(reply => {
        if(!reply.ok)
            throw new Error(`http error. status ${reply.status}`)
        return reply.json()
    }).then(replyData => {
        console.log(replyData.data)
        displayDiv.innerHTML = replyData.data.map(item => {
            let cover = item.box_art_url.replace("{width}", "200").replace("{height}", "300")
            return `
            <div class="game-cat">
                <a href="https://www.twitch.tv/directory/game/${encodeURIComponent(item.name)}" target="_blank">
                 <img src="${cover}" width="144" height="192">
                </a>
                <h3>${item.name}</h3>
            </div>
            `
        }).join('')

    }).catch(error => {
        console.log(error)
        alert(error)
    })
}

searchbtn.addEventListener("click", (event) => {
    ttvSearch()
})

searchinput.addEventListener("keydown", (event) => {
    if(event.key === "Enter")
        ttvSearch()
})