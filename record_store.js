// RecordStore models the collection of records of professionals registed
// with the DEA.
//
// It contains
// 1. container => a reference to the DOM element that will be
//                           the parent of all the professional li's
// 2. storeByTimeToExp, storeByName,
//    expired, active => dictionaries to each professional by name, time
//                      from the present to the expiration date, and
//                      either expired or active
// 3. today => present stored as a Date class
// 4. currentView => string value that keeps track of the current view
//                   "all", "active"

class RecordStore {
  constructor(container) {
    this.container = container;
    this.storeByTimeToExp = {};
    this.storeByName = {}
    this.expired = {};
    this.active = {};
    this.pages = new Page(container);
    this.today = new Date();
    this.currentView = "all";

    this.receiveRecords = this.receiveRecords.bind(this);
  }

  // 1. receives an set of records and creates a Professional from
  //    each record
  // records => an array of professionals
  receiveRecords(records) {
    records.forEach((record) => {
      this._createProfessional(record);
    });
    this.populateUL();
  }

  // 1. creates a Professional from the object (record)
  // 2. creates dictionaries based on obj attributes needed
  // 3. creates the DOM associated with the Professional
  // obj => a JS/JSON object that contains, at the very least,
  //        a name and an expiration date
  _createProfessional(obj) {
    let name = obj.name;
    let expirationDifference = new Date(obj.expiration_date) - this.today;
    const professional = new Professional(name, expirationDifference, obj);

    this._storeByActivity(professional);
    this._storeByName(professional);

    professional.createDisplay();
  }

  // 1. checks for repeats in records (only covers duplicates)
  // 2. stores reference to professional by name for search
  // professional => an instance of Professional
  _storeByName(professional) {
    while (this.storeByName.hasOwnProperty(professional.name.toLowerCase())) {
      professional.noteDup();
    }
    this.storeByName[professional.name.toLowerCase()] = professional;
  }

  // 1. checks for repeats in records and increments each record so there are
  //    unique keys for the storeByTimeToExp
  // 2. stores reference to professional by expiration date and separates
  //    active and expired
  _storeByActivity(professional) {
    while (this.storeByTimeToExp.hasOwnProperty(professional.time)) {
      professional.addOneMilisec();
    }
    if (professional.time < 0) {                                    //expired
      this.storeByTimeToExp[professional.time] = professional;
      this.expired[professional.time] = professional;
    } else {                                                            //active
      this.storeByTimeToExp[professional.time] = professional;
      this.active[professional.time] = professional;
    }
  }

  // 1. clears the container
  // 2. resets the Page object
  // 2. defers to helper methods that populate the container based on
  //    which dictionary to use
  // obj => set of Professionals being worked with
  // dictionary => string value representing what dictionary
  //               to use for lookup
  populateUL(obj = this.storeByTimeToExp, dictionary = 'exp') {
    this.container.innerHTML = '';
    this.pages.resetPages();
    const keys = Object.keys(obj);
    switch(dictionary) {
      case 'exp':
        this._appendByExp(keys);
        break;
      case 'name':
        this._appendByName(keys);
        break;
    }
  }

  // 1. sorts keys alphabetically
  // 2. adds each Professional in the subset to the Page object
  // 3. changes the Page object to look up by the correct dictionary
  // 4. changes the view to the correct subset and page
  // keys => an array that holds a subset of Professionals
  _appendByName(keys) {
    const sorted = keys.sort();
    sorted.forEach((name) => {
      this.pages.addToPages(name);
    });
    this.pages.changeDictionary(this.storeByName)
    this.pages.renderPage();
  }

  // similar to _appendByName, but sorts by expiration date
  _appendByExp(keys) {
    const keysInt = [];
    for (let x = 0; x < keys.length; x ++) {
      keysInt[x] = parseInt(keys[x]);
    }
    keysInt.sort((a,b) => {
      return a - b;
    }).forEach((time) => {
      this.pages.addToPages(time);
    });
    this.pages.changeDictionary(this.storeByTimeToExp);
    this.pages.renderPage();
  }

