import React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import { LinkStateData } from '../types';
import { calculateLSRow } from '../utils/linkState';
import { Link, Sheet } from '@mui/joy';
import LSCalculationModal from './LSCalculationModal';

interface ForwardingTableProps {
  nodeId: number;
  routingData: LinkStateData;
}

const LSForwardingTable: React.FC<ForwardingTableProps> = ({
  nodeId,
  routingData
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  // Get data for src node
  const nodeData = routingData[nodeId];
  if (!nodeData) {
    return (
      <Typography level='body-sm'>
        No data for this node. Iterate the simulation to calculate forwarding table.
      </Typography>
    );
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
            {nodeData[nodeData.length - 1].dist.map((_, idx) => {
              if (idx === nodeId) return null;
              const { dist, next } = calculateLSRow(nodeData, nodeId, idx);
              return (
                <tr key={idx}>
                  <td>Node {idx}</td>
                  <td>{dist !== Infinity ? dist : "-"}</td>
                  <td>{next}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                Click <Link onClick={() => setModalOpen(true)}>here</Link> to see calculations
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
      <LSCalculationModal
        open={modalOpen}
        setOpen={setModalOpen}
        nodeId={nodeId}
        data={nodeData}
      />
    </>
  )
}

export default LSForwardingTable;
