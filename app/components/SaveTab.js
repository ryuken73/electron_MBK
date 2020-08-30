import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BorderedBox from './template/BorderedBox';
// import ImageListContainer from '../../../containers/ImageListContainer';
import SaveListContainer from './SaveList';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
    //  max-width: 100%;
    // min-width: 900px;
`
const StyledTab = styled(Tab)`
    min-width: unset;
`

function TabPanel(props){
    console.log('render TabPanel:', props)
    const {value, index} = props;
    const hidden = (value === index) ? false : true;
    return (
        <SaveListContainer
            pageIndex = {index}
            hidden = {hidden}
        >
        </SaveListContainer>
    )
}

const stopPropagation = (event) => {
    event.stopPropagation();
}

function ImageTabs(props) { 
    console.log('!!!!!!!!!!!!!!!',props);
    
    const {currentTab=1, pageItems=new Map([[1,{}], [2,{}]]), pageTitles=[[1,'page1'],[2,'page2']]} = props;
    // const {setCurrentTab, setAllImageCheck} = props.ImageActions;
    // const onChange = React.useCallback((event, newValue) => {
    //     setCurrentTab(newValue);
    // }, [setCurrentTab]);

    const onChange = () => {};

    const onClickPanel = () => {
        // setAllImageCheck(false);
    }

    return (
        <BorderedBox  alignContent="center"  bgcolor="black" alignItems="flex-start" flexGrow="1" minWidth="auto" flexBasis="0" overflow="auto" onClick={onClickPanel}> 
            <BorderedBox display='flex' alignContent="center" alignItems="flex-start" flexGrow="1" border="1" minWidth="auto" flexBasis="0" overflow="hidden" onClick={stopPropagation}>
                <StyledAppBar position="static" color="primary">
                    <Tabs
                        value={currentTab}
                        onChange={onChange}
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="on"
                        aria-label="scrollable auto tabs"
                    >
                        {[...pageTitles].map(pageTitle => {
                            const [pageIndex, title] = pageTitle;
                            const items = pageItems.get(pageIndex) || [];
                            const itemCount = items.length || 0;
                            return <StyledTab key={pageIndex} value={pageIndex} label={(title || 'new') + ` [${itemCount}]`} aria-controls={`tabpanel-${pageIndex}`} wrapped></StyledTab>                      
                        })}

                    </Tabs>
                </StyledAppBar>
            </BorderedBox>
            {[...pageItems].map(item => {
                const [pageIndex, itemData] = item;
                return <TabPanel value={currentTab} key={pageIndex} index={pageIndex}></TabPanel>                

            })}
        </BorderedBox>
        )
}

export default React.memo(ImageTabs);
