 import {initalData} from './constants.js'


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
          body: `search "${searchTerm}"; fields name, cover.image_id; where version_parent = null;`
    }).then(response => {
        if(!response.ok){
            throw new Error(`Http error. STATUS: ${response.status}`)
        }
        // console.log(response.json)
        return response.json()
    }).then(responseData => {
        console.log(`Success: ${responseData}`)
        displayDiv.innerHTML = responseData.map(item => {
            let cover = item.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.cover.image_id}.jpg` : 'https://via.placeholder.com/150';
            return `
            <div class ="item"> 
                <h3>${item.name}</h3>
                <img src= "${cover}">
                <button>☆ favorite ☆</button>
            </div>
            `
        }).join('')
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