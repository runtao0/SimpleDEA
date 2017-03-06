// Pagination is a class that keeps track of the pagination
// of any view.
// Page, interval, total pages integer variables exist to track current
// page views. A dictionary variable can be changed for different lookup
// parameters, and a reference to a page number heading.
//
// this.container => the DOM element that contains all the items
// this.order => an array to track the order of presentation
// this.interval => int amount presented by page, default 30.
// this.page => int to keep track of the currently viewed subset
// this.dictionary => JS object for item lookup
// this.totalPages => int total pages needed for view
// this.pageCount => DOM element that notifies page number
class Pagination {
  constructor(container, interval = 30) {
    this.container = container;
    this.order = [];
    this.interval = interval;
    this.page = 0;
    this.dictionary;
    this.totalPages = 1;
    this.pageCount = document.getElementById("page_count");

    this.turnPage = this.turnPage.bind(this);
  }

  // resets current page to 0 and empties order array
  resetPages() {
    this.order = [];
    this.page = 0;
    this._notifyPage();
  }

  // changes the page number header and changes it to red if the end pages
  // are reached
  _notifyPage() {
    this.pageCount.innerHTML = `(${this.page + 1}/${this.totalPages + 1}) ${this.interval} per page`;
    if (this.page === 0 || this.page === this.totalPages) {
      this.pageCount.style.color = 'rgb(254, 121, 121)';
    } else if (this.pageCount.style.color === 'rgb(254, 121, 121)') {
      this.pageCount.style.color = 'white';
    }
  }

  // self explanatory
  changeDictionary(dictionary) {
    this.totalPages = this._totalPages();
    this.dictionary = dictionary;
    this._notifyPage();
  }

  addToPages(key) {
    this.order.push(key);
  }

  turnPage(e) {
    switch(e.target.id) {
      case 'next':
        if (this.page < this.totalPages) {
          this.page += 1;
          this._resetScroll();
          break;
        } else {
          return;
        }
      case 'prev':
        if (this.page > 0) {
          this.page -= 1;
          this._resetScroll();
          break;
        } else {
          return;
        }
    }
    this._notifyPage();
    this.renderPage();
  }

  _resetScroll() {
    this.container.scrollTop = 0;
  }

  renderPage() {
    this.container.innerHTML = '';
    const start = this.interval * this.page;
    const end = start + (this.interval);
    const currentView = this.order.slice(start, end);
    for (let x = 0; x < currentView.length; x ++) {
      this.container.appendChild(this.dictionary[currentView[x]].li);
    }
  }

  _totalPages() {
    let totalPages = Math.floor(this.order.length / this.interval);
    return totalPages;
  }
}
