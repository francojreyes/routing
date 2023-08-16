/**
 * Redux slice to manage stuff related to the network
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { Algorithm, NetworkData, Node, RoutingData } from '../types';
import { calculateLinkStateData } from '../utils/linkState';
import { matchingEdge, range } from '../utils/helpers';
import { generateRandomNetwork } from '../utils/randomNetwork';

interface NetworkState {
  data: NetworkData;
  selectedNode: Node | null;
  routing: RoutingData;
  showCalculations: boolean;
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
    data: []
  },
  showCalculations: false
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNumNodes: (state, action: PayloadAction<number>) => {
      const n = action.payload;
      const network = state.data;
      if (n > network.nodes.length) {
        // Add nodes
        network.nodes.push(...range(network.nodes.length, n).map(i => ({
          id: i,
          label: i.toString(),
          shape: 'circle'
        } as Node)));
      } else {
        // Take the first n nodes, and remove all edges to removed nodes
        network.nodes = network.nodes.slice(0, n);
        network.edges = network.edges.map(e => {
          if (e.from < n && e.to < n) {
            return e;
          } else {
            return { ...e, label: '0' }
          }
        });

        // Unselect
        if (state.selectedNode && state.selectedNode.id >= n) {
          state.selectedNode = null;
          state.showCalculations = false;
        }
      }
    },
    updateEdge: (state, action: PayloadAction<{ from: number, to: number, cost: number }>) => {
      const { from, to, cost } = action.payload;
      if (from === to) return;

      const network = state.data;
      const edge = network.edges.find(edge => matchingEdge(edge, from, to));
      if (edge) {
        // Update cost
        edge.label = cost.toString();
      } else {
        // New edge
        network.edges.push({
          id: network.edges.length,
          from,
          to,
          label: cost.toString()
        });
      }
    },
    randomiseNetwork: (state) => {
      state.data = generateRandomNetwork();
      state.selectedNode = null;
      state.showCalculations = false;
      state.routing = { algorithm: "LS", data: [] };
    },
    selectNode: (state, action: PayloadAction<Node>) => {
      state.selectedNode = action.payload;
    },
    deselectNode: (state) => {
      state.selectedNode = null;
      state.showCalculations = false;
    },
    setAlgorithm: (state, action: PayloadAction<Algorithm>) => {
      state.routing = { algorithm: "LS", data: [] };
    },
    iterate: (state) => {
      state.routing = calculateRoutingData(state, state.routing.algorithm);
    },
    showCalculations: (state) => {
      state.showCalculations = true;
    },
    hideCalculations: (state) => {
      state.showCalculations = false;
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

export const {
  setNumNodes,
  updateEdge,
  randomiseNetwork,
  selectNode,
  deselectNode,
  setAlgorithm,
  iterate,
  showCalculations,
  hideCalculations
} = networkSlice.actions;

export const selectNetworkData = (state: RootState) => state.network.data;
export const selectSelectedNode = (state: RootState) => state.network.selectedNode;
export const selectAlgorithm = (state: RootState) => state.network.routing.algorithm;

export const selectRoutingData = (state: RootState) => state.network.routing;

export const selectShowCalculations = (state: RootState) => state.network.showCalculations;



export default networkSlice.reducer;