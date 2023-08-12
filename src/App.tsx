import React from 'react';
import Graph from './components/Graph';
import Console from './components/Console';
import { Algorithm, GraphData, Node } from './types';
import ForwardingTable from './components/ForwardingTable';

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
  const [algorithm, setAlgorithm] = React.useState<Algorithm>("LS");
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

  return (
    <>
      <Console
        graphData={graphData}
        setGraphData={setGraphData}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
      />
      <Graph
        data={graphData}
        setSelectedNode={setSelectedNode}
      />
      <ForwardingTable
        graphData={graphData}
        algorithm={algorithm}
        selectedNode={selectedNode}
      />
    </>
  );
}

export default App;
