import React from 'react';
import Graph from './components/Graph';
import Console from './components/Console';
import { Algorithm, NetworkData, Node } from './types';
import ForwardingTable from './components/ForwardingTable';

function App() {
  const [networkData, setNetworkData] = React.useState<NetworkData>({
    nodes: [
      { id: 0, label: '0', shape: 'circle' },
      { id: 1, label: '1', shape: 'circle' },
    ],
    edges: [
      { id: 0, from: 0, to: 1, label: '1' },
    ]
  });
  const [algorithm, setAlgorithm] = React.useState<Algorithm>("LS");
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

  return (
    <>
      <Console
        networkData={networkData}
        setNetworkData={setNetworkData}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
      />
      <Graph
        data={networkData}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
      <ForwardingTable
        networkData={networkData}
        algorithm={algorithm}
        selectedNode={selectedNode}
      />
    </>
  );
}

export default App;
