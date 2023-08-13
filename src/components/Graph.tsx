import React from 'react';
import { Network } from 'vis-network';
import { useDispatch, useSelector } from '../redux/hooks';
import { deselectNode, selectNetworkData, selectNode, selectSelectedNode } from '../redux/networkSlice';

const Graph = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectNetworkData);
  const selectedNode = useSelector(selectSelectedNode);

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
        dispatch(deselectNode());
      } else {
        // Highlight node/forwarding paths, display info
        network.selectNodes([selected.id], false);
        dispatch(selectNode(selected));
      }
    }

    network.on('click', handleClick);
    return () => network.off('click', handleClick);
  }, [network, data, dispatch]);

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