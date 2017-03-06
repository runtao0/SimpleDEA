class Professional {
  constructor(name, time, { dea_number, expiration_date, npi, provider_id }) {
    this.info = {
      'Expiration Date': new Date(expiration_date).toDateString(),
      'DEA Number': dea_number,
      'NPI': npi,
      'Provider ID': provider_id,
    }
    this.time = time;
    this.name = this._formatName(name);
    this.li;

    this._expDisplay = this._expDisplay.bind(this);
  }

  _formatName(name) {
    const capitalized = name.toLowerCase()
      .replace(/(^|[\s-'])\S/g, function (match) {
        return match.toUpperCase();
      });

    return capitalized;
  }

  noteDup(num) {
    if ((/[)]/).test(this.name)) {
      this.name = this.name.replace(/([\d])/g, num.toString());
    } else {
      this.name = this.name + ' (2)'
    }
  }

  addOneMilisec() {
    this.time += 1;
  }

  addClass(name) {
    this.li.classList.add(name);
  }

  removeClass(name) {
    this.li.classList.remove(name);
  }

  createDisplay(element) {
    const li = document.createElement("li");
    li.id = this.time;

    const container = document.createElement("div");
    container.classList.add("group");
    container.appendChild(this._nameDisplay());
    container.appendChild(this._expDisplay());

    // li.style.maxHeight = '45px';
    li.appendChild(container);
    this.li = li;
  }

  createDetails(element) {
    const ul = document.createElement("ul");
    for (let field in this.info) {
      ul.appendChild(this._createDetailLI(field, this.info[field]));
    }
    ul.classList.add("detail");
    return ul;
  }

  _createDetailLI(field, data) {
    const li = document.createElement("li");
    li.innerHTML = `<h2><strong>${field} : </strong></h2><h2 class="content">${data}</h2>`;
    return li;
  }

  _nameDisplay() {
    const h2 = document.createElement("h2");
    h2.innerHTML = `<strong>${this.name}</strong>`;
    h2.classList.add("label");
    return h2;
  }

  _expDisplay() {
    let status;
    const h2 = document.createElement("h2");
    if (this.time < 0) {
      status = document.createTextNode("EXPIRED");
      h2.classList.add("red");
    } else if (this.time < 2592000000) {
      status = document.createTextNode("EXPIRES SOON");
      h2.classList.add("yellow");
    } else {
      status = document.createTextNode("ACTIVE");
      h2.classList.add("green");
    }
    h2.appendChild(status);
    h2.classList.add("content");
    return h2;
  }

}
