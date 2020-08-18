// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {hot} from 'react-hot-loader/root';
import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router-dom';

import {browserHistory} from 'utils/browser_history';
import store from 'stores/redux_store.jsx';

import {makeAsyncComponent} from 'components/async_load';
const LazyRoot = React.lazy(() => import('components/root'));

const Root = makeAsyncComponent(LazyRoot);

// eslint-disable-next-line func-names
(function(history) {
    var pushState = history.pushState;
    // eslint-disable-next-line func-names
    history.pushState = function(state, key, path) {
        top.document.dispatchEvent(new CustomEvent('navigation', {detail: {path}}));
        // eslint-disable-next-line prefer-rest-params
        pushState.apply(history, arguments);
    };
    window.onpopstate = history.onpushstate;
}(window.history));

const hostname = window.location.hostname;
const domain = hostname.substr(hostname.lastIndexOf('.', hostname.lastIndexOf('.') - 1) + 1);
document.domain = domain;

class App extends React.PureComponent {
    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route
                        path='/'
                        component={Root}
                    />
                </Router>
            </Provider>);
    }
}

export default hot(App);
