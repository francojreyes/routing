import React from 'react';
import { useSelector } from '../redux/hooks';
import { selectNetworkData, selectRoutingData } from '../redux/networkSlice';
import Table from '@mui/joy/Table';
import { calculateLSRow } from '../utils/linkstate';
import Typography from '@mui/joy/Typography';
import { NonNullRoutingData } from '../types';

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
      return { dist: -1, next: -1 };
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