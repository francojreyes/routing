import React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import { NonNullRoutingData } from '../types';
import { selectNetworkData, selectRoutingData } from '../redux/networkSlice';
import { calculateLSRow } from '../utils/linkState';
import { useSelector } from '../redux/hooks';
import { Link, Sheet } from '@mui/joy';

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
    <Sheet sx={{ maxHeight: 300, overflow: 'auto' }}>
      <Table
        borderAxis="both"
        size="sm"
        stickyHeader
        stickyFooter
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
        <tfoot>
          <tr>
            <td colSpan={3} style={{ textAlign: 'center' }}>
              Click <Link href="#">here</Link> to see calculations
            </td>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  )
}


export default ForwardingTable;