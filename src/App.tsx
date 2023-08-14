import React from 'react';
import Graph from './components/Graph';
import Configuration from './components/Configuration';
import Simulation from './components/Simulation';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Configuration/>
      <Graph/>
      <Simulation/>
    </Provider>
  );
}

export default App;
