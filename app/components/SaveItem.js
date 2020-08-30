import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import ProgressWithPercent from './template/ProgressWithPercent';

export default function SaveItem(props){
    const imageShow = true;
    const onClickCheckBox = () => {};
    return (
        <Box display="flex" width="0.9" justifyContent="flex-start" alignItems="center">
            <Checkbox color="primary" checked={imageShow} onChange={onClickCheckBox}>Image Show</Checkbox>
            <Grid container spacing={1}>
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">Image Show</Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Typography variant="caption">Image Show</Typography>
                </Grid>
                <Grid>
                    <Typography variant="caption">Image Show</Typography>
                </Grid>
            </Grid>

        </Box>
    )
}