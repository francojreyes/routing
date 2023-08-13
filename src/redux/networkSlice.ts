/**
 * Redux slice to manage stuff related to the network
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { Algorithm, NetworkData, Node } from '../types';
import { Edge } from 'vis-network';

interface NetworkState {
  data: NetworkData;
  algorithm: Algorithm;
  selectedNode: Node | null;
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
  algorithm: 'LS',
  selectedNode: null
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
    },
    selectNode: (state, action: PayloadAction<Node>) => {
      state.selectedNode = action.payload;
    },
    deselectNode: (state) => {
      state.selectedNode = null;
    },
    setAlgorithm: (state, action: PayloadAction<Algorithm>) => {
      state.algorithm = action.payload;
    },
  }
});

const matchingEdge = (e: Edge, u: number, v: number): boolean => {
  return (e.from === u && e.to === v) || (e.from === v && e.to === u);
}

export const { setNumNodes, updateEdge, selectNode, deselectNode, setAlgorithm } = networkSlice.actions;

export const selectNetworkData = (state: RootState) => state.network.data;
export const selectSelectedNode = (state: RootState) => state.network.selectedNode;
export const selectAlgorithm = (state: RootState) => state.network.algorithm;


export default networkSlice.reducer;