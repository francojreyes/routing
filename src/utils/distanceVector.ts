import { DistanceVector, DistanceVectorData, Edge, Graph, NetworkData } from '../types';
import { matchingEdge, networkToGraph } from './helpers';

export const calculateRoutingDataDV = (
  network: NetworkData,
  prev: DistanceVectorData
): DistanceVectorData => {
  return networkToGraph(network).map((adj, i) => {
    // Get the 'received' vectors from previous iteration
    const received = adj.map(edge => prev[edge.to]?.self);

    return {
      received,
      adj,
      self: calculateDistanceVector(adj, received, i)
        .filter(({ dest }) => dest < network.nodes.length)
    }
  });
}

export const updateDVData1 = (
  network: NetworkData,
  prev: DistanceVectorData[number],
  node: number
): DistanceVectorData[number] => {
  const graph = networkToGraph(network);
  return {
    received: prev.received,
    adj: graph[node],
    self: calculateDistanceVector(graph[node], prev.received, node)
      .filter(({ dest }) => dest < network.nodes.length)
  };
}

// Takes in an array of edges, and the distance vectors received from those edges
const calculateDistanceVector = (
  adj: Graph[number],
  vectors: DistanceVector[],
  node: number
): DistanceVector => {
  const res: DistanceVector = [{ dest: node, dist: 0, next: -1 }];
  for (let i = 0; i < adj.length; i++) {
    if (vectors[i]) {
      for (const entry of vectors[i]) {
        // Find current entry in distance vector
        const existingEntry = res.find(e => e.dest === entry.dest);

        // Ignore routing through self
        if (entry.next === node) {
          continue;
        }

        const dist = entry.dist + adj[i].weight;
        if (!existingEntry) {
          res.push({ dest: entry.dest, dist, next: adj[i].to });
        } else if (dist < existingEntry.dist) {
          existingEntry.dist = dist;
          existingEntry.next = adj[i].to;
        }
      }
    } else {
      res.push({ dest: adj[i].to, dist: adj[i].weight, next: adj[i].to });
    }

  }

  return res.sort((a, b) => a.dest - b.dest);
}

export const calculateInitialData = (
  network: NetworkData,
  node: number
): DistanceVectorData[number] => {
  const graph = networkToGraph(network)

  const vector = graph[node]
    .map(edge => ({ dest: edge.to, dist: edge.weight, next: edge.to }))
  vector.push({ dest: node, dist: 0, next: -1 });

  return {
    received: [],
    adj: graph[node],
    self: vector.sort((a, b) => a.dest - b.dest)
  }
}

export const selectEdgesDV = (
  edges: Edge[],
  data: DistanceVectorData,
  src: number
): number[] => {
  return doSelectEdges(
    edges,
    data,
    src,
    data[src].self.map(entry => entry.dest).filter(i => i !== src),
    new Set<number>()
  );
}

// Recursive helper - gets edges from current node towards all destinations
// and recurses until the destinations are reached
const doSelectEdges = (
  edges: Edge[],
  data: DistanceVectorData,
  curr: number,
  dests: number[],
  visited: Set<number>
): number[] => {
  const res: number[] = [];

  // At destination
  if (dests.length === 1 && dests[0] === curr) {
    return res;
  }

  // Visited
  if (visited.has(curr)) {
    return res;
  }
  visited.add(curr);

  // Track which nodes to recurse on
  const nexts = new Map<number, number[]>();
  for (const dest of dests) {
    // Find matching entry in data
    const entry = data[curr].self.find(e => e.dest === dest);
    if (!entry || entry.next === -1) continue;

    // Find matching edge
    const edge = edges.find(e => matchingEdge(e, curr, entry.next));
    if (edge && edge.label !== '0') res.push(edge.id);

    // Add to next
    if (nexts.has(entry.next)) {
      nexts.get(entry.next)?.push(dest);
    } else {
      nexts.set(entry.next, [dest]);
    }
  }

  // Recurse
  nexts.forEach((nextDests, next) => {
    res.push(...doSelectEdges(edges, data, next, nextDests, visited))
  });

  return res;
}
