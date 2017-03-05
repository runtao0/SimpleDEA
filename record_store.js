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
  constructor(records, container) {
    this.container = container;
    this.storeByTimeToExp = {};
    this.storeByName = {}
    this.expired = {};
    this.active = {};
    this.pages = new Page(container);
    this.today = new Date();
    this.currentView = "all";

    this._createProfessional = this._createProfessional.bind(this);
    records.forEach((record) => {
      this._createProfessional(record)
    });
  }

  getByName(name) {
    return this.storeByName[name];
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

  populateUL(obj = this.storeByTimeToExp, dictionary = 'exp', limit = 30) {
    this.container.innerHTML = '';
    this.pages.resetPages();
    const keys = Object.keys(obj);
    switch(dictionary) {
      case 'exp':
        this._appendByExp(keys, limit);
        break;
      case 'name':
        this._appendByName(keys);
        break;
    }
  }

  _appendByName(keys) {
    const sorted = keys.sort();
    sorted.forEach((name) => {
      this.pages.addToPages(name);
    });
    this.pages.changeDictionary(this.storeByName)
    this.pages.renderPage();
  }

  _appendByExp(keys, limit) {
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

  addEvents(buttons, input, pageView) {
    this.container
      .addEventListener('click', this._clickOnProfessional.bind(this));
    buttons.addEventListener('click', this._clickOnButtons.bind(this));
    input.addEventListener('input', this._searchByName.bind(this));
    pageView.addEventListener('click', this.pages.turnPage.bind(this));
  }

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

  _clickOnButtons(e) {
    e.preventDefault();
    this.details = false;
    if (e.target.id === this.currentView) return;
    switch(e.target.id) {
      case 'expired':
        this.populateUL(this.expired);
        this.currentView = 'expired';
        break;
      case 'active':
      debugger
        this.populateUL(this.active);
        this.currentView ='active';
        break;
      case 'all':
        this.currentView = 'all';
        this.populateUL();
        break;
    }
  }

  _clickOnProfessional(e) {
    e.preventDefault();
    if (this._selectLIFrom(e.target) === this.selectedID) {
      this._shrink(this.selectedProfessional.li);
      this.selectedProfessional.removeClass("selected");
      this.selectedProfessional.li.removeChild(this.details);
      this.details = false;
      this.selectedID = false;
      return;
    }

    this.selectedID = this._selectLIFrom(e.target)
    if (this.details) {
      this._shrink(this.selectedProfessional.li);
      this.selectedProfessional.removeClass("selected");
      this.selectedProfessional.li.removeChild(this.details);
    }
    this.selectedProfessional = this.storeByTimeToExp[this.selectedID];
    this.selectedProfessional.addClass("selected");
    this.details = this.selectedProfessional.createDetails();
    this._expand(this.selectedProfessional.li);
    this.selectedProfessional.li.appendChild(this.details)
  }

  _shrink(element) {
    element.style.maxHeight = '45px';
  }

  _expand(element) {
    element.style.maxHeight = '218px';
  }

  _selectLIFrom(node) {
    let anotherNode = node;
    while (anotherNode.tagName !== "LI") {
      anotherNode = anotherNode.parentNode;
    }
    return anotherNode.id;
  }

  _checkIfLI(element) {
    return (element.tagName === "LI") && element.id;
  }

  // _formatName(name) {
  //   const capitalized = name.toLowerCase()
  //     .replace(/(^|[\s-])\S/g, function (match) {
  //       return match.toUpperCase();
  //     });
  //
  //   return capitalized;
  // }
}
