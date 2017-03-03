class RecordStore {
  constructor(records) {
    this.providers_container = document.getElementById("providers_container");
    this.storeByTimeToExp = {};
    this.storeByName = {}
    this.expired = {};
    this.valid = {};
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

  _createProfessional(obj) {
    let formattedName = this._formatName(obj.name);
    let expirationDifference = new Date(obj.expiration_date) - this.today;
    const professional = new Professional(formattedName, expirationDifference, obj);

    this._storeByValidity(professional);
    this._storeByName(professional);

    professional.createDisplay();
  }

  _storeByName(professional) {
    while (this.storeByName.hasOwnProperty(professional.name)) {
      professional.noteDup();
      console.log(professional.name);
    }
    this.storeByName[professional.name.toLowerCase()] = professional;
  }

  _storeByValidity(professional) {
    while (this.storeByTimeToExp.hasOwnProperty(professional.time)) {
      professional.addOneMilisec();
    }
    if (professional.time < 0) {                                    //expired
      this.storeByTimeToExp[professional.time] = professional;
      this.expired[professional.time] = professional;
    } else {                                                            //valid
      this.storeByTimeToExp[professional.time] = professional;
      this.valid[professional.time] = professional;
    }
  }

  populateUL(obj = this.storeByTimeToExp, exp = true, limit = 30) {
    this.providers_container.innerHTML = '';
    const keys = Object.keys(obj);
    if (exp) {
      this._appendByExp(keys, limit);
    } else {
      this._appendByName(keys)
    }
  }

  _appendByName(keys) {
    const sorted = keys.sort();
    for (let x = 0; x < sorted.length; x++) {
      this.providers_container.appendChild(this.storeByName[sorted[x]].li);
    }
  }

  _appendByExp(keys, limit) {
    const keysInt = [];
    for (let x = 0; x < keys.length; x ++) {
      keysInt[x] = parseInt(keys[x]);
    }
    keysInt.sort((a,b) => {
      return a - b;
    }).slice(0, limit)
    .forEach((time) => {
      this.providers_container.appendChild(this.storeByTimeToExp[time].li);
    });
  }

  addEvents(buttons, input) {
    this.providers_container
      .addEventListener('click', this._clickOnProfessional.bind(this));
    buttons.addEventListener('click', this._clickOnButtons.bind(this));
    input.addEventListener('input', this._searchByName.bind(this));
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
    this.populateUL(matches, false);
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

  _formatName(name) {
    const capitalized = name.toLowerCase()
      .replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase();
      });

    return capitalized;
  }
}
