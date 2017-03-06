// represents a Professional from the record. Contains functions that create the
// corresponding DOM element and details
// name => string that represents a professional's name, can be formatted however
// time => time in ms between expiration date and today
// { dea_number, expiration_date, npi, provider_id } =>
// objects that contain attributes that will be displayed in the detailed view
class Professional {
  constructor(name, time, { dea_number, expiration_date, npi, provider_id }) {
    this.info = {
      'Expiration Date': this._getCorrectTime(expiration_date),
      'DEA Number': dea_number,
      'NPI': npi,
      'Provider ID': provider_id,
    }
    this.time = time;
    this.name = this._formatName(name);
    this.li;

    this._expDisplay = this._expDisplay.bind(this);
  }

  // accounts for UTC date format
  _getCorrectTime(expiration_date) {
    const date = new Date(expiration_date);
    date.setTime(date.getTime() + date.getTimezoneOffset()*60*1000);
    return date.toDateString();
  }

  // distingush name duplicates
  noteDup(num) {
    if ((/[)]/).test(this.name)) {
      this.name = this.name.replace(/([\d])/g, num.toString());
    } else {
      this.name = this.name + ' (2)'
    }
  }

  // distingush expiration_date duplicates
  addOneMilisec() {
    this.time += 1;
  }

  // changes class of DOM
  addClass(name) {
    this.li.classList.add(name);
  }

  removeClass(name) {
    this.li.classList.remove(name);
  }

  // creates display without details (li)
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

  // creates details DOM
  createDetails(element) {
    const ul = document.createElement("ul");
    for (let field in this.info) {
      ul.appendChild(this._createDetailLI(field, this.info[field]));
    }
    ul.classList.add("detail");
    return ul;
  }

  // Helper methods for DOM creation
  _formatName(name) {
    const capitalized = name.toLowerCase()
      .replace(/(^|[\s-'])\S/g, function (match) {
        return match.toUpperCase();
      });

    return capitalized;
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
