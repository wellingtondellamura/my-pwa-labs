//** REGISTRO DE EVENTOS *******************************************************
var dialog = document.getElementById('dlgAdd');
var btnAdd = document.getElementById('btnAdd');
var btnRefresh = document.getElementById('btnRefresh');
var btnModalOk = document.getElementById('btnModalOk');
var btnModalCancel = document.getElementById('btnModalCancel');

btnAdd.addEventListener('click', function() {
   dialog.showModal();
});

btnRefresh.addEventListener('click', function() {
   console.log("btnRefresh click");
});

btnModalOk.addEventListener('click', function() {
   var city = document.getElementById('selCity').value;
   console.log(weather.getQuery(city));
   dialog.close();
});

btnModalCancel.addEventListener('click', function() {
   dialog.close();
});
//******************************************************************************

//** REGISTRO DO SW ************************************************************
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}
//******************************************************************************
