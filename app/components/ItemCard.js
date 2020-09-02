import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {SmallButton} from './template/smallComponents';
import utils from '../utils';

const { shell } = require('electron').remote;

const StyledCardContent = withStyles({
  root: {
    padding: '0px!important'
  }
})(CardContent);

const useStyles = makeStyles({
  card: {
    marginLeft: '5px',
    overflow: "visible"
    // minWidth: 250,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14, 
  },
  pos: {
    marginBottom: 12,
  },
});



const TextBox = ({children, ...props}) => {

  const defaultProps = {
      mx: "12px",
      fontSize: 11,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
  }
  const mergedProps = {
      ...defaultProps,
      ...props
  }
  return (<Box {...mergedProps}>{children}</Box>)
}

export default function ItemCard(props) {
  console.log(props)
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(true);
  },[])

  const {fname, receivedBytes, totalBytes, savePath} = props.cardItem;
  const disabled = (receivedBytes !== totalBytes)
  const formattedRecvBytes = utils.number.niceBytes(receivedBytes);  
  const formattedTotalBytes = utils.number.niceBytes(totalBytes);  
  console.log('!!!!!!!!!!!!!',formattedRecvBytes, formattedTotalBytes)
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const onClickOpen = event => {
    // shell.openItem(savePath)
    shell.showItemInFolder(savePath)
  }

  return (
    <Grow in={show} timeout={1000}>
      <Card className={classes.card}>
        <StyledCardContent>
          <Box display='flex' alignItems="center">
            <Box display='flex' flexDirection="column">
              <TextBox>
                {fname}  
              </TextBox>      
              <TextBox fontSize="9px" color="gray" mt="2px">
                ({formattedRecvBytes}/{formattedTotalBytes})
              </TextBox> 
            </Box>  
            <SmallButton 
              fontSize={"10px"}
              // padding={"5px"}
              m="3px" 
              disabled={disabled}
              color="primary" 
              variant={"contained"}
              onClick={onClickOpen}
            >open
            </SmallButton>      
          </Box>
        </StyledCardContent>
      </Card>
    </Grow>
  );
}