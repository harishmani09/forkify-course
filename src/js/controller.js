// import icons from '../img/icons.svg'; parcel 1
import { MODEL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookMarkViews from './views/bookMarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2
// #5ed6604591c37cdc054bca65
///////////////////////////////////////
const controlRecipes = async function () {
  //loading the recipie
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    // renderSpinner(recipeContainer);
    //1. loading recipe
    await model.loadRecipe(id);

    //update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    //rendering the recipe
    recipeView.render(model.state.recipe);
    // const recipeView = new recipeView(model.state.recipe);
    //render bookmark
    bookMarkViews.render(model.state.bookmarks);
    //test
    //updating bookmark views

    //change ID
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    bookMarkViews.update(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    recipeView.renderError(`${err}💥💥💥`);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);

    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  //render new result
  resultsView.render(model.getSearchResultsPage(goToPage));
  //render new pagination button
  paginationView.render(model.state.search);
  // paginationView.render(model.state.search);
};
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);

  //update recipeview
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookMarkViews.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarkViews.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarkViews.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRenderAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
