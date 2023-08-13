import React from 'react';
import { Network } from 'vis-network';
import { useDispatch, useSelector } from '../redux/hooks';
import {
  deselectNode,
  selectNetworkData,
  selectNode,
  selectRoutingData,
  selectSelectedNode
} from '../redux/networkSlice';
import { matchingEdge } from '../utils/helpers';
import { Edge, RoutingData } from '../types';

const Graph = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectNetworkData);
  const selectedNode = useSelector(selectSelectedNode);
  const routingData = useSelector(selectRoutingData);

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
          highlight: 'red'
        },
        selectionWidth: 2
      }
    };

    const newNetwork = new Network(containerRef.current, {}, options);
    setNetwork(newNetwork);

    return () => newNetwork.destroy();
  }, []);

  console.log(network?.getSelectedEdges());

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
        dispatch(deselectNode());
      } else {
        dispatch(selectNode(selected));
      }
    }

    network.on('click', handleClick);
    return () => network.off('click', handleClick);
  }, [network, data, dispatch, routingData]);

  // Redraw on new data
  React.useEffect(() => {
    if (network) {
      network.setData(data);
    }
  }, [network, data]);

  // Make sure selected node stays selected on data change
  React.useEffect(() => {
    if (network && selectedNode) {
      network.setSelection({
        nodes: [selectedNode.id],
        edges: getRouteEdges(data.edges, routingData, selectedNode.id)
      });
    }
  }, [network, data, selectedNode, routingData]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const getRouteEdges = (
  edges: Edge[],
  routingData: RoutingData,
  node: number
): number[] => {
  if (routingData.algorithm === "LS") {
    const iterations = routingData.data[node];
    const final = iterations[iterations.length - 1];

    const selectedEdges: number[] = [];
    for (let i = 0; i < final.pred.length; i++) {
      const edge = edges.find(e => matchingEdge(e, i, final.pred[i]));
      if (edge) selectedEdges.push(edge.id);
    }

    return selectedEdges;
  } else {
    return [];
  }
}

export default Graph;