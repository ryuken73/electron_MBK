import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function ItemCardList(props) {
  const {cardItems} = props;
  console.log('$$$$$$$$$$$$$$$$$$$$$$',cardItems)
  return (
    <Box display="flex">
      {[...cardItems].map(([cardId, cardItem]) => {
        return <Box key={cardId}>{cardItem.fname}</Box>
      })}
    </Box>
  );
}