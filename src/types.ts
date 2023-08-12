export interface Node {
  id: number;
  label: string;
  shape: 'circle';
}

export interface Edge {
  id: number;
  from: number;
  to: number;
  label: string;
}

export interface GraphData {
  nodes: Node[],
  edges: Edge[]
}

export type Algorithm = 'LS' | 'DV';