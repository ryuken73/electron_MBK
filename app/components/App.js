import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FullHeightContainer from './template/FullHeightContainer';
import FirstChildSection from './template/FirstChildSection';
import WebView from './WebView';
import ControlPanelContainer from '../containers/ControlPanelContainer';
import ItemTabContainer from '../containers/ItemTabContainer';
// import SaveListContainer from './ItemList';
import MessageContainer from './MessagePanel';
const { BrowserView, getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');
const ConfigParser = require('configparser');
const config = new ConfigParser();
const utils = require('../utils');
const path = require('path');
const fs = require('fs');

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
  
  const {statusHidden, todayTabId, hostAddress, cardItems} = props; 
  const {setTodayTabId, setStatusHidden, setHostAddress} = props.AppActions;
  const {addTab, addItemNCard, addTabItem, updateTabItem, updateItemNCard} = props.ItemListActions;
  const {setSaveDirectory} = props.ControlPanelActions;
  const {clearItemCards} = props.CardListActions;

  console.log('#### rerender app.js', todayTabId, cardItems)
  React.useEffect(() => {
    const localStorageKey = 'musicbank';
    const defaultConfig = {
      // mbconfigFile: 'D:\\002.Code\\003.electron\\electron_MBK\\mbconfig.txt',
      mbconfigFile: path.join(process.cwd(),'mbconfig.txt'),
      hostAddress: 'http://musicbank.sbs.co.kr'
    }
    const store = utils.store.getStore({
      type:'localStorage', 
      key:localStorageKey, 
      opts:defaultConfig
    });

    const hostToConnect = store.get('hostAddress') || 'http://musicbank.sbs.co.kr';
    console.log(hostToConnect)
    setHostAddress(hostToConnect);
    let saveDirectory = process.cwd();
    try {
      config.read(path.resolve(store.get('mbconfigFile')));
      saveDirectory = path.resolve(config.get('AUDIO', 'AudioPath'));
    } catch(err){
      console.error('error loading mbsConfig.txt');
    }
    setSaveDirectory(saveDirectory);
    ipcRenderer.send('setSaveDirectory', saveDirectory);
    const tabId = new Date().toLocaleDateString();
    addTab(tabId);
    setTodayTabId(tabId);
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
      const downloadStartDate = new Date(downloadStartTime).toLocaleDateString();
      const DATE_CHANGED = downloadStartDate !== todayTabId || false;
      console.log(`date : [${todayTabId}] to [${downloadStartDate}]`);

      if(DATE_CHANGED){
        console.log(`date changed from [${todayTabId}] to [${downloadStartDate}]`);
        addTab(downloadStartDate);
        setTodayTabId(downloadStartDate);
        todayTabId = downloadStartDate;
      }
      
      // addTabItem({tabId: todayTabId, itemInfo});
      addItemNCard({tabId: todayTabId, itemInfo});
      // hideBrowser();
      focusMainWindow();
    }
  }

  const onUpdateProgress = todayTabId => {
    return (event, progressInfo) => {
      const {id, receivedBytes} = progressInfo;
      updateItemNCard({tabId:todayTabId, itemId:id, property: 'receivedBytes', value: receivedBytes});
    }
  }

  const onUpdateStatus = todayTabId => {
    return (event, statusInfo) => {
      const {id, status} = statusInfo;
      updateItemNCard({tabId:todayTabId, itemId:id, property: 'status', value: status});
      
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

  const focusMainWindow = () => {
    const mainWindow = getCurrentWindow();
    mainWindow.focus();
  }

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" height="1">
        <WebView 
          showBrowser={showBrowser} 
          hideBrowser={hideBrowser} 
          hostAddress={hostAddress} 
          cardItems={cardItems}
          clearItemCards={clearItemCards}
        ></WebView>   
        <Box display={statusHidden ? "none": "flex"} className="itemList" flexDirection="column" flexGrow="1" px="3px">
          <ControlPanelContainer></ControlPanelContainer>
          <ItemTabContainer></ItemTabContainer>
          <MessageContainer></MessageContainer>
        </Box>
      </Box>

    </ThemeProvider>
  );
}

export default App;
   