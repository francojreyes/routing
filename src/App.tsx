import React from 'react';
import Graph from './components/Graph';
import ConfigurationPane from './components/ConfigurationPane';
import SimulationPane from './components/SimulationPane';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CssBaseline } from '@mui/joy';
import { useDispatch, useSelector } from './redux/hooks';
import { hideCalculations, selectRoutingData, selectSelectedNode, selectShowCalculations } from './redux/networkSlice';
import CalculationPane from './components/CalculationPane';

function App() {
  return (
    <CssBaseline>
      <Provider store={store}>
        <Main/>
      </Provider>
    </CssBaseline>
  );
}

const Main = () => {
  const selected = useSelector(selectSelectedNode);
  const showCalc = useSelector(selectShowCalculations);
  const routingData = useSelector(selectRoutingData);
  const dispatch = useDispatch();

  const closeCalculations = () => dispatch(hideCalculations());

  console.log(JSON.stringify(selected) + " " + showCalc)

  return (
    <>
      {!selected || !showCalc
        ? <ConfigurationPane/>
        : <CalculationPane
            close={closeCalculations}
            nodeId={selected.id}
            data={routingData}
          />
      }
      <Graph/>
      <SimulationPane/>
    </>
  );
}

export default App;
