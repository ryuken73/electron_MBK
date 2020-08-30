import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FullHeightContainer from './template/FullHeightContainer';
import FirstChildSection from './template/FirstChildSection';
import WebView from './WebView';
import DownloadStatus from './DownloadStatus';
import SavePanelContainer from './SavePanel';
import SaveTabContainer from './SaveTab';
import SaveListContainer from './SaveList';
import MessageContainer from './MessagePanel';
const { BrowserView, getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

const theme = createMuiTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
    body1: {
      fontSize: 12,
      fontWeight: 500, 
    },
    button: {
      // fontStyle: 'italic',
    },
  },
});


function App(props) {
  
  const {downloadItems, statusHidden} = props;
  const {addItem, updateProgress, setStatusHidden} = props.ItemActions;

  React.useEffect(() => {
    ipcRenderer.on('downloadStarted', onDownloadStart);
    ipcRenderer.on('downloadProgress', onUpdateProgress);
    ipcRenderer.on('downloadInterrupted', onUpdateStatus('INTERRUPTED'));
    ipcRenderer.on('downloadPaused', onUpdateStatus('PAUSED'));
    ipcRenderer.on('downloadCompleted', onUpdateStatus('COMPLETED'));
    ipcRenderer.on('downloadFailed', onUpdateStatus('FAILED'));
  },[])

  const onDownloadStart = (event, itemInfo) => {
    addItem({itemInfo});
    showView();
  }
  const onUpdateProgress = (event, progressInfo) => {
      const {id, receivedBytes} = progressInfo;
      updateProgress({id, receivedBytes});
  }
  const onUpdateStatus = status => {
      return (event, id) => {
          // updateDownloadStatus(id, status);
          console.log(id, status)
      }
  }

  const showView = event => {
    const mainWindow = getCurrentWindow();
    const [width, height] = mainWindow.getSize();
    const view = mainWindow.getBrowserView();
    view.setBounds({x:5, y:30, width:width-400, height:height-10})
    setStatusHidden(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" height="1">
        <WebView
          setStatusHidden = {setStatusHidden}
        ></WebView>   
        <Box className="itemList" display="flex" flexDirection="column" flexGrow="1" px="3px">
          <SavePanelContainer></SavePanelContainer>
          <SaveTabContainer></SaveTabContainer>
          <MessageContainer></MessageContainer>
          {/* <ImageTabsContainer></ImageTabsContainer>
          <MessagePanelContainer></MessagePanelContainer> */}
        </Box>
        {/* <DownloadStatus 
          downloadItems = {downloadItems}
          hidden = {statusHidden}
        ></DownloadStatus>        */}
      </Box>

    </ThemeProvider>
  );
}

export default App;
   