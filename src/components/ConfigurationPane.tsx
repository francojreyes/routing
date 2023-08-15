import Card from '@mui/joy/Card';
import React from 'react';
import Typography from '@mui/joy/Typography';
import FormLabel from '@mui/joy/FormLabel';
import { Input, Stack, Box, Button, ToggleButtonGroup } from '@mui/joy';
import { useDispatch, useSelector } from '../redux/hooks';
import { selectAlgorithm, selectNetworkData, setAlgorithm, setNumNodes, updateEdge } from '../redux/networkSlice';

const ConfigurationPane = () => {
  const dispatch = useDispatch();
  const networkData = useSelector(selectNetworkData);
  const algorithm = useSelector(selectAlgorithm);

  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(1);
  const [cost, setCost] = React.useState(1);

  return (
    <Card variant="outlined" sx={{ width: 300, position: 'fixed', top: 20, left: 20, zIndex: 100 }}>
      <Typography level='h3' mb={1}>Configuration</Typography>

      <Typography level='h4'>Routing Algorithm</Typography>
      <FormLabel>
        Select algorithm
        <ToggleButtonGroup
          sx={{ width: '100%' }}
          size='md'
          value={algorithm}
          onChange={(_, value) => dispatch(setAlgorithm(value ?? "LS"))}
        >
          <Button sx={{ width: '50%' }} value="LS">Link State</Button>
          <Button sx={{ width: '50%' }} value="DV" disabled>Distance Vector</Button>
        </ToggleButtonGroup>
      </FormLabel>

      <Typography level='h4'>Nodes</Typography>
      <FormLabel>
        Number of nodes
        <Input
          fullWidth
          type="number"
          value={networkData.nodes.length}
          onChange={e => dispatch(setNumNodes(e.target.valueAsNumber))}
          slotProps={{ input: { min: 2, step: 1 }, }}
        />
      </FormLabel>

      <Typography level='h4'>Edges</Typography>
      <Stack direction='row' width='100%' justifyContent='space-between'>
        {[
          { label: 'From', value: from, setValue: setFrom, inputProps: { min: 0, max: networkData.nodes.length - 1, step: 1 } },
          { label: 'To', value: to, setValue: setTo, inputProps: { min: 0, max: networkData.nodes.length - 1, step: 1 } },
          { label: 'Cost', value: cost, setValue: setCost, inputProps: { min: 0, step: 1 } }
        ].map(({ label, value, setValue, inputProps }) => (
          <Box width='32%' key={label}>
            <FormLabel>
              {label}
              <Input
                fullWidth
                type="number"
                value={value}
                onChange={e => setValue(e.target.valueAsNumber)}
                slotProps={{ input: inputProps }}
              />
            </FormLabel>
          </Box>
        ))}
      </Stack>
      <Button onClick={() => dispatch(updateEdge({ from, to, cost }))}>Update Edge</Button>

    </Card>
  )
}

export default ConfigurationPane;
