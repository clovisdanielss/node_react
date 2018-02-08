
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';

import IssueList from './issueList.jsx';
import IssueEdit from './issueEdit.jsx';

const contentNode = document.getElementById('contents');
const noMatch = () => <p>Page not found</p>;

const RoutedApp = () => (
    <Router history = {hashHistory}>
        <Route path = "/" component = {IssueList} />
        <Route path = "/issueEdit" component = {IssueEdit} />
        <Route path = "*" component = {noMath}/>
    </Router>
);

ReactDOM.render(<RoutedApp/>, contentNode);

if (module.hot) {
  module.hot.accept();
}
