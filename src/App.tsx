import React from 'react';
import Graph from './components/Graph';
import Console from './components/Console';
import ForwardingTable from './components/ForwardingTable';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Console/>
      <Graph/>
      <ForwardingTable/>
    </Provider>
  );
}

export default App;
