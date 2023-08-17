import { DistanceVector, DistanceVectorData, Edge, Graph, NetworkData } from '../types';
import { matchingEdge, networkToGraph } from './helpers';

export const calculateRoutingDataDV = (
  network: NetworkData,
  prev: DistanceVectorData
): DistanceVectorData => {
  return networkToGraph(network).map((adj) => {
    // Get the 'received' vectors from previous iteration
    const received = adj.map(edge => prev[edge.to].self);

    return {
      received,
      self: calculateDistanceVector(adj, received)
    }
  });
}

// Takes in an array of edges, and the distance vectors received from those edges
const calculateDistanceVector = (
  adj: Graph[number],
  vectors: DistanceVector[]
): DistanceVector => {
  console.assert(adj.length === vectors.length);

  const res: DistanceVector = [];
  for (let i = 0; i < adj.length; i++) {
    for (const entry of vectors[i]) {
      // Find current entry in distance vector
      const existingEntry = res.find(e => e.dest === entry.dest);
      const dist = entry.dist + adj[i].weight;
      if (!existingEntry) {
        res.push({ dest: entry.dest, dist, next: i });
      } else if (existingEntry.dist < dist) {
        existingEntry.dist = dist;
        existingEntry.next = i;
      }
    }
  }

  return res.sort((a, b) => a.dest - b.dest);
}

export const calculateInitialData = (
  network: NetworkData
): DistanceVectorData => {
  return networkToGraph(network).map(adj => ({
    received: [],
    self: adj
      .map(edge => ({ dest: edge.to, dist: edge.weight, next: edge.to }))
      .sort((a, b) => a.dest - b.dest)
  }));
}

export const selectEdgesDV = (
  edges: Edge[],
  data: DistanceVectorData,
  src: number
): Edge[] => {
  return doSelectEdges(edges, data, src, data[src].self.map(entry => entry.dest));
}

// Recursive helper - gets edges from current node towards all destinations
// and recurses until the destinations are reached
const doSelectEdges = (
  edges: Edge[],
  data: DistanceVectorData,
  curr: number,
  dests: number[]
): Edge[] => {
  const res: Edge[] = [];

  // At destination
  if (dests.length === 1 && dests[0] === curr) {
    return res;
  }

  // Track which nodes to recurse on
  const nexts = new Map<number, number[]>();
  for (const dest of dests) {
    // Find matching entry in data
    const entry = data[curr].self.find(e => e.dest === dest);
    if (!entry) continue;

    // Find matching edge
    const edge = edges.find(e => matchingEdge(e, curr, entry.next));
    if (edge && edge.label !== '0') res.push(edge);

    // Add to next
    if (nexts.has(entry.next)) {
      nexts.get(entry.next)?.push(dest);
    } else {
      nexts.set(entry.next, [dest]);
    }
  }

  // Recurse
  nexts.forEach((nextDests, next) => {
    res.push(...doSelectEdges(edges, data, next, nextDests))
  });

  return res;
}
