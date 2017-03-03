document.addEventListener("DOMContentLoaded", () => {
  const requestID20 = new csAPI(simpleDEArequest);
  const handleRecords = function(response) {
    console.log(response.length);
    window.store = new RecordStore(response)
  };
  requestID20.getData(handleRecords).then(() => {
    store.populateUL();
    // refactor
    // search
    // find duplicate records
    // animation
    // pagenate
// loading screen

    const viewButtons = document.getElementById("show_opts")
    store.addEvents(viewButtons);
  });
})

// document.addEventListener("")
