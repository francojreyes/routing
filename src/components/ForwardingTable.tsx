import React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import { ForwardingTableEntry, RoutingData } from '../types';
import { calculateRowLS } from '../utils/linkState';
import { Link, Sheet } from '@mui/joy';
import { useDispatch } from '../redux/hooks';
import { showCalculations } from '../redux/networkSlice';

interface ForwardingTableProps {
  nodeId: number;
  routingData: RoutingData;
  numNodes: number;
}

const ForwardingTable: React.FC<ForwardingTableProps> = ({
  nodeId,
  routingData,
  numNodes
}) => {
  const dispatch = useDispatch();

  // Get data for src node
  if (!routingData.data[nodeId]) {
    return (
      <Typography level='body-sm'>
        No data for this node. Iterate the simulation to calculate forwarding table.
      </Typography>
    );
  }

  let rows: ForwardingTableEntry[];
  if (routingData.algorithm === "LS") {
    const srcData = routingData.data[nodeId];
    rows = srcData[srcData.length - 1].dist.map(
      (_, idx) => calculateRowLS(srcData, nodeId, idx)
    )
  } else {
    rows = routingData.data[nodeId].self.map(({ dest, dist, next }) => ({
      dest,
      dist,
      next: `Node ${next.toString()}`
    }));
  }

  return (
    <>
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
            {rows.map(({ dest, dist, next }) => dest !== nodeId && dest < numNodes && (
              <tr key={dest}>
                <td>Node {dest}</td>
                <td>{dist !== Infinity ? dist : "-"}</td>
                <td>{next}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                Click <Link onClick={() => dispatch(showCalculations())}>here</Link> to see calculations
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </>
  )
}

export default ForwardingTable;
