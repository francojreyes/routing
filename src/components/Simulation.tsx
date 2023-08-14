import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import { useSelector } from '../redux/hooks';
import { selectSelectedNode } from '../redux/networkSlice';
import { Button } from '@mui/joy';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const Simulation = () => {
  const selectedNode = useSelector(selectSelectedNode);

  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
      <Typography level='h3' mb={1}>Simulation</Typography>

      <Button endDecorator={<SkipNextIcon/>}>Iterate Simulation</Button>

      <Typography level='h4'>
        Forwarding Table {selectedNode ? `for Node ${selectedNode.id}` : ""}
      </Typography>
      {!selectedNode
        ? <Typography level='body-sm'>Select a node to see its forwarding table.</Typography>
        : <Typography>Table goes here</Typography>
      }
    </Card>
  )
}

export default Simulation;