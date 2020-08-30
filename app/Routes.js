import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import MainContainer from './containers/MainContainer';
import DownloadStatus from './components/DownloadStatus';

console.log('calling Router.js')
export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={MainContainer} />
      <Route path={routes.DOWNLOAD_STATUS} component={DownloadStatus} />
    </Switch>
  </App>
);
