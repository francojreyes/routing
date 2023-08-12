import React from 'react';
import { Network } from 'vis-network';
import { Node, GraphData } from '../types';

interface GraphProps {
  data: GraphData;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
}

const Graph: React.FC<GraphProps> = ({
  data,
  setSelectedNode
}) => {
  const containerRef = React.useRef(null);
  const [network, setNetwork] = React.useState<Network>();

  // Initialise network
  React.useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      interaction: {
        hoverConnectedEdges: false,
        selectConnectedEdges: false,
        selectable: false
      },
      edges: {
        color: {
          highlight: 'blue'
        },
        selectionWidth: 2
      }
    };

    const newNetwork = new Network(containerRef.current, {}, options);
    setNetwork(newNetwork);

    return () => newNetwork.destroy();
  }, []);

  // Add callbacks
  React.useEffect(() => {
    if (!network) return;

    const handleClick = (event: any) => {
      // Find selected node
      const { x, y } = event.pointer.canvas;
      const selected = data.nodes.find(node => {
        const { top, left, right, bottom } = network.getBoundingBox(node.id);
        return left <= x && x <= right && top <= y && y <= bottom;
      });
      if (!selected) return;

      // Highlight node/forwarding paths, display info
      network.selectNodes([selected.id], false);
      setSelectedNode(selected);
    }

    network.on('click', handleClick);
    return () => network.off('click', handleClick);
  }, [network, data, setSelectedNode])

  // Redraw on new data
  React.useEffect(() => {
    if (network) {
      network.setData(data);
    }
  }, [network, data]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Graph;