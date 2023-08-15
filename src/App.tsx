import React from 'react';
import Graph from './components/Graph';
import ConfigurationPane from './components/ConfigurationPane';
import SimulationPane from './components/SimulationPane';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CssBaseline } from '@mui/joy';

function App() {
  return (
    <CssBaseline>
      <Provider store={store}>
        <ConfigurationPane/>
        <Graph/>
        <SimulationPane/>
      </Provider>
    </CssBaseline>
  );
}

export default App;
