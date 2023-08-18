/**
 * Redux slice to manage stuff related to the network
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { Algorithm, NetworkData, Node, RoutingData } from '../types';
import { calculateRoutingDataLS } from '../utils/linkState';
import { matchingEdge, range } from '../utils/helpers';
import { generateRandomNetwork } from '../utils/randomNetwork';
import { calculateInitialData, calculateRoutingDataDV, updateDVData1 } from '../utils/distanceVector';

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

        // Initialise DV data
        if (state.routing.algorithm === "DV") {
          state.routing.data.push(
            ...range(network.nodes.length, n).map(i => calculateInitialData(network, i))
          );
        }
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

        // Recalculate distance vectors with updated edge weight
        if (state.routing.algorithm === "DV") {
          state.routing.data[from] = updateDVData1(network, state.routing.data[from], from);
          state.routing.data[to] = updateDVData1(network, state.routing.data[to], to);
        }
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
      state.routing = calculateInitialRoutingData(state.data, state.routing.algorithm);
    },
    resetNetwork: (state) => {
      state.data = initialState.data;
      state.selectedNode = null;
      state.showCalculations = false;
      state.routing = calculateInitialRoutingData(state.data, state.routing.algorithm);
    },
    selectNode: (state, action: PayloadAction<Node>) => {
      if (!state.routing.data[action.payload.id]) {
        state.showCalculations = false;
      }
      state.selectedNode = action.payload;
    },
    deselectNode: (state) => {
      state.selectedNode = null;
      state.showCalculations = false;
    },
    setAlgorithm: (state, action: PayloadAction<Algorithm>) => {
      if (action.payload === state.routing.algorithm) return;
      state.routing = calculateInitialRoutingData(state.data, action.payload);
    },
    iterate: (state) => {
      state.routing = calculateRoutingData(state.data, state.routing);
    },
    clearRoutingData: (state) => {
      state.showCalculations = false;
      state.routing = calculateInitialRoutingData(state.data, state.routing.algorithm);
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
  network: NetworkData,
  routingData: RoutingData
): RoutingData => {
  if (routingData.algorithm === "LS") {
    return {
      algorithm: "LS",
      data: calculateRoutingDataLS(network)
    };
  } else {
    return {
      algorithm: "DV",
      data: calculateRoutingDataDV(network, routingData.data)
    }
  }
}

const calculateInitialRoutingData = (
  network: NetworkData,
  algorithm: Algorithm
): RoutingData => {
  if (algorithm === "LS") {
    return { algorithm, data: [] };
  } else {
    return {
      algorithm,
      data: network.nodes.map(
        (_, i) => calculateInitialData(network, i)
      )
    };
  }
}

export const {
  setNumNodes,
  updateEdge,
  resetNetwork,
  randomiseNetwork,
  selectNode,
  deselectNode,
  setAlgorithm,
  iterate,
  clearRoutingData,
  showCalculations,
  hideCalculations
} = networkSlice.actions;

export const selectNetworkData = (state: RootState) => state.network.data;
export const selectSelectedNode = (state: RootState) => state.network.selectedNode;
export const selectAlgorithm = (state: RootState) => state.network.routing.algorithm;

export const selectRoutingData = (state: RootState) => state.network.routing;

export const selectShowCalculations = (state: RootState) => state.network.showCalculations;



export default networkSlice.reducer;