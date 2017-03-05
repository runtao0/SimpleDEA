document.addEventListener("DOMContentLoaded", () => {
  const requestID20 = new csAPI(simpleDEArequest);
  const container = document.getElementById("providers_container");
  const store = new RecordStore(container);
  requestID20.getData(store.receiveRecords).then(() => {
    const pageView = document.getElementById("page_view");
    const searchBar = document.getElementById("search");
    const viewButtons = document.getElementById("show_opts");
    store.addEvents(viewButtons, searchBar, pageView);
  });
})

// annotate
// error message
// refactor
// test?

// loading screen
