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

export interface NetworkData {
  nodes: Node[],
  edges: Edge[]
}

export type Algorithm = 'LS' | 'DV';

export type RoutingData = {
  type: 'LS';
  data: LinkStateData;
} | {
  type: 'DV';
  data: DistanceVectorData;
}

export type LinkStateData = DijkstraData[][];

export interface DijkstraData {
  vSet: number[];
  dist: number[];
  pred: number[];
}

export type DistanceVector = Array<{
  dist: number;
  next: number;
}>;

export interface DistanceVectorData {
  neighbours: DistanceVector[];
  self: DistanceVector;
}
