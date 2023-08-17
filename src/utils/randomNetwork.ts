import { NetworkData } from '../types';


type Point = { x: number, y: number }
type Line = { v: number, w: number, weight: number }

// From https://stackoverflow.com/a/71010232
export const generateRandomNetwork = (): NetworkData => {
  // Randomly generate number of nodes
  const n = randInt(5, 9);

  // Assign random x,y locations to the nodes
  const nodes: Point[] =
    Array.from({ length: n }, () => ({ x: randInt(0, 100), y: randInt(0, 100)}));
  const edges: Line[] = [];

  while (true) {
    const unconnectedNodes = nodes.map((_, idx) => idx).filter(node =>
      edges.every(edge => edge.v !== node && edge.w !== node)
    );

    // Loop until all nodes have at least one connected edge
    if (!unconnectedNodes.length) break;

    // Select a random node with no edge
    const v = unconnectedNodes[randInt(0, unconnectedNodes.length)];

    // Select some random nodes
    const ws = nodes
      .map((_, idx) => idx)
      .filter(node => node !== v)
      .sort(() => Math.random() * 2 - 1)
      .slice(0, Math.ceil(0.4 * n));
    for (const w of ws) {
      // Check if edge v-w intersects previous edges
      const newEdge = { v, w, weight: randInt(1, 11) };
      if (edges.every(edge => !intersect(edge, newEdge, nodes))) {
        edges.push(newEdge);
      }
    }
  }

  return {
    nodes: nodes.map((_, idx) => ({
      id: idx,
      label: idx.toString(),
      shape: 'circle'
    })),
    edges: edges.map((edge, idx) => ({
      id: idx,
      from: edge.v,
      to: edge.w,
      label: edge.weight.toString()
    }))
  }
}

const randInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const intersect = (l1: Line, l2: Line, points: Point[]): boolean => {
  if ((l1.v === l2.v && l1.w === l2.w)
      || (l1.v === l2.w && l1.w === l2.v)
  ) return true;

  const { x: a, y: b } = points[l1.v];
  const { x: c, y: d } = points[l1.w];
  const { x: p, y: q } = points[l2.v];
  const { x: r, y: s } = points[l2.v];

  // Returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
  // From https://stackoverflow.com/a/24392281
  const det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};