  // creates the event listeners for page view
  // 1. adds click event listener to list of professionals
  // 2. adds click event listener to buttons that toggle active/expired
  // 3. adds input listener to search by name input field
  // 4. adds click listener to page view buttons
  // viewbuttons => DOM node that switches subset of professionals
  // input => input DOM node that searches Professionals by name
  // pageView => DOM node that navigates pagination
  addEvents(viewbuttons, input, pageView) {
    this.container
      .addEventListener('click', this._clickOnProfessional.bind(this));
    viewbuttons.addEventListener('click', this._clickViewButtons.bind(this));
    input.addEventListener('input', this._searchByName.bind(this));
    pageView.addEventListener('click', this.pages.turnPage.bind(this));
  }

  // callback for container event listener
  // 1. finds the Professional selected
  // 2. unselects any selected Professionals
  // 3. returns if the Professional was previously selected (closes detail view)
  // 4. changes selected Professional
  // 5. selects current Professional
  _clickOnProfessional(e) {
    e.preventDefault();
    const selectedLIId = this._selectLIFrom(e.target);
    this._unselect();
    if (selectedLIId === this.selectedID) {
      this.selectedID = false;
      return;
    }
    this.selectedID = selectedLIId;
    this._select();
  }

  // callback for toggle view event listener
  // 1. resets current Professional details
  // 2. returns if the selected view is the same as the current view
  // 3. populates view with the selected subset
  // 4. changes views of buttons
  _clickViewButtons(e) {
    e.preventDefault();
    this.details = false;
    if (e.target.id === this.currentView) return;
    // refactor this
    document.getElementById(this.currentView).classList.toggle("current_view");
    switch(e.target.id) {
      case 'expired':
        this.populateUL(this.expired);
        this.currentView = 'expired';
        break;
      case 'active':
        this.populateUL(this.active);
        this.currentView ='active';
        break;
      case 'all':
        this.currentView = 'all';
        this.populateUL();
        break;
    }
    e.target.classList.toggle("current_view");
  }

  // callback for search by name event listener
  // 1. if the search field is empty, defaults to view of all Professionals
  // 2. finds matches to the input value
  // 3. creates a matches object and passes it to populateUL
  // 4. changes currentView
  // 5. populates view based on matched subset
  _searchByName(e) {
    e.preventDefault();
    if (e.target.value === "") {
      this.populateUL();
      return;
    }
    const searchString = new RegExp(e.target.value.toLowerCase());
    const matches = {};
    Object.keys(this.storeByName).forEach((name) => {
      if (searchString.test(name)) {
        matches[name] = this.storeByName[name];
      }
    });

    this.currentView = 'all';
    this.populateUL(matches, 'name');
  }

  // changes view of selected Professional to reveal details
  _select() {
    this.selectedProfessional = this.storeByTimeToExp[this.selectedID];
    this.selectedProfessional.addClass("selected");
    this.details = this.selectedProfessional.createDetails();
    this._expand(this.selectedProfessional.li);
    this.selectedProfessional.li.appendChild(this.details)
  }

  // changes view of previously selected Professional to hide details
  _unselect() {
    if (this.details) {
      this._shrink(this.selectedProfessional.li);
      this.selectedProfessional.removeClass("selected");
      this.selectedProfessional.li.removeChild(this.details);
      this.details = false;
    }
  }

  //changes max height of Professional DOM for animating
  _shrink(element) {
    element.style.maxHeight = '45px';
  }

  //changes max height of Professional DOM for animating
  _expand(element) {
    element.style.maxHeight = '218px';
  }

  // checks path of event target until Professional li is found
  _selectLIFrom(node) {
    let anotherNode = node;
    while (!(anotherNode.tagName === "LI" && anotherNode.id !== "")) {
      anotherNode = anotherNode.parentNode;
    }
    return anotherNode.id;
  }
}
