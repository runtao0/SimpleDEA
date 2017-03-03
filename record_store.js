class RecordStore {
  constructor(records) {
    this.providers_container = document.getElementById("providers_container");
    this.storeById = {};
    this.storeByTimeToExp = {};
    this.expired = {};
    this.valid = {};
    this.today = new Date();
    this.currentView = "all";
    
    this._createProfessional = this._createProfessional.bind(this);
    records.forEach((record) => {
      this._createProfessional(record)
    });
  }

  addEvents(buttons) {
    this.providers_container
      .addEventListener('click', this._clickOnProfessional.bind(this));
    buttons.addEventListener('click', this._clickOnButtons.bind(this));
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
      case 'valid':
        this.populateUL(this.valid);
        this.currentView ='valid';
        break;
      case 'all':
        this.populateUL();
        this.currentView = 'all';
        break;
    }
  }

  _clickOnProfessional(e) {
    e.preventDefault();
    if (this._selectLIFrom(e.path) === this.selectedID) {
      this.selectedProfessional.removeClass("selected");
      this.selectedProfessional.li.removeChild(this.details);
      this.details = false;
      this.selectedID = false;
      return;
    }
    this.selectedID = this._selectLIFrom(e.path)
    if (this.details) {
      this.selectedProfessional.removeClass("selected");
      this.selectedProfessional.li.removeChild(this.details);
    }
    this.selectedProfessional = this.storeByTimeToExp[this.selectedID];
    this.selectedProfessional.addClass("selected");
    this.details = this.selectedProfessional.createDetails();
    this.selectedProfessional.li.appendChild(this.details);
  }

  _selectLIFrom(path) {
    for (let x = 0; x < path.length; x ++) {
      if (this._checkIfLI(path[x])) return path[x].id;
    }
  }

  _checkIfLI(element) {
    return (element.tagName === "LI") && element.id;
  }

  _createProfessional(obj) {
    let formattedName = this._formatName(obj.name);
    let expirationDifference = new Date(obj.expiration_date) - this.today;
    while (this.storeByTimeToExp.hasOwnProperty(expirationDifference)) {
      expirationDifference += 1;
    }
    const professional = new Professional(formattedName, expirationDifference, obj);

    this.storeById[obj.npi] = professional;
    if (expirationDifference < 0) { //expired
      this.storeByTimeToExp[expirationDifference] = professional;
      this.expired[expirationDifference] = professional;
    } else { //valid
      this.storeByTimeToExp[expirationDifference] = professional;
      this.valid[expirationDifference] = professional;
    }
  }

  // getByName(name) {
  //   // check if name exists
  //   return this.storeById[name];
  // }
  //
  // getByDate(date) {
  //   return this.storeByDate[date];
  // }

  populateUL(obj = this.storeByTimeToExp, limit = 30) {
    this.providers_container.innerHTML = '';
    const keys = Object.keys(obj);
    const keysInt = [];
    for (let x = 0; x < keys.length; x ++) {
      keysInt[x] = parseInt(keys[x]);
    }
    keysInt.sort((a,b) => {
      return a - b;
    }).slice(0, limit)
    .forEach((time) => {
      this.storeByTimeToExp[time].createDisplay()
      this.providers_container.appendChild(this.storeByTimeToExp[time].li);
    });
  }

  _formatName(name) {
    const capitalized = name.toLowerCase()
      .replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase();
      });

    return capitalized;
  }
}
