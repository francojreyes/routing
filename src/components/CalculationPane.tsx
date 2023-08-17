import React from 'react';
import Typography from '@mui/joy/Typography';
import { RoutingData } from '../types';
import { Divider } from '@mui/joy';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import CloseIcon from '@mui/icons-material/Close';
import LSCalculations from './LSCalculations';

interface CalculationPaneProps {
  close: () => void;
  nodeId: number;
  data: RoutingData;
}

const CalculationPane: React.FC<CalculationPaneProps> = ({
  close,
  nodeId,
  data
}) => {
  return (
    <Card sx={{ width: 450, position: 'fixed', top: 20, left: 20, zIndex: 100, maxHeight: 'calc(100vh - 40px)', gap: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography level="h3">
          Calculations for Node {nodeId}
        </Typography>
        <CloseIcon onClick={close} sx={{ '&:hover': { cursor: 'pointer' } }}/>
      </Stack>
      <Divider sx={{ mt: 1 }}/>
      <Stack
        sx={{
          height: '100%',
          mx: 'calc(-1 * var(--Card-padding))',
          px: 'var(--Card-padding)',
          overflow: 'scroll',
          py: 1.5
        }}
      >
        {data.algorithm === "LS"
          ? <LSCalculations nodeId={nodeId} data={data.data[nodeId]}/>
          : <Typography>DV calculations go here</Typography>
        }
      </Stack>
    </Card>
  );
}

export default CalculationPane;