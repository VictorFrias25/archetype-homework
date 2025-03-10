import { twitch } from "./constants.js"
import { youtube } from "./constants.js"
$(document).ready(function(){
    //  alert(`jquery loaded`)
    let searchQuery = $(".query")
    let displayDiv = $(".displayData")
    let ogCard = $("#original-card")
    let gameCards = $(".gameResults")
    let ytDiv = $(".YTResults")
    let ttvDiv = $(".TTVResults")
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
        // const corsURL = 'https://cors-anywhere.herokuapp.com/' + encodeURI('https://api.igdb.com/v4/games')
         const corsURL = 'https://proxy.cors.sh/' + encodeURI('https://api.igdb.com/v4/games')
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
                    return `
                    <button type="button" class="col-md-3 p-1 btn btn-primary searchYT" data-game="${item.name}" data-cover="${cover}" data-summary="${item.summary}" data-rating="${formattedRating}">
                    <div class="card text-dark" style="height: 240px">
                     <div class="row g-0">
                      <div class="col-md-4">
                       <img src="${cover}" class="img-fluid h-100 w-100 rounded-start" style="object-fit: contain">
                      </div>
                      <div class="col-md-8">
                       <div class="card-body">
                        <p class="card-header bg-white font-weight-bolder h-40" style="margin-top: 0; height: 50px">${item.name}</p>
                        <div class="overflow-y-auto" style="overflow-y: auto; max-height: 120px;">
                         <p class="card-text">${item.summary}</p>
                        </div>
                        <p class="card-text"><small class="text-body-secondary">${formattedRating}/100</small></p>
                       </div>
                      </div>
                     </div>
                    </div>
                    </button>
                    `
                }).join('')

                gameCards.html(gcards)

            }).catch(error => {
                console.error(`error! ${error}`)
                alert(`Error on request! ${error}`)
            })
    }


    function youtubeSearch(gameTitle){
        fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${gameTitle}&key=${googleAPI}`, {
            }).then((reply) => reply.json()).then((data) =>{
                console.log(data)
                data.items.forEach((element) => {
                    // displayDiv.html( `
                    // <a target="_blank" href="https://www.youtube.com/watch?v=${element.id.videoId}">
                    // <img src="${element.snippet.thumbnails.high.url}" height="200" width="300"/>
                    // <h4>${element.snippet.title}</h4> </a>
                    // `)

                    gameCards.html(`
                    <button class="col-md-3 btn" target="_blank" href="https://www.youtube.com/watch?v=${element.id.videoId}">
                    <div class="card text-dark" style="height: 240px">
                     <img src="${element.snippet.thumbnails.high.url}" class="card-img-top">
                     <h6 class="card-title">${element.snippet.title}</h6>
                    </div>
                    </button>    
                        `)
                });
            })
    }

    function youtubeAjaxSearch(gameTitle){
        $.ajax({
            url: "https://youtube.googleapis.com/youtube/v3/search",
            method: "GET",
            data:{
                part: "snippet",
                q: gameTitle,
                type: "video",
                maxResults: 9,
                key: youtube
            },
            success: function(reply){
                console.log(reply)
                displayYT(reply.items)
            },
            error: function(error){
                console.error(`Youtube API error: ${error}`)
                alert("Failed to fetch videos!")
            }
        })
    }

    function ttvAjaxSearch(gameTitle){
        $.ajax({
            url: "https://api.twitch.tv/helix/search/categories",
            method: "GET",
            headers:{
                "Client-ID": twitch.clientID,
                "Authorization": twitch.accessToken
            },
            data:{
                query: gameTitle
            },
            // dataType: "json",
            success: function(response){
            console.log("Full array:", response)

            let exactMatch = response.data.find(game => game.name.toLowerCase() === gameTitle.toLowerCase())

            if (exactMatch) {
                console.log("Exact Match Found:", exactMatch)
                console.log(`Game ID: ${exactMatch.id}`)
                ttvLiveStreamsAjax(exactMatch.id)
            } else {
                console.log("No exact match found.")
            }
            },
            error: function(error){
                console.error(`ttv error: ${error}`)
            }
        })
    }

    function ttvLiveStreamsAjax(gameId) {
        $.ajax({
            url: "https://api.twitch.tv/helix/streams",
            method: "GET",
            headers: {
                "Client-ID": twitch.clientID,
                "Authorization": twitch.accessToken
            },
            data: {
                game_id: gameId, // Search streams by the game's ID
                first: 10 // Limit the number of results (max 100)
            },
            success: function(response) {
                console.log("Live Streams:", response)
    
                if (response.data.length > 0) {
                    response.data.forEach(stream => {
                        console.log(`🔴 Live: ${stream.user_name} - Viewers: ${stream.viewer_count}`)
                        console.log(`URL: https://www.twitch.tv/${stream.user_name}`)
                        displayTTV(response.data)
                    });
                } else {
                    console.log("No live streams found for this game.")
                }
            },
            error: function(error) {
                console.error(`Twitch API Error: ${error.responseText}`)
            }
        });
    }

    function displayYT(videos) {
        let videoHTML = videos.map(video => `
            <div class="col-md-4">
                <div class="card">
                    <iframe class="card-img-top" width="100%" height="200" 
                        src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" 
                        allowfullscreen>
                    </iframe>
                    <div class="card-body text-dark">
                        <h5 class="card-title">${video.snippet.title}</h5>
                    </div>
                </div>
            </div>
        `).join('');
        
        $(".displayDataHead").html(`
          <div class="card-header border-bottom row">
          <h3 class="col">YouTube Results for ${searchTerm}</h3>
          <div class="form-check form-switch col-2">
           <input class="form-check-input" type="checkbox" role="switch" id="YTorTTV">
           <label class="form-check-label" for="YTorTTV">YT/TTV</label>
          </div>
          </div>
            `)
        ytDiv.removeClass("d-none")
        ytDiv.html(`<div class="row">${videoHTML}</div>`);
        }

    function displayTTV(streams){
        console.log(streams)
        // ytDiv.addClass("d-none")
        // ttvDiv.removeClass("d-none")
        let streamHTML = streams.map(stream => `
            <div class="col-md-4">
                <div class="card">
                    <iframe class="card-img-top" width="100%" height="200" 
                        src="https://player.twitch.tv/?channel=${stream.user_name}&parent=localhost" 
                        frameborder="0" allowfullscreen>
                    </iframe>
                    <div class="card-body text-dark">
                        <h5 class="card-title">${stream.user_name}</h5>
                        <p class="card-text">Viewers: ${stream.viewer_count}</p>
                        <a href="https://www.twitch.tv/${stream.user_name}" target="_blank" 
                            class="btn btn-primary">Watch on Twitch</a>
                    </div>
                </div>
            </div>
        `).join('')

        ttvDiv.html(streamHTML)
    }

    function displayFavorites() {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
        if (favorites.length === 0) {
            $(".favorites-list").html("<p>No favorite games yet.</p>");
            return;
        }
    
        let favHTML = favorites.map(game => `
            <div class="favorite-item">
                <p>${game} <button class="btn btn-danger remove-favorite" data-game="${game}">❌ Remove</button></p>
            </div>
        `).join('');
    
        $(".favorites-list").html(favHTML);
    }


    searchQuery.on("keydown", (event) =>{
        if(event.key === "Enter"){
            event.preventDefault()
            gameDBSearch()
            console.log(`enter detected!`)
        }
        // if(event.key ==="Escape"){
        //     event.preventDefault()
        //     ttvAjaxSearch(searchQuery.val())
        // } test code for ttv search query
    })

    $(document).on("change", "#YTorTTV", function(){
        if ($(this).is(":checked")) {
            ytDiv.addClass("d-none")
            ttvDiv.removeClass("d-none")
        } else {
            ytDiv.removeClass("d-none")
            ttvDiv.addClass("d-none")
        }
    })

    $(document).on("click", ".searchYT", function(){
        let gameTitle = $(this).data("game")
        gameCards.html("")
        let clickedHTML = `
        <button type="button" class="col-md-3 p-1 btn btn-primary searchYT" data-game="${gameTitle}">
            <div class="card text-dark" style="height: 240px">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${$(this).data("cover")}" class="img-fluid h-100 w-100 rounded-start" style="object-fit: contain">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <p class="card-header bg-white font-weight-bolder h-40" style="margin-top: 0; height: 50px">${gameTitle}</p>
                            <div class="overflow-y-auto" style="overflow-y: auto; max-height: 120px;">
                                <p class="card-text">${$(this).data("summary")}</p>
                            </div>
                            <p class="card-text"><small class="text-body-secondary">${$(this).data("rating")}/100</small></p>
                        </div>
                    </div>
                    <button class="btn btn-outline-warning favorite-btn" data-game="${gameTitle}">⭐ Favorite</button>
                </div>
            </div>
        </button>
        `
        gameCards.html(clickedHTML)
        console.log(`searching youtube for ${gameTitle}`)
        youtubeAjaxSearch(gameTitle)
        ttvAjaxSearch(gameTitle)
    })

    $(document).on("click", ".favorite-btn", function () {
        let gameName = $(this).data("game")
        let favorites = JSON.parse(localStorage.getItem("favorites")) || []
    
        if (!favorites.includes(gameName)) {
            favorites.push(gameName)
            localStorage.setItem("favorites", JSON.stringify(favorites))
            alert(`${gameName} added to favorites!`)
        } else {
            alert(`${gameName} is already in favorites.`)
        }
    })

    $(document).on("click", ".remove-favorite", function () {
        let gameName = $(this).data("game")
        let favorites = JSON.parse(localStorage.getItem("favorites")) || []
    
        favorites = favorites.filter(game => game !== gameName)
        localStorage.setItem("favorites", JSON.stringify(favorites))
    
        displayFavorites()
    })

    $(document).ready(function () {
        displayFavorites()
    })
})