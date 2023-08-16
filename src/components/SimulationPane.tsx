import React from 'react';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import LSForwardingTable from './LSForwardingTable';
import { useDispatch, useSelector } from '../redux/hooks';
import { iterate, selectRoutingData, selectSelectedNode } from '../redux/networkSlice';

const SimulationPane = () => {
  const selectedNode = useSelector(selectSelectedNode);
  const routingData = useSelector(selectRoutingData);
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
        : routingData.algorithm === "LS"
          ? <LSForwardingTable nodeId={selectedNode.id} routingData={routingData.data}/>
          : <Typography>DV Table goes here</Typography>
      }
    </Card>
  )
}

export default SimulationPane;
