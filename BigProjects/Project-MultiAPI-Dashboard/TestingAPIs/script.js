import { googleAPI } from './constants'
alert(`test`)
const CONFIGURATION = {
    "locations": [
      {"title":"FerminFadez Barbershop","address1":"601 N 15th St","address2":"Immokalee, FL 34142, USA","coords":{"lat":26.42781141907233,"lng":-81.43426050552253},"placeId":"ChIJQ_yWxSCn24gRxWBfVF2wmMQ"}
    ],
    "mapOptions": {"center":{"lat":38.0,"lng":-100.0},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":false,"zoom":4,"zoomControl":true,"maxZoom":17,"mapId":""},
    "mapsApiKey": googleAPI,
    "capabilities": {"input":false,"autocomplete":false,"directions":false,"distanceMatrix":false,"details":false,"actions":false}
  };


document.addEventListener('DOMContentLoaded', async () => {
    await customElements.whenDefined('gmpx-store-locator');
    const locator = document.querySelector('gmpx-store-locator');
    locator.configureFromQuickBuilder(CONFIGURATION);
  });