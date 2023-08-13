import { Edge } from 'vis-network';

export const matchingEdge = (e: Edge, u: number, v: number): boolean => {
  return (e.from === u && e.to === v) || (e.from === v && e.to === u);
}