import { twitch } from "./constants.js"
import { youtube } from "./constants.js"
$(document).ready(function(){
    //  alert(`jquery loaded`)
    let searchQuery = $(".query")
    let displayDiv = $(".displayData")
    let ogCard = $("#original-card")
    let gameCards = $(".gameResults")
    let searchTerm

    function searchGame(){
        ogCard.addClass("d-none")
        displayDiv.removeClass("d-none")
        displayDiv.html(`
        <div class="card border border-dark w-50 mx-auto mt-5 bg-primary text-white">
        <div class="card-header">THIS IS NOW A NEW CARD!</div>
        <div class="card-body">Type the title of a game you're interested in, and we'll do the rest.
          We'll help you find the right game you're looking for and show you information along with some great
          videos on it!
        </div>
      </div>
        `)
        alert(`succuess`)
    }

    function gameDBSearch(){
        searchTerm = searchQuery.val()
        const corsURL = 'https://cors-anywhere.herokuapp.com/' + encodeURI('https://api.igdb.com/v4/games')
            fetch(corsURL,{
                method: 'post',
                headers: {
                    "Client-ID": twitch.clientID,
                    "Authorization": twitch.accessToken
                },
                  body: `search "${searchTerm}"; fields name, summary, rating, cover.image_id; where version_parent = null;`
            }).then(response => {
                if(!response.ok){
                    throw new Error(`Http error. STATUS: ${response.status}`)
                }
                // console.log(response.json)
                return response.json()
            }).then(responseData => {
                console.log(`Success: ${responseData}`)

                ogCard.addClass("d-none")
                displayDiv.removeClass("d-none")

                let filtered = []

                responseData.forEach(element => {
                    if(element.rating){
                        filtered.push(element)
                    }
                })
                
                filtered.sort((a, b) => b.rating - a.rating)

                console.log(`sorted results: ${filtered}`)

                console.log(`here are lengths of both arrays. length of OG data is ${responseData.length} and the length of filtered is ${filtered.length}`)

                let gcards = filtered.map(item =>{
                    let formattedRating = item.rating.toFixed(1)
                    let cover = item.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${item.cover.image_id}.jpg` : 'https://via.placeholder.com/150';
                    return  `
                    <div class="card text-dark w-25">
                        <img src="${cover}" class="card-img-top">
                        <h5 class="card-header">${item.name}</h5>
                        <div class="card-body">
                            <p class="card-text">${item.summary}</p>
                            <p class="card-text"><small class="text-muted">${formattedRating}/100</small></p>
                        </div>
                    </div>
                    `
                }).join('')

                gameCards.html(gcards)

            }).catch(error => {
                console.error(`error! ${error}`)
                alert(`Error on request! ${error}`)
            })


        
    }

    searchQuery.on("keydown", (event) =>{
        if(event.key === "Enter"){
            event.preventDefault()
            gameDBSearch()
            console.log(`enter detected!`)
        }
    })
})