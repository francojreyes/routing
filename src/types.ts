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
  algorithm: 'LS';
  data: LinkStateData | null;
} | {
  algorithm: 'DV';
  data: DistanceVectorData | null;
}

export type NonNullRoutingData = {
  algorithm: 'LS';
  data: LinkStateData;
} | {
  algorithm: 'DV';
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

export type DistanceVectorData = Array<{
  neighbours: DistanceVector[];
  self: DistanceVector;
}>;

export interface ForwardingTableRow {
  dist: number;
  next: string;
}
