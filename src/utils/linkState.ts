// Calculations for Link State routing

import { DijkstraData, ForwardingTableRow, NetworkData } from '../types';
import { minBy, range, replicate } from './helpers';

type Graph = {
  from: number,
  to: number,
  weight: number
}[][];

export const calculateLinkStateData = (network: NetworkData) => {
  const graph = networkToGraph(network);
  return range(graph.length).map(node => dijkstra(graph, node));
}

export const calculateLSRow = (
  data: DijkstraData[],
  src: number,
  dest: number
): ForwardingTableRow => {
  // Extract data from final iteration
  const final = data[data.length - 1];
  if (!final || dest >= final.pred.length || final.dist[dest] === Infinity) {
    return {
      dist: Infinity,
      next: "-"
    }
  }

  // Loop back through pred array
  let curr = dest;
  while (curr !== -1 && final.pred[curr] !== src) {
    curr = final.pred[curr];
  }

  return {
    dist: final.dist[dest],
    next: `Node ${curr}`
  }
}

// Convert network data to an adjacency list graph
const networkToGraph = (network: NetworkData): Graph => {
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

// Run Dijkstra's and return a list containing the data at each iteration
const dijkstra = (graph: Graph, src: number): DijkstraData[] => {
  const nV = graph.length;
  const curr: DijkstraData = {
    vSet: [],
    dist: replicate(nV, Infinity),
    pred: replicate(nV, -1)
  }

  // Initialisation step (3331 variant)
  curr.vSet.push(src);
  curr.dist[src] = 0;
  for (const edge of graph[src]) {
    curr.dist[edge.to] = edge.weight;
    curr.pred[edge.to] = src;
  }

  const iterations = [structuredClone(curr)];
  while (curr.vSet.length < nV) {
    const unused = range(nV).filter(v => !curr.vSet.includes(v));
    const v = minBy(unused, v => curr.dist[v]);
    if (curr.dist[v] === Infinity) break;

    for (const edge of graph[v]) {
      if (curr.dist[v] + edge.weight < curr.dist[edge.to]) {
        curr.dist[edge.to] = curr.dist[v] + edge.weight;
        curr.pred[edge.to] = v;
      }
    }

    curr.vSet.push(v);
    iterations.push(structuredClone(curr));
  }

  return iterations;
}

