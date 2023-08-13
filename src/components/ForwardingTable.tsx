import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import { NetworkData, Algorithm, Node } from '../types';

interface ForwardingTableProps {
  networkData: NetworkData;
  algorithm: Algorithm;
  selectedNode: Node | null;
}

const ForwardingTable: React.FC<ForwardingTableProps> = ({
  networkData,
  algorithm,
  selectedNode
}) => {

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
