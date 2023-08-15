import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import { useDispatch, useSelector } from '../redux/hooks';
import { iterate, selectSelectedNode } from '../redux/networkSlice';
import { Button } from '@mui/joy';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ForwardingTable from './ForwardingTable';

const SimulationPane = () => {
  const selectedNode = useSelector(selectSelectedNode);
  const dispatch = useDispatch();

  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
      <Typography level='h3'>Simulation</Typography>

      <Button startDecorator={<SkipNextIcon/>} onClick={() => dispatch(iterate())}>
        Iterate Simulation
      </Button>

      <Typography level='h4' mb={-1}>
        Forwarding Table {selectedNode ? `for Node ${selectedNode.id}` : ""}
      </Typography>
      {!selectedNode
        ? <Typography level='body-sm'>Select a node to see its forwarding table.</Typography>
        : <ForwardingTable nodeId={selectedNode.id}/>
      }
    </Card>
  )
}

export default SimulationPane;