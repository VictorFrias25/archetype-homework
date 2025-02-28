import {googleAPI} from './constants.js'

let searchbtn = document.getElementById("searchbtn")
let searchinput = document.getElementById("searchinput")
let loginbtn = document.getElementById("login")
let displayDiv = document.getElementById("display")
let searchTerm

function newYTsearch(){
    searchTerm = searchinput.value
    fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${googleAPI}`, {
    }).then((reply) => reply.json()).then((data) =>{
        console.log(data)
        data.items.forEach((element) => {
            displayDiv.innerHTML += `
            <a target="_blank" href="https://www.youtube.com/watch?v=${element.id.videoId}">
            <img src="${element.snippet.thumbnails.high.url}" />
            <h4>${element.snippet.title}</h4> </a>
            `
        });
    })
}

searchbtn.addEventListener("click", (event) => {
    newYTsearch()
})
searchinput.addEventListener("keydown", (event) =>{
    if(event.key === "Enter")
        newYTsearch()
})