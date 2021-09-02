import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './state/store';
import Routes from './views/routes';
import './styles/main.scss';

const App = () => (
    <Provider store={store}>
        <Routes/>
    </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));