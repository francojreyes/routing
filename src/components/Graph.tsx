import React, { useEffect, useRef, useState } from 'react';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

const Graph = () => {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState(new DataSet([
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    // Add more nodes as needed
  ]));
  const [edges, setEdges] = useState(new DataSet([
    { id: 0, from: 1, to: 2 },
    // Add more edges as needed
  ]));

  useEffect(() => {
    // Create a network visualization
    if (!containerRef.current) return;

    const options = {};
    const data = { nodes, edges };
    const network = new Network(containerRef.current, data, options);

    // Clean up when component unmounts
    return () => {
      network.destroy();
    };
  }, [edges, nodes]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Graph;