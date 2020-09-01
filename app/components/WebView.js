import React from 'react';
import Box from '@material-ui/core/Box';
import {SmallButton} from './template/smallComponents'
import BorderedBox from './template/BorderedBox';
import FullHeightContainer from './template/FullHeightContainer';
import CardListContainer from '../containers/CardListContainer';
const { BrowserView, BrowserWindow, getCurrentWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

export default function WebView(props) {
    const {showBrowser, hideBrowser} = props;
    let webViewBound;
    React.useEffect(() => {
        const view = new BrowserView({
          webPreferences:{
            nodeIntegration: false,
            nativeWindowOpen: true
          }
        });
        const mainWindow = getCurrentWindow();
        const [width, height] = mainWindow.getSize()
        webViewBound = {x:0, y:35, width:width-20, height:height-10};
        mainWindow.setBrowserView(view);
        view.setBounds(webViewBound); 
        view.setAutoResize({width:true, height:true})
        view.webContents.loadURL('http://musicbank.sbs.co.kr');
        view.webContents.on('new-window', (...args) => console.log(args));
        view.webContents.on('will-navigate', (...args) => console.log('will navigate'));
        view.webContents.on('did-finish-load', (...args) => console.log('did finish load'));
        view.webContents.on('did-frame-finish-load', (...args) => console.log('did finish frmae load'));
        view.webContents.on('did-navigate', (...args) => console.log('did navigate'));
    },[])

    return (
        <Box flexGrow="0" border="10">
          <SmallButton size="small" color="primary" variant={"contained"} onClick={showBrowser}>show Browser</SmallButton>
          <SmallButton size="small" color="primary" variant={"contained"} onClick={hideBrowser}>hide Browser</SmallButton>
          <CardListContainer></CardListContainer>
        </Box>
    )
}
  