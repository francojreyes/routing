import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import FormLabel from '@mui/joy/FormLabel';
import { Input } from '@mui/joy';
import { GraphData } from '../types';

interface ConsoleProps {
  graphData: GraphData;
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

const Console: React.FC<ConsoleProps> = ({
  graphData,
  setGraphData
}) => {

  const setNumNodes = (n: number) => {
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
        edges: curr.edges.filter(
          edge => edge.from && edge.from <= n && edge.to && edge.to <= n
        )
      }));
    }
  }

  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, left: 20, zIndex: 100 }}>
      <Typography level='h3' mb={1}>Routing Visualiser</Typography>

      <FormLabel>
        Number of Nodes
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


    </Card>
  )
}

export default Console;
