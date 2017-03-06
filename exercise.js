document.addEventListener("DOMContentLoaded", () => {
  const requestID20 = new csAPI(simpleDEArequest);
  const container = document.getElementById("providers_container");
  const store = new RecordStore(container);

  const setupEventListeners = () => {
    const pageView = document.getElementById("page_view");
    const searchBar = document.getElementById("search");
    const viewButtons = document.getElementById("show_opts");
    store.addEvents(viewButtons, searchBar, pageView);
  }
  
  requestID20.getData(store.receiveRecords, store.showErrorMessage)
             .then(setupEventListeners);
});


// annotate
// error message
// refactor
// test?

// loading screen
