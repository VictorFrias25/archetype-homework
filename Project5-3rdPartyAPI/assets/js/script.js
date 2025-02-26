$(document).ready(function(){
    let dayImport = dayjs();
    currentTimeLong = dayImport.format('dddd, MMMM D, YYYY h:mm A');

    console.log(currentTimeLong);

    $("#timeRN").html(currentTimeLong);
})