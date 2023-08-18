import React from 'react';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import ForwardingTable from './ForwardingTable';
import { useDispatch, useSelector } from '../redux/hooks';
import {
  clearRoutingData,
  iterate,
  selectNetworkData,
  selectRoutingData,
  selectSelectedNode
} from '../redux/networkSlice';
import Stack from '@mui/joy/Stack';

const SimulationPane = () => {
  const selectedNode = useSelector(selectSelectedNode);
  const routingData = useSelector(selectRoutingData);
  const network = useSelector(selectNetworkData);
  const dispatch = useDispatch();

  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
      <Typography level='h3'>Simulation</Typography>


      <Stack spacing={1}>
        <Button startDecorator={<SkipNextIcon/>} onClick={() => dispatch(iterate())}>
          {routingData.algorithm === "LS" ? "Flood Link State" : "Send Distance Vectors"}
        </Button>
        <Button
          startDecorator={<ClearIcon/>}
          onClick={() => dispatch(clearRoutingData())}
          variant="soft"
          color="neutral"
        >
          Clear Routing Data
        </Button>
      </Stack>

      <Typography level='h4' mb={-1}>
        Forwarding Table {selectedNode ? `for Node ${selectedNode.id}` : ""}
      </Typography>
      {!selectedNode
        ? <Typography level='body-sm'>Select a node to see its forwarding table.</Typography>
        : <ForwardingTable nodeId={selectedNode.id} routingData={routingData} numNodes={network.nodes.length}/>
      }
    </Card>
  )
}

export default SimulationPane;
