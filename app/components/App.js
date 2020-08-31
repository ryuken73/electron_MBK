import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FullHeightContainer from './template/FullHeightContainer';
import FirstChildSection from './template/FirstChildSection';
import WebView from './WebView';
import SavePanelContainer from './ControlPanel';
import SaveTabContainer from './ItemTab';
import SaveListContainer from './ItemList';
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
  
  const {statusHidden, todayTabId} = props;
  const {setTodayTabId, setStatusHidden} = props.AppActions;
  const {addTab, addTabItem, updateTabItem} = props.ItemListActions;

  console.log('#### rerender app.js', todayTabId)
  React.useEffect(() => {
    const tabId = new Date().toDateString();
    addTab(tabId);
    setTodayTabId(tabId);
    // ipcRenderer.on('downloadStarted', onDownloadStart);
    // ipcRenderer.on('downloadProgress', onUpdateProgress);
    // ipcRenderer.on('downloadInterrupted', onUpdateStatus('INTERRUPTED'));
    // ipcRenderer.on('downloadPaused', onUpdateStatus('PAUSED'));
    // ipcRenderer.on('downloadCompleted', onUpdateStatus('COMPLETED'));
    // ipcRenderer.on('downloadFailed', onUpdateStatus('FAILED'));
  },[])

  React.useEffect(() => {
    console.log('^^^ trigger attaching event handler for download start', todayTabId);
    // to refresh event handler
    ipcRenderer.removeAllListeners('downloadStarted');
    ipcRenderer.removeAllListeners('downloadProgress');
    ipcRenderer.removeAllListeners('downloadStatusChanged');

    ipcRenderer.on('downloadStarted', onDownloadStart(todayTabId));
    ipcRenderer.on('downloadProgress', onUpdateProgress(todayTabId));
    ipcRenderer.on('downloadStatusChanged', onUpdateStatus(todayTabId));

  },[todayTabId])

  const onDownloadStart = todayTabId => {
    return (event, itemInfo) => {
      const {downloadStartTime} = itemInfo;
      console.log(`${downloadStartTime}`)
      const downloadStartDate = new Date(downloadStartTime).toDateString();
      const DATE_CHANGED = downloadStartDate !== todayTabId || false;
      console.log(`date : [${todayTabId}] to [${downloadStartDate}]`);

      if(DATE_CHANGED){
        console.log(`date changed from [${todayTabId}] to [${downloadStartDate}]`);
        addTab(downloadStartDate);
        setTodayTabId(downloadStartDate);
        todayTabId = downloadStartDate;
      }
      addTabItem({tabId: todayTabId, itemInfo});
      hideBrowser();
    }
  }

  const onUpdateProgress = todayTabId => {
    return (event, progressInfo) => {
      const {id, receivedBytes} = progressInfo;
      updateTabItem({tabId:todayTabId, itemId:id, property: 'receivedBytes', value: receivedBytes});
    }
  }
  
  const onUpdateStatus = todayTabId => {
    return (event, statusInfo) => {
      const {id, status} = statusInfo;
      updateTabItem({tabId:todayTabId, itemId:id, property: 'status', value: status});
      
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
   