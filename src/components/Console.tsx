import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import FormLabel from '@mui/joy/FormLabel';
import { Input, Stack, Box, Button, ToggleButtonGroup } from '@mui/joy';
import { GraphData, Algorithm } from '../types';
import { Edge } from 'vis-network';

interface ConsoleProps {
  graphData: GraphData;
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
  algorithm: Algorithm;
  setAlgorithm: React.Dispatch<React.SetStateAction<Algorithm>>;
}

const Console: React.FC<ConsoleProps> = ({
  graphData,
  setGraphData,
  algorithm,
  setAlgorithm
}) => {

  const setNumNodes = (n: number) => {
    if (isNaN(n) || n < 2) return;
    const newNodes = [...graphData.nodes];
    if (n > newNodes.length) {
      // Add nodes
      while (newNodes.length < n) {
        newNodes.push({
          id: newNodes.length + 1,
          label: (newNodes.length + 1).toString(),
          shape: 'circle'
        });
      }
      setGraphData(curr => ({ ...curr, nodes: newNodes }));
    } else {
      // Take the first n nodes, and remove all edges to removed nodes
      setGraphData(curr => ({
        nodes: curr.nodes.slice(0, n),
        edges: curr.edges.filter(edge => edge.from <= n && edge.to <= n)
      }));
    }
  }

  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(2);
  const [cost, setCost] = React.useState(1);

  const updateEdge = React.useCallback(() => setGraphData(curr => {
    let newEdges = [...curr.edges];
    if (cost === 0) {
      // Remove edge
      newEdges = newEdges.filter(edge => !matchingEdge(edge, from, to));
    } else {
      const edge = newEdges.find(edge => matchingEdge(edge, from, to));
      if (edge) {
        // Update cost
        edge.label = cost.toString();
      } else {
        // New edge
        newEdges.push({
          id: Math.max(...newEdges.map(e => e.id)) + 1,
          from,
          to,
          label: cost.toString()
        });
      }
    }

    return { ...curr, edges: newEdges };
  }), [from, to, cost, setGraphData]);

  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, left: 20, zIndex: 100 }}>
      <Typography level='h3' mb={1}>Routing Visualiser</Typography>

      <Typography level='h4'>Routing Algorithm</Typography>
      <FormLabel>
        Select algorithm
        <ToggleButtonGroup
          sx={{ width: '100%' }}
          value={algorithm}
          onChange={(_, value) => setAlgorithm(value ?? "LS")}
        >
          <Button sx={{ width: '50%' }} value="LS">Link State</Button>
          <Button sx={{ width: '50%' }} value="DV" disabled>Distance Vector</Button>
        </ToggleButtonGroup>
      </FormLabel>

      <Typography level='h4'>Nodes</Typography>
      <FormLabel>
        Number of nodes
        <Input
          fullWidth
          type="number"
          value={graphData.nodes.length}
          onChange={e => setNumNodes(e.target.valueAsNumber)}
          slotProps={{
            input: {
              min: 2,
              step: 1
            },
          }}
        />
      </FormLabel>

      <Typography level='h4'>Edges</Typography>
      <Stack direction='row' width='100%' justifyContent='space-between'>
        <Box width='32%'>
          <FormLabel>
            From
            <Input
              fullWidth
              type="number"
              value={from}
              onChange={e => setFrom(e.target.valueAsNumber)}
              slotProps={{
                input: {
                  min: 1,
                  max: graphData.nodes.length,
                  step: 1
                },
              }}
            />
          </FormLabel>
        </Box>
        <Box width='32%'>
          <FormLabel>
            To
            <Input
              fullWidth
              type="number"
              value={to}
              onChange={e => setTo(e.target.valueAsNumber)}
              slotProps={{
                input: {
                  min: 1,
                  max: graphData.nodes.length,
                  step: 1
                },
              }}
            />
          </FormLabel>
        </Box>
        <Box width='32%'>
          <FormLabel>
            Cost
            <Input
              fullWidth
              type="number"
              value={cost}
              onChange={e => setCost(e.target.valueAsNumber)}
              slotProps={{
                input: {
                  min: 0,
                  step: 1
                },
              }}
            />
          </FormLabel>
        </Box>
      </Stack>
      <Button onClick={updateEdge}>Update Edge</Button>

    </Card>
  )
}

const matchingEdge = (e: Edge, u: number, v: number): boolean => {
  return (e.from === u && e.to === v) || (e.from === v && e.to === u);
}

export default Console;
