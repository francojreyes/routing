import React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import { NonNullRoutingData } from '../types';
import { selectNetworkData, selectRoutingData } from '../redux/networkSlice';
import { calculateLSRow } from '../utils/linkState';
import { useSelector } from '../redux/hooks';

interface ForwardingTableProps {
  nodeId: number;
}

const ForwardingTable: React.FC<ForwardingTableProps> = ({ nodeId }) => {
  const network = useSelector(selectNetworkData);
  const routingData = useSelector(selectRoutingData);

  if (!routingData.data || !routingData.data[nodeId]) {
    return (
      <Typography level='body-sm'>
        No data yet. Iterate the simulation to calculate forwarding table.
      </Typography>
    );
  }

  const calculateRow = (dest: number, data: NonNullRoutingData) => {
    if (data.algorithm === "LS") {
      return calculateLSRow(data.data, nodeId, dest);
    } else {
      return { dist: Infinity, next: '-' };
    }
  }

  return (
    <Table
      borderAxis="both"
      size="sm"
      stickyHeader
      variant="plain"
    >
      <thead>
        <tr>
          <th>Destination</th>
          <th>Cost</th>
          <th>Next Node</th>
        </tr>
      </thead>
      <tbody>
        {network.nodes.map(node => {
          if (node.id === nodeId) return null;
          const { dist, next } = calculateRow(node.id, routingData as NonNullRoutingData);
          return (
            <tr key={node.id}>
              <td>Node {node.id}</td>
              <td>{dist !== Infinity ? dist : "-"}</td>
              <td>{next}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}


export default ForwardingTable;