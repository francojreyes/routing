import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import { useSelector } from '../redux/hooks';
import { selectSelectedNode } from '../redux/networkSlice';

const ForwardingTable = () => {
  const selectedNode = useSelector(selectSelectedNode);

  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
      {selectedNode
        ? <Typography level='h4'>Forwarding Table for Node {selectedNode.id}</Typography>
        : <Typography level='body-sm'>Select a node to see its forwarding table.</Typography>
      }
    </Card>
  )
}

export default ForwardingTable;
