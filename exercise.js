document.addEventListener("DOMContentLoaded", () => {
  const requestID20 = new csAPI(simpleDEArequest);
  const handleRecords = function(response) {
    const container = document.getElementById("providers_container");
    window.store = new RecordStore(response, container)
  };
  requestID20.getData(handleRecords).then(() => {
    store.populateUL();
//  refactor
//  error message
// test?
    // show "no results found"
    // loading screen
    const pageView = document.getElementById("page_view");
    const searchBar = document.getElementById("search");
    const viewButtons = document.getElementById("show_opts");
    store.addEvents(viewButtons, searchBar, pageView);
  });
})

// document.addEventListener("")


// comments that show my thought process
