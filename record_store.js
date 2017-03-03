class RecordStore {
  constructor(records) {
    this.providers_container = document.getElementById("providers_container");
    this.storeById = {};
    this.storeByTimeToExp = {};
    this.expired = {};
    this.valid = {};
    this.today = new Date();
    this._create = this._create.bind(this);
    records.forEach((record) => {
      this._create(record)
    });
  }

  addValid() {

  }

  addExpired() {

  }

  removeAll() {

  }

  addEvent() {
    this.providers_container.addEventListener('click', (e) => {
      e.preventDefault();

      const selectedID = this._selectLIFrom(e.path)
      const selectedProfessional = this.storeByTimeToExp[selectedID];
      selectedProfessional.li.appendChild(selectedProfessional.createDetails()); // this is the npi
    });
  }

  _selectLIFrom(path) {
    for (let x = 0; x < path.length; x ++) {
      if (this._checkIfLI(path[x])) return path[x].id;
    }
  }

  _checkIfLI(element) {
    return (element.tagName === "LI") && element.id;
  }

  _create(obj) {
    let formattedName = this._formatName(obj.name);
    let expirationDifference = new Date(obj.expiration_date) - this.today;
    // while (this.storeByName.hasOwnProperty(formattedName)) {
    //   formattedName = formattedName + " (2)" //does not account for triplets or above
    // }
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

  getByName(name) {
    // check if name exists
    return this.storeById[name];
  }

  getByDate(date) {
    return this.storeByDate[date];
  }

  populateUL() {
    const first30 = Object.keys(this.storeByTimeToExp).sort().slice(0, 30);
    first30.forEach((time) => {
      this.storeByTimeToExp[time].createDisplay()
      this.providers_container.appendChild(this.storeByTimeToExp[time].li);
    });
  }

  removeElements () {

  }

  _formatName(name) {
    const capitalized = name.toLowerCase()
      .replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase();
      });

    return capitalized;
  }
}
