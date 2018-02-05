var componentNode = document.getElementById('contents');
import React from 'react';
import ReactDOM from 'react-dom';
import IssueList from './issueList.jsx';

ReactDOM.render(<IssueList />,componentNode);

if (module.hot) {
  module.hot.accept();
}