/**
 * Redux slice to manage stuff related to the network
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { Algorithm, NetworkData, Node, RoutingData } from '../types';
import { calculateLinkStateData } from '../utils/linkstate';
import { matchingEdge } from '../utils/helpers';

interface NetworkState {
  data: NetworkData;
  selectedNode: Node | null;
  routing: RoutingData;
}

const initialState: NetworkState = {
  data: {
    nodes: [
      { id: 0, label: '0', shape: 'circle' },
      { id: 1, label: '1', shape: 'circle' },
    ],
    edges: [
      { id: 0, from: 0, to: 1, label: '1' },
    ]
  },
  selectedNode: null,
  routing: {
    algorithm: "LS",
    data: [
      [
        { vSet: [0, 1], dist: [0, Infinity], pred: [-1, -1] },
        { vSet: [0], dist: [0, 1], pred: [-1, 0] },
        { vSet: [], dist: [0, 1], pred: [-1, 0] },
      ],
      [
        { vSet: [0, 1], dist: [Infinity, 0], pred: [-1, -1] },
        { vSet: [1], dist: [1, 0], pred: [1, -1] },
        { vSet: [], dist: [1, 0], pred: [1, -1] },
      ],
    ]
  }
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNumNodes: (state, action: PayloadAction<number>) => {
      const n = action.payload;
      const network = state.data;
      if (isNaN(n) || n < 2) return;
      if (n > network.nodes.length) {
        // Add nodes
        while (network.nodes.length < n) {
          network.nodes.push({
            id: network.nodes.length,
            label: network.nodes.length.toString(),
            shape: 'circle'
          });
        }
      } else {
        // Take the first n nodes, and remove all edges to removed nodes
        network.nodes = network.nodes.slice(0, n);
        network.edges = network.edges.filter(edge => edge.from <= n && edge.to <= n);

        // Unselect
        if (state.selectedNode && state.selectedNode.id >= n) {
          state.selectedNode = null;
        }
      }

      state.routing = calculateRoutingData(state, state.routing.algorithm);
    },
    updateEdge: (state, action: PayloadAction<{ from: number, to: number, cost: number }>) => {
      const { from, to, cost } = action.payload;
      if (from === to) return;

      const network = state.data;
      if (cost === 0) {
        // Remove edge
        network.edges = network.edges.filter(edge => !matchingEdge(edge, from, to));
      } else {
        const edge = network.edges.find(edge => matchingEdge(edge, from, to));
        if (edge) {
          // Update cost
          edge.label = cost.toString();
        } else {
          // New edge
          network.edges.push({
            id: Math.max(...network.edges.map(e => e.id)) + 1,
            from,
            to,
            label: cost.toString()
          });
        }
      }

      state.routing = calculateRoutingData(state, state.routing.algorithm);
    },
    selectNode: (state, action: PayloadAction<Node>) => {
      state.selectedNode = action.payload;
    },
    deselectNode: (state) => {
      state.selectedNode = null;
    },
    setAlgorithm: (state, action: PayloadAction<Algorithm>) => {
      state.routing = calculateRoutingData(state, action.payload);
    },
  }
});

const calculateRoutingData = (
  state: NetworkState,
  algorithm: Algorithm
): RoutingData => {
  return {
    algorithm: "LS",
    data: calculateLinkStateData(state.data)
  };
}

export const { setNumNodes, updateEdge, selectNode, deselectNode, setAlgorithm } = networkSlice.actions;

export const selectNetworkData = (state: RootState) => state.network.data;
export const selectSelectedNode = (state: RootState) => state.network.selectedNode;
export const selectAlgorithm = (state: RootState) => state.network.routing.algorithm;

export const selectRoutingData = (state: RootState) => state.network.routing;



export default networkSlice.reducer;