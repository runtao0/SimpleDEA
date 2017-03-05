class Page {
  constructor(container, interval = 30) {
    this.container = container;
    this.order = [];
    this.interval = interval;
    this.page = 0;
    this.dictionary = {};
    this.totalPages = 1;
    this.pageCount = document.getElementById("page_count");

    this.turnPage = this.turnPage.bind(this);
  }

  _restart() {
    this.page = 0;
    this._notifyPage();
  }

  _notifyPage() {
    this.pageCount.innerHTML = `(${this.page + 1}/${this.totalPages + 1}) ${this.interval} per page`;
    if (this.page === 0 || this.page === this.totalPages) {
      this.pageCount.style.color = 'rgb(254, 121, 121)';
    } else if (this.pageCount.style.color === 'rgb(254, 121, 121)') {
      this.pageCount.style.color = 'white';
    }
  }

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
          break;
        } else {
          return;
        }
      case 'prev':
        if (this.page > 0) {
          this.page -= 1;
          break;
        } else {
          return;
        }
    }
    this._notifyPage();
    this.renderPage();
  }

  resetPages() {
    this.order = [];
    this._restart();
  }

  renderPage() {
    this.container.innerHTML = '';
    const start = this.interval * this.page;
    const end = start + (this.interval - 1);
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
