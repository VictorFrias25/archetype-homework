 import {initalData} from './constants.js'

// const initalData = require('./constants.js')

let searchButton = document.getElementById("searchbtn")
let searchQuery = document.getElementById("searchgame")
let displayDiv = document.getElementById("display")
let searchTerm

// let initalData = {
//     clientID: 'o5g2ocbydwh32d5uc45jsa1c08u0wh',
//     accessToken: 'Bearer d3cb1wkcm3qjliv5ktfnxs95432wtf'
//     // clientSecret: "1iiissmcjx90o03kvjnqtlxljqiw6d"
// }


function searchGame(){
    searchTerm = searchQuery.value
    const corsURL = 'https://cors-anywhere.herokuapp.com/' + encodeURI('https://api.igdb.com/v4/games')
    fetch(corsURL,{
        method: 'post',
        headers: {
            "Client-ID": initalData.clientID,
            "Authorization": initalData.accessToken
        },
        // body: JSON.stringify({
        //     query: `fields id, name, cover.url; search ${searchTerm}`
        // })
          body: `search "${searchTerm}"; fields name, cover.url; release_date.human; where version_parent = null;`
        //body: "fields *;"
    }).then(reponse => {
        if(!reponse.ok){
            throw new Error(`Http error. STATUS: ${reponse.status}`)
        }
        return reponse.json()
    }).then(reponseData => {
        console.log(`Success: ${reponseData}`)
        
        displayDiv.innerHTML = reponseData.map(item => {
            let cover = item.cover.url.replace("t_thumb", "t_cover_big")
            return `
            <div class ="item"> 
                <h3>${item.name}</h3>
                <img src= "https:${cover}">
            </div>
            `
            // the line -> <p>${item.id}</p> was removed as it is no longer needed.
        }).join('')



        // reponseData.array.forEach(element => {
        //     displayDiv.innerHTML = JSON.stringify(reponseData)
        // });


        // displayDiv.innerHTML =
        // `<h3>Here are your results!</h3>
        // <p>${JSON.stringify(reponseData)}</p>`
    }).catch(error => {
        console.error(`error! ${error}`)
        alert(`Error on request! ${error}`)
    })
}

searchButton.addEventListener("click", (event) =>{
    searchGame();
})

searchQuery.addEventListener("keydown", (event) =>{
    if(event.key === "Enter")
        searchGame();
})

// const corsURL = 'https://cors-anywhere.herokuapp.com/' + encodeURI('https://api.igdb.com/v4/games')
// fetch(corsURL,{
//     method: 'post',
//     headers: {
//         "Client-ID": initalData.clientID,
//         "Authorization": initalData.accessToken
//     },
//      body: `search "Halo"; fields name;`
//     //body: "fields *;"
// }).then(reponse => {
//     if(!reponse.ok){
//         throw new Error(`Http error. STATUS: ${reponse.status}`)
//     }
//     return reponse.json()
// }).then(reponseData => {
//     console.log(`Success: ${reponseData}`)
// }).catch(error => {
//     console.error(`error! ${error}`)
// })