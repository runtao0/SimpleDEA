document.addEventListener("DOMContentLoaded", () => {
  const requestID20 = new csAPI(simpleDEArequest);
  const handleRecords = function(response) {
    console.log(response.length);
    window.store = new RecordStore(response)
  };
  requestID20.getData(handleRecords).then(() => {
    store.populateUL();
// sort out the top 30 by DATE
// view multiple details option
// loading screen
//  fix issue with number of elements
  store.addEvent();
  });
})
