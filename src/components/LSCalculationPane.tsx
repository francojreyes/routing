import React from 'react';
import Typography from '@mui/joy/Typography';
import { DijkstraData } from '../types';
import { Divider } from '@mui/joy';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Table from '@mui/joy/Table';
import Card from '@mui/joy/Card';
import CloseIcon from '@mui/icons-material/Close';

interface LSCalculationCardProps {
  close: () => void;
  nodeId: number;
  data: DijkstraData[];
}

const LSCalculationPane: React.FC<LSCalculationCardProps> = ({
  close,
  nodeId,
  data
}) => {
  return (
    <Card sx={{ width: 450, position: 'fixed', top: 20, left: 20, zIndex: 100, maxHeight: 'calc(100vh - 40px)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography level="h3">
          Calculations for Node {nodeId}
        </Typography>
        <CloseIcon onClick={close} sx={{ '&:hover': { cursor: 'pointer' } }}/>
      </Stack>
      <Divider sx={{ mb: 0 }}/>
      <Stack
        sx={{
          height: '100%',
          overflow: 'scroll',
          mx: 'calc(-1 * var(--ModalDialog-padding))',
          px: 'var(--ModalDialog-padding)',
          py: 1.5
        }}
      >
        <Typography level="h4">Dijkstra's Algorithm Iterations</Typography>
        <Stack direction="column" spacing={2} mb={1}>
          {data.map((iter, idx) => (
            <DijkstraIteration num={idx} data={iter} key={idx}/>
          ))}
          <Typography fontSize="sm">
            The costs in the forwarding table are derived from the distances in the
            final iteration.
          </Typography>
        </Stack>
        <Typography level="h4">Calculated Routes</Typography>
        <Typography fontSize="sm" mb={1}>
          The next node to forward to are found by using the predecessors in
          the final iteration to calculate the shortest routes from Node {nodeId}:
        </Typography>
        <Table borderAxis="bothBetween" size="sm" variant="outlined">
          <thead>
            <tr>
              <th style={{ width: 25 }}>Destination</th>
              <th style={{ width: 100 }}>Route</th>
            </tr>
          </thead>
          <tbody>
            {data[data.length - 1].pred.map((_, idx) => (
              <tr key={idx}>
                <th scope="row">Node {idx}</th>
                <td>{calculatePath(data[data.length - 1].pred, idx)?.join(" → ") ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Typography fontSize="sm">

        </Typography>
      </Stack>
    </Card>
  );
}

interface DijkstraIterationProps {
  num: number;
  data: DijkstraData;
}

const DijkstraIteration: React.FC<DijkstraIterationProps> = ({ num, data }) => {
  return (
    <Box>
      <Typography fontWeight="bolder">{num ? `Iteration ${num}:` : "Initial State:" }</Typography>
      <Box pl={1}>
        <Typography fontSize="sm" mb={0.5}>
          <Typography>Visited nodes:</Typography> {data.vSet.join(", ")}
        </Typography>
        <Table sx={{ width: 'auto' }} borderAxis="both" size="sm">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Node</th>
              {data.dist.map((_, i) => (
                <th style={{ width: 30 }} key={i}>{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Distance</th>
              {data.dist.map((d, i) => (
                <td key={i}>{d !== Infinity ? d : "-"}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Predecessor</th>
              {data.pred.map((p, i) => (
                <td key={i}>{p !== -1 ? p : "-"}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      </Box>
    </Box>
  )
}

// Prints the path (in reverse) from src to dest according to pred
const calculatePath = (pred: number[], dest: number): number[] | null => {
  // No path
  if (pred[dest] === -1) {
    return null;
  }

  // Backtrack
  const path: number[] = [];
  let v = dest;
  while (v !== -1) {
    path.unshift(v);
    v = pred[v];
  }
  return path;
}

export default LSCalculationPane;