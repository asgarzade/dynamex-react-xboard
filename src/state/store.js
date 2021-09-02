import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleWare from "redux-saga";
// import logger from "redux-logger";
import schema from "./schema";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
// create saga middleware
const sagaMiddleWare = createSagaMiddleWare();

// initial data for entire app.
const initialData = schema;
const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;
const middlewares = [sagaMiddleWare];
const enhancers = [];

// redux dev tool extension for only development usage.

if (process.env.NODE_ENV === "development") {
  // middlewares.push(logger);
  const devtool = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (typeof devtool === "function") {
    enhancers.push(devtool());
  }
}

// compose and apply middlewares and enhancers
const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);

// create redux store
const store = createStore(rootReducer, preloadedState || initialData, composedEnhancers);

//SSR Redux
window.snapSaveState = () => ({
  __PRELOADED_STATE__: store.getState()
});

// start saga
sagaMiddleWare.run(rootSaga);

export default store;
