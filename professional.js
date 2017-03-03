class Professional {
  constructor(name, time, { dea_number, expiration_date, npi, provider_id }) {
    this.info = {
      'Expiration Date': new Date(expiration_date).toDateString(),
      'DEA Number': dea_number,
      'NPI': npi,
      'Provider ID': provider_id,
    }
    this.time = time;
    this.name = name;
    this.expired = time < 0;
    this.li;
    this._expDisplay = this._expDisplay.bind(this);
  }

  addClass(name) {
    this.li.classList.add(name);
  }

  removeClass(name) {
    this.li.classList.remove(name);
  }

  setExpired() {
    this.expired = true;
  }

  createDisplay(element) {
    const li = document.createElement("li");
    li.id = this.time;

    const container = document.createElement("div");
    container.classList.add("group");
    container.appendChild(this._nameDisplay());
    container.appendChild(this._expDisplay());

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
    li.innerHTML = `<strong>${field}</strong> : ${data}`
    // const text = document.createTextNode(`${field} : ${data}`);
    // li.appendChild(text);
    return li;
  }

  _nameDisplay() {
    const h2 = document.createElement("h2");
    h2.innerHTML = `<strong>${this.name}</strong>`
;    // const name = document.createTextNode(this.name);
    // h2.appendChild(name);
    h2.classList.add("title");
    return h2;
  }

  _expDisplay() {
    let status;
    const h2 = document.createElement("h2");
    if (this.expired) {
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
    h2.classList.add("view_opt");
    return h2;
  }

}
