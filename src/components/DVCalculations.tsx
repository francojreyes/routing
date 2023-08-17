import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Table from '@mui/joy/Table';
import React from 'react';
import { DistanceVectorData } from '../types';
import { minBy, range } from '../utils/helpers';

interface DVCalculationsProps {
  nodeId: number;
  data: DistanceVectorData[number];
}

const DVCalculations: React.FC<DVCalculationsProps> = ({ nodeId, data }) => {
  return (
    <>
      <Typography level="h4">Received Distance Vectors</Typography>
      <Stack direction="column" spacing={2} mb={1}>
        {data.received.length
          ? <>
            <Typography fontSize="sm">
              The following distance vectors were received from Node {nodeId}'s neighbours.
              Each element in the table represents the distance to Destination <b>from</b> Neighbour.
            </Typography>
            <DVTable data={data} node={nodeId}/>
          </>
          : <Typography fontSize="sm">
            Node {nodeId} has not yet received any distance vectors.
          </Typography>
        }
      </Stack>
      <Typography level="h4">Calculated Distance Vector</Typography>
      <Stack direction="column" spacing={1}>
        <Typography fontSize="sm">
          Below are the distances from Node {nodeId} to each of its neighbours:
        </Typography>
        <Table borderAxis="bothBetween" variant="outlined">
          <thead>
          <tr>
            <th style={{ width: 100 }}>Neighbour</th>
            {data.adj.map(({ to }, i) => (
              <th key={i}>{to}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">Distance</th>
            {data.adj.map(({ weight }, i) => (
              <td key={i}>{weight}</td>
            ))}
          </tr>
          </tbody>
        </Table>
        <Typography fontSize="sm">
          Adding these to the distance vectors above, we get the distance to
          Destination <b>via</b> Neighbour. The minimum distances (highlighted)
          form the distance vector.
        </Typography>
        <DVTable data={data} node={nodeId} final/>
      </Stack>
    </>
  )
}

interface DVTableProps {
  data: DistanceVectorData[number];
  node: number;
  final?: boolean;
}

const DVTable: React.FC<DVTableProps> = ({ data, node, final }) => {
  // Get a list of nodes that the distance/path to are currently known
  const known: number[] = [];
  for (const vector of data.received) {
    for (const entry of vector) {
      if (entry.dest !== node && !known.includes(entry.dest)) {
        known.push(entry.dest);
      }
    }
  }

  for (const edge of data.adj) {
    if (edge.to !== node && !known.includes(edge.to)) {
      known.push(edge.to);
    }
  }

  known.sort((a, b) => a - b);

  const calcDist = (from: number, to: number): string => {
    // Find matching distance vector
    const vector = data.received.find(v => v.find(e => e.dest === from)?.dist === 0);

    // Find matching entry
    const entry = vector?.find(e => e.dest === to);

    // Find matching edge
    const edge = data.adj.find(e => e.to === from);

    if (entry && vector) {
      if (final && edge) {
        return (entry.dist + edge.weight).toString();
      } else {
        return entry.dist.toString();
      }
    } else {
      return edge && to === from ? edge.weight.toString() : "-";
    }
  }

  // Get distances
  const distances: string[][] = known.map((to) => (
    data.adj.map(({ to: from }) => (
      calcDist(from, to)
    ))
  ));

  const mins = distances.map(row =>
    minBy(range(row.length), i => row[i] === "-" ? Infinity : +row[i])
  );

  return (
    <Table borderAxis="bothBetween" variant="outlined">
      <thead>
        <tr>
          <th rowSpan={2} style={{ width: 100 }}>Destination</th>
          <th colSpan={data.adj.length} style={{ textAlign: 'center' }}>Neighbour</th>
        </tr>
        <tr>
          {data.adj.map(({ to }, i) => (
            <th
              key={i}
              style={{
                ...(i === 0 && { borderTopLeftRadius: 0 }),
                ...(i === data.adj.length - 1 && { borderTopRightRadius: 0 })
              }}
            >{to}</th>
          ))}
        </tr>
      </thead>
        <tbody>
          {known.map((to, i) => (
            <tr key={i}>
              <th scope="row">Node {to}</th>
              {data.adj.map((_, j) => (
                <td
                  key={i}
                  style={{ ...(final && mins[i] === j && {
                    backgroundColor: 'var(--joy-palette-primary-300, #97C3F0)',
                    color: 'var(--joy-palette-primary-800, #0A2744)'
                  })}}
                >{distances[i][j]}</td>
              ))}
            </tr>
          ))}
        </tbody>
    </Table>
  );
}

export default DVCalculations;