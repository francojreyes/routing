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
  dest: number;
  dist: number;
  next: number;
}>;

export type DistanceVectorData = Array<{
  received: DistanceVector[];
  self: DistanceVector;
}>;

export interface ForwardingTableEntry {
  dest: number;
  dist: number;
  next: string;
}

export type Graph = {
  from: number,
  to: number,
  weight: number
}[][];