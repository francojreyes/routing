import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import FormLabel from '@mui/joy/FormLabel';
import { Input, Stack, Box, Button, ToggleButtonGroup } from '@mui/joy';
import { NetworkData, Algorithm } from '../types';
import { Edge } from 'vis-network';

interface ConsoleProps {
  networkData: NetworkData;
  setNetworkData: React.Dispatch<React.SetStateAction<NetworkData>>;
  algorithm: Algorithm;
  setAlgorithm: React.Dispatch<React.SetStateAction<Algorithm>>;
}

const Console: React.FC<ConsoleProps> = ({
  networkData,
  setNetworkData,
  algorithm,
  setAlgorithm
}) => {

  const setNumNodes = (n: number) => {
    if (isNaN(n) || n < 2) return;
    const newNodes = [...networkData.nodes];
    if (n > newNodes.length) {
      // Add nodes
      while (newNodes.length < n) {
        newNodes.push({
          id: newNodes.length,
          label: newNodes.length.toString(),
          shape: 'circle'
        });
      }
      setNetworkData(curr => ({ ...curr, nodes: newNodes }));
    } else {
      // Take the first n nodes, and remove all edges to removed nodes
      setNetworkData(curr => ({
        nodes: curr.nodes.slice(0, n),
        edges: curr.edges.filter(edge => edge.from <= n && edge.to <= n)
      }));
    }
  }

  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(1);
  const [cost, setCost] = React.useState(1);

  const updateEdge = React.useCallback(() => setNetworkData(curr => {
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
  }), [from, to, cost, setNetworkData]);

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
          value={networkData.nodes.length}
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
        {[
          { label: 'From', value: from, setValue: setFrom, inputProps: { min: 0, max: networkData.nodes.length - 1, step: 1 } },
          { label: 'To', value: to, setValue: setTo, inputProps: { min: 0, max: networkData.nodes.length - 1, step: 1 } },
          { label: 'Cost', value: cost, setValue: setCost, inputProps: { min: 0, step: 1 } }
        ].map(({ label, value, setValue, inputProps }) => (
          <Box width='32%' key={label}>
            <FormLabel>
              {label}
              <Input
                fullWidth
                type="number"
                value={value}
                onChange={e => setValue(e.target.valueAsNumber)}
                slotProps={{ input: inputProps }}
              />
            </FormLabel>
          </Box>
        ))}
      </Stack>
      <Button onClick={updateEdge}>Update Edge</Button>

    </Card>
  )
}

const matchingEdge = (e: Edge, u: number, v: number): boolean => {
  return (e.from === u && e.to === v) || (e.from === v && e.to === u);
}

export default Console;
