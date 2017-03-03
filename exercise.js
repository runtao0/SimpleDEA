document.addEventListener("DOMContentLoaded", () => {
  const requestID20 = new csAPI(simpleDEArequest);
  const handleRecords = function(response) {
    console.log(response.length);
    window.store = new RecordStore(response)
  };
  requestID20.getData(handleRecords).then(() => {
    store.populateUL();

    // show "no results found"
    // keep same view
    // pagenate
    // loading screen
    const searchBar = document.getElementById("search");
    const viewButtons = document.getElementById("show_opts")
    store.addEvents(viewButtons, searchBar);
  });
})

// document.addEventListener("")


// comments that show my thought process
