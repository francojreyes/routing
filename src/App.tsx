import React from 'react';
import Graph from './components/Graph';
import Console from './components/Console';
import { GraphData } from './types';

function App() {
  const [graphData, setGraphData] = React.useState<GraphData>({
    nodes: [
      { id: 1, label: '1', shape: 'circle' },
      { id: 2, label: '2', shape: 'circle' },
    ],
    edges: [
      { id: 0, from: 1, to: 2, label: '1' },
    ]
  });

  return (
    <>
      <Console graphData={graphData} setGraphData={setGraphData} />
      <Graph data={graphData}/>
    </>
  );
}

export default App;
