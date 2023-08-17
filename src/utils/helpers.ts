import { Edge } from 'vis-network';
import { Graph, NetworkData } from '../types';

// Return whether an edge matches
export const matchingEdge = (e: Edge, u: number, v: number): boolean => {
  return (e.from === u && e.to === v) || (e.from === v && e.to === u);
}

// Get array containing the numbers start (incl.) to end (excl.)
// If no start is provided, it is 0
function range(end: number): number[];
function range(start: number, end: number): number[];
function range(startOrEnd: number, end?: number): number[] {
  return Array.from(
    { length: end ? end - startOrEnd : startOrEnd },
    (_, i) => (end ? startOrEnd : 0) + i
  );
}
export { range };

export const replicate = <T>(n: number, val: T): T[] => {
  return Array.from({ length: n }, () => val);
}

// Helper function to get the minimum in an array by some criteria
export const minBy = <T>(arr: T[], keyFunc: (item: T) => number): T => {
  return arr.reduce((min, curr) => {
    return keyFunc(curr) < keyFunc(min) ? curr : min;
  }, arr[0]);
}

// Remove an item from an array
export const removeItem = <T>(arr: Array<T>, value: T): Array<T> => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// Convert network data to an adjacency list graph
export const networkToGraph = (network: NetworkData): Graph => {
  const graph: Graph = [];
  for (let i = 0; i < network.nodes.length; i++) {
    graph.push([]);
  }

  for (const edge of network.edges) {
    if (edge.label === '0') continue;
    graph[edge.from].push({ from: edge.from, to: edge.to, weight: +edge.label });
    graph[edge.to].push({ from: edge.to, to: edge.from, weight: +edge.label });
  }

  return graph;
}