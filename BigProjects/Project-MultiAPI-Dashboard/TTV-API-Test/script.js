import { initalData } from './constants.js'

let searchbtn = document.getElementById("searchbtn")
let searchinput = document.getElementById("query")
let searchTerm
let displayDiv = document.getElementById("content")

function ttvSearch(){
    searchTerm = searchinput.value
    const corsURL = 'https://cors-anywhere.herokuapp.com/' + encodeURI('https://api.twitch.tv/helix/search/categories')
    fetch(corsURL, {
        method: 'post',
        headers: {
            "Client-ID": initalData.clientID,
            "Authorization": initalData.accessToken
        },
        body: `query "${searchTerm}"`
    }).then(reply => {
        if(!reply.ok)
            throw new Error(`http error. status ${reply.status}`)
    }).then(replyData =>{
        console.log(`success: ${replyData}`)

    }).catch(error =>{
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