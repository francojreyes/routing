// Calculations for Link State routing

import { DijkstraData, NetworkData } from '../types';

type Graph = {
  from: number,
  to: number,
  weight: number
}[][];

export const calculateLinkStateData = (network: NetworkData) => {
  const graph = networkToGraph(network);
  return Array.from({ length: graph.length }, (_, idx) => dijkstra(graph, idx));
}

// Convert network data to an adjacency list graph
const networkToGraph = (network: NetworkData): Graph => {
  const graph: Graph = [];
  for (let i = 0; i < network.nodes.length; i++) {
    graph.push([]);
  }

  for (const edge of network.edges) {
    graph[edge.from].push({ from: edge.from, to: edge.to, weight: +edge.label });
    graph[edge.to].push({ from: edge.to, to: edge.from, weight: +edge.label });
  }

  return graph;
}

// Run Dijkstra's and return a list containing the data at each iteration
const dijkstra = (graph: Graph, src: number): DijkstraData[] => {
  const nV = graph.length;
  const curr: DijkstraData = {
    vSet: Array.from({ length: nV }, (_, idx) => idx),
    dist: Array.from({ length: nV }, () => Infinity),
    pred: Array.from({ length: nV }, () => -1)
  }
  curr.dist[src] = 0;

  const iterations = [structuredClone(curr)];
  while (curr.vSet.length) {
    const v = minBy(curr.vSet, v => curr.dist[v]);

    for (const edge of graph[v]) {
      if (curr.dist[v] + edge.weight < curr.dist[edge.to]) {
        curr.dist[edge.to] = curr.dist[v] + edge.weight;
        curr.pred[edge.to] = v;
      }
    }

    curr.vSet = removeItem(curr.vSet, v);
    iterations.push(structuredClone(curr));
  }

  return iterations;
}

// Helper function to get the minimum in an array by some criteria
const minBy = <T>(arr: T[], keyFunc: (item: T) => number): T => {
  return arr.reduce((min, curr) => {
    return keyFunc(curr) < keyFunc(min) ? curr : min;
  }, arr[0]);
}

const removeItem = <T>(arr: Array<T>, value: T): Array<T> => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
