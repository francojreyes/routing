import React from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

import { Edge, Node, RoutingData } from '../types';
import { useDispatch, useSelector } from '../redux/hooks';
import {
  deselectNode,
  selectNetworkData,
  selectNode,
  selectRoutingData,
  selectSelectedNode
} from '../redux/networkSlice';
import { matchingEdge, range } from '../utils/helpers';

const Graph = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectNetworkData);
  const selectedNode = useSelector(selectSelectedNode);
  const routingData = useSelector(selectRoutingData);

  // DataSets for the network
  const { nodes, edges } = React.useMemo(() => ({
    nodes: new DataSet<Node>(),
    edges: new DataSet<Edge>(),
  }), []);

  // Add data state to the DataSets
  React.useEffect(() => {
    if (nodes.length < data.nodes.length) {
      // Add new nodes
      nodes.update(data.nodes);
    } else {
      // Remove excess nodes
      nodes.remove(range(data.nodes.length, nodes.length));
    }

    // Add edges and hide zeroes
    edges.clear();
    edges.update(data.edges);
    edges.remove(data.edges.filter(e => e.label === '0').map(e => e.id));

    // Flush changes
    nodes.flush?.();
    edges.flush?.();
  }, [data, nodes, edges]);

  const containerRef = React.useRef(null);
  const [network, setNetwork] = React.useState<Network>();

  // Initialise network
  React.useEffect(() => {
    if (!containerRef.current) return;

    const initialData = { nodes, edges };

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
      },
      physics: {
        solver: 'barnesHut'
      }
    };

    const newNetwork = new Network(containerRef.current, initialData, options);
    setNetwork(newNetwork);

    return () => newNetwork.destroy();
  }, [edges, nodes]);

  // Make sure selected node/edges stays selected on data change
  React.useEffect(() => {
    if (network) {
      if (selectedNode) {
        network.setSelection({
          nodes: [selectedNode.id],
          edges: getRouteEdges(data.edges, routingData, selectedNode.id)
        });
      } else {
        network.unselectAll();
      }

    }
  }, [network, data, selectedNode, routingData]);

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

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

const getRouteEdges = (
  edges: Edge[],
  routingData: RoutingData,
  node: number
): number[] => {
  if (!routingData.data || !routingData.data[node]) return [];

  if (routingData.algorithm === "LS") {
    const iterations = routingData.data[node];
    const final = iterations[iterations.length - 1];

    const selectedEdges: number[] = [];
    for (let i = 0; i < final.pred.length; i++) {
      const edge = edges.find(e => matchingEdge(e, i, final.pred[i]));
      if (edge && edge.label !== '0') selectedEdges.push(edge.id);
    }

    return selectedEdges;
  } else {
    return [];
  }
}

export default Graph;