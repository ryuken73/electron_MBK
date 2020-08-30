import React from 'react';
// import ImageCard from './ImageCard';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import BorderedBox from './template/BorderedBox';
import Button from '@material-ui/core/Button';
import SaveItem from './SaveItem';

const toggleCheck = () => {};

const firsttElement = array => array[0];
const lastElement = array => array[array.length - 1];


function SaveList(props) {

  const sampleItem = {
    title: '아이유.wav',
    path: 'c://temp//아이유.wave',
    totalBytes: 12322322,
    receivedBytes: 12322322,
    processedPercent: 100,
    status: 'COMPLETE',
    downloadTime: new Date().toLocaleString(),
    id: Date.now()+1
  }
  const items = new Array(20);
  items.fill(sampleItem)

  const {pageIndex, imageData=[], hidden} = props;
  // console.log('&&&&&&&&&&&&&&&&&&&&&', hidden, imageData)
  const {fileTypes, fileSizeMin, fileSizeMax, filePatterns} = props;
  const {imagePreviewOpen, imagePreviewSrc} = props;
  const {imageShow, imagePreviewSrcIndex, imagePreviewSrcName} = props;
  const onStart = () => {};

  const RIGHT_KEY = 39;
  const LEFT_KEY = 37;
  const ESCAPE_KEY = 27;
  const DELETE_KEY = 46;

  const handleClose = () => {
    setImagePreviewOpen(false);
  }

  const handleKeyDown = (event) => {
    const key = event.keyCode;
    console.log(key)
    key === RIGHT_KEY && setNextImage();
    key === LEFT_KEY && setPrevImage();
    key === ESCAPE_KEY && handleClose();
    key === DELETE_KEY && delCurrentImage();
  }

  const delCurrentImage = () => {
    delImage(imagePreviewSrcIndex);
    setNextImage();
  }

  return (
    <BorderedBox display={hidden ? 'none':'flex'} alignContent="center" alignItems="flex-start" flexGrow="1" border="0" minWidth="auto" flexBasis="0" overflow="auto" bgcolor="black">
      <Box display="flex" flexDirection="column" flexWrap="wrap" width={1} overflow="auto">
        {items.map(item => <SaveItem key={item.id} item={item}></SaveItem>)}
      </Box>
    </BorderedBox>
  );
}

export default React.memo(SaveList);
