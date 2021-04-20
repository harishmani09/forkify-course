import View from './View';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookMarkViews extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No booksmarks yet!, find a recipe to bookmark';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookMarkViews();
