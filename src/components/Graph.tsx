import React from 'react';
import { Data, Network } from 'vis-network';
import { GraphData } from '../types';

interface GraphProps {
  data: GraphData;
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    // Create a network visualization
    if (!containerRef.current) return;

    const options = {};
    const network = new Network(containerRef.current, data, options);

    // Clean up when component unmounts
    return () => {
      network.destroy();
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Graph;