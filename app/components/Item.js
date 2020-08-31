import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import ProgressWithPercent from './template/ProgressWithPercent';
import {SmallButton, SmallMarginTextField} from './template/smallComponents'


export default function Item(props){
    const imageShow = false;
    const {fname, savePath, url, totalBytes, receivedBytes, status, downloadStartTime} = props.item;
    const processedPercent = ((receivedBytes/totalBytes) * 100).toFixed(0);
    const onClickCheckBox = () => {};
    return (
        <Box display="flex" width="0.9" justifyContent="flex-start" alignItems="center">
            <Checkbox color="primary" checked={imageShow} onChange={onClickCheckBox}>Image Show</Checkbox>
            <Grid container spacing={1} alignItems="center">
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">{fname}</Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">{savePath}</Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">{receivedBytes}/{totalBytes}</Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Box mx="10px">
                        <SmallButton size="small" color="primary" variant={"contained"}>open</SmallButton>
                    </Box>
                </Grid>
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">{processedPercent}</Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">{status}</Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Box mx="10px">
                        <Typography variant="caption">{new Date(downloadStartTime).toLocaleString()}</Typography>
                    </Box>
                </Grid>

            </Grid>

        </Box>
    )
}