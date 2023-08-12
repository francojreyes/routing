import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import { GraphData, Algorithm, Node } from '../types';

interface ForwardingTableProps {
  graphData: GraphData;
  algorithm: Algorithm;
  selectedNode: Node | null;
}

const ForwardingTable: React.FC<ForwardingTableProps> = ({
  graphData,
  algorithm,
  selectedNode
}) => {


  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
      {selectedNode
        ? <Typography level='h4'>Forwarding Table for Node {selectedNode.id}</Typography>
        : <Typography>Select a node to see its forwarding table.</Typography>
      }
    </Card>
  )
}

export default ForwardingTable;