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
  
  const {page, statusHidden, currentPageId} = props;
  const {addPage, addItem, setCurrentPageId, updateProgress, setStatusHidden} = props.ItemActions;

  console.log('#### rerender app.js', currentPageId)
  React.useEffect(() => {
    const pageId = new Date().toDateString();
    addPage(pageId);
    setCurrentPageId(pageId);
    // ipcRenderer.on('downloadStarted', onDownloadStart);
    ipcRenderer.on('downloadProgress', onUpdateProgress);
    ipcRenderer.on('downloadInterrupted', onUpdateStatus('INTERRUPTED'));
    ipcRenderer.on('downloadPaused', onUpdateStatus('PAUSED'));
    ipcRenderer.on('downloadCompleted', onUpdateStatus('COMPLETED'));
    ipcRenderer.on('downloadFailed', onUpdateStatus('FAILED'));
  },[])

  React.useEffect(() => {
    console.log('^^^ trigger attaching event handler for download start', currentPageId);
    // to refresh event handler
    ipcRenderer.removeAllListeners('downloadStarted');
    ipcRenderer.on('downloadStarted', onDownloadStart(currentPageId));
  },[currentPageId])

  const onDownloadStart = currentPageId => {
    return (event, itemInfo) => {
      const {startDate} = itemInfo;
      if(startDate.toDateString() !== currentPageId){
        
      }
      console.log(startDate, currentPageId);
      addItem({pageId:currentPageId, itemInfo});
      hideBrowser();
    }
  }

  const onUpdateProgress = (event, progressInfo) => {
      const {id, receivedBytes} = progressInfo;
      updateProgress({pageId:currentPageId, id, receivedBytes});
  }
  const onUpdateStatus = status => {
      return (event, id) => {
          // updateDownloadStatus(id, status);
          console.log(id, status)
      }
  }

  const showBrowser = event => {
    const mainWindow = getCurrentWindow();
    const view = mainWindow.getBrowserView();
    const [width, height] = mainWindow.getSize()
    // view.setBounds(webViewBound);
    view.setBounds({x:0, y:35, width:width-20, height:height-10});
    view.setAutoResize({width:true, height:true});
    setStatusHidden(true);
  }

  const hideBrowser = event => {
    const mainWindow = getCurrentWindow();
    const view = mainWindow.getBrowserView();
    view.setBounds({x:5, y:35, width:0, height:0}); 
    view.setAutoResize({width:false, height:false});
    setStatusHidden(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" height="1">
        <WebView showBrowser={showBrowser} hideBrowser={hideBrowser}></WebView>   
        <Box display={statusHidden ? "none": "flex"} className="itemList" flexDirection="column" flexGrow="1" px="3px">
          <SavePanelContainer></SavePanelContainer>
          <SaveTabContainer></SaveTabContainer>
          <MessageContainer></MessageContainer>
        </Box>
      </Box>

    </ThemeProvider>
  );
}

export default App;
   