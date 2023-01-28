import React from 'react';
import { Home } from './backend/Home';
import { RecommendationPage } from './RecommendationPage';
import { Route, Switch, Redirect } from 'react-router-dom';

export const Routes = () => {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/Home" component={Home} />
        <Route exact path="/">
          <Redirect to="/Home" />
        </Route>
        <Route exact path="./RecommendationPage" component={RecommendationPage} />
      </Switch>
    </div>
  );
};