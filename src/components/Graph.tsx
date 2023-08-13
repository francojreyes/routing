import React from 'react';
import { Network } from 'vis-network';
import { Node, NetworkData } from '../types';

interface GraphProps {
  data: NetworkData;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
}

const Graph: React.FC<GraphProps> = ({
  data,
  selectedNode,
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

      if (!selected) {
        // Deselect node
        network.selectNodes([]);
        setSelectedNode(null);
      } else {
        // Highlight node/forwarding paths, display info
        network.selectNodes([selected.id], false);
        setSelectedNode(selected);
      }
    }

    network.on('click', handleClick);
    return () => network.off('click', handleClick);
  }, [network, data, setSelectedNode]);

  // Redraw on new data
  React.useEffect(() => {
    if (network) network.setData(data);
  }, [network, data]);

  // Make sure selected node stays selected on data change
  React.useEffect(() => {
    if (!network) return;
    if (selectedNode && !network.getSelectedNodes().length) {
      network.selectNodes([selectedNode.id], false);
    }
  }, [network, data, selectedNode])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Graph;