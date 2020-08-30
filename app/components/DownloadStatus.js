import React from 'react';
import Box from '@material-ui/core/Box'
import BorderedBox from './template/BorderedBox';

export default function DownloadStatus({downloadItems, hidden}) {
    return (
        <BorderedBox display={hidden ? 'none':'block'} height="1" flexBasis="450px" marginLeft="auto">
            <BorderedBox height="25px" display='flex' alignContent="center" alignItems="flex-start" flexGrow="1" border="0" minWidth="auto" flexBasis="0" overflow="auto" bgcolor="black">
                targe directory : xxx
            </BorderedBox> 
            <BorderedBox height="95%" display='flex' flexDirection="column" alignContent="center" alignItems="flex-start" flexGrow="1" border="0" minWidth="auto" flexBasis="0" overflow="auto" bgcolor="black">
                {[...downloadItems.values()].map(item => <Box key={item.id}>{item.fname}</Box>)}
            </BorderedBox>
        </BorderedBox>
    )
}
