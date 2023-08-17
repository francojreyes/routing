// Calculations for Link State routing

import { DijkstraData, Edge, ForwardingTableEntry, Graph, LinkStateData, NetworkData } from '../types';
import { matchingEdge, minBy, networkToGraph, range, replicate } from './helpers';

export const calculateRoutingDataLS = (network: NetworkData) => {
  const graph = networkToGraph(network);
  return range(graph.length).map(node => dijkstra(graph, node));
}

export const calculateRowLS = (
  data: DijkstraData[],
  src: number,
  dest: number
): ForwardingTableEntry => {
  // Extract data from final iteration
  const final = data[data.length - 1];
  if (!final || dest >= final.pred.length || final.dist[dest] === Infinity) {
    return {
      dest,
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
    dest,
    dist: final.dist[dest],
    next: `Node ${curr}`
  }
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

export const selectEdgesLS = (
  edges: Edge[],
  data: LinkStateData,
  src: number
) => {
  const iterations = data[src];
  const final = iterations[iterations.length - 1];

  const selectedEdges: number[] = [];
  for (let i = 0; i < final.pred.length; i++) {
    const edge = edges.find(e => matchingEdge(e, i, final.pred[i]));
    if (edge && edge.label !== '0') selectedEdges.push(edge.id);
  }

  return selectedEdges;
}

