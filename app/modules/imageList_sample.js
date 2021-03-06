import {createAction, handleActions} from 'redux-actions';
// import {logInfo, logError, logFail} from './messagePanel';
 
const utils = require('../utils');

// action types
// const ADD_IMAGE_DATA = 'imageList/ADD_IMAGE_DATA';
const ADD_PAGE = 'imageList/ADD_PAGE';
const DEL_PAGE = 'imageList/DEL_PAGE';
const SET_PAGE_IMAGES = 'imageList/SET_PAGE_IMAGES';
const SET_PAGE_TITLES = 'imageList/SET_PAGE_TITLES';
const SET_CURRENT_TAB = 'imageList/SET_CURRENT_TAB';
const FILTER_IMAGES_BY_TYPE = 'imageList/FILTER_IMAGES_BY_TYPE';
const FILTER_IMAGES_BY_MINSIZE = 'imageList/FILTER_IMAGES_BY_MINSIZE';
const FILTER_IMAGES_BY_MAXSIZE = 'imageList/FILTER_IMAGES_BY_MAXSIZE';
const FILTER_IMAGES_BY_NAME = 'imageList/FILTER_IMAGES_BY_NAME';
const SET_IMAGE_PREVIEW_OPEN = 'imageList/SET_IMAGE_PREVIEW_OPEN';
const SET_IMAGE_PREVIEW_SRC = 'imageList/SET_IMAGE_PREVIEW_SRC';
const SET_IMAGE_CHECKBOX = 'imageList/SET_IMAGE_CHECKBOX';
const SET_IMAGE_SAVED = 'imageList/SET_IMAGE_SAVED';
const SET_ALL_IMAGE_CHECK = 'imageList/SET_ALL_IMAGE_CHECK';
const SET_LAST_IMAGE_CHECKED = 'imageList/SET_LAST_IMAGE_CHECKED';
const DEL_IMAGE_FORM_IMAGELIST = 'imageList/DEL_IMAGE_FORM_IMAGELIST';
const SET_IMAGE_SHOW_PREVIEW = 'imageList/SET_IMAGE_SHOW_PREVIEW';

// action creator
export const addPage = createAction(ADD_PAGE);
export const delPage = createAction(DEL_PAGE);
export const setPageImages = createAction(SET_PAGE_IMAGES);
export const setPageTitles = createAction(SET_PAGE_TITLES);
export const setCurrentTab = createAction(SET_CURRENT_TAB);
export const filterImageByType = createAction(FILTER_IMAGES_BY_TYPE);
export const filterImageByMinSize = createAction(FILTER_IMAGES_BY_MINSIZE);
export const filterImageByMaxSize = createAction(FILTER_IMAGES_BY_MAXSIZE);
export const filterImageByName = createAction(FILTER_IMAGES_BY_NAME);
export const setImagePreviewOpen = createAction(SET_IMAGE_PREVIEW_OPEN);
export const setImagePreviewSrc = createAction(SET_IMAGE_PREVIEW_SRC);
export const setImageCheckbox = createAction(SET_IMAGE_CHECKBOX);
export const setImageSaved = createAction(SET_IMAGE_SAVED);
export const setAllImageCheck = createAction(SET_ALL_IMAGE_CHECK);
export const setLastImageChecked = createAction(SET_LAST_IMAGE_CHECKED);
export const delImageFromImagelist = createAction(DEL_IMAGE_FORM_IMAGELIST);
export const setImageShowPreview = createAction(SET_IMAGE_SHOW_PREVIEW);

const imageDefault = {
    index: null,
    tmpFname: null,
    tmpSrc: null,
    metadata: {},
    dragStart: false,
    checked: false,
    show: true,
    imagePreviewSrc:'',
    saved: false

}

const mkImageItem = (imageInfo) => {
    const {size} = imageInfo.metadata;
    imageInfo.metadata.sizeKB = utils.number.toByteUnit({number:Number(size), unit:'KB'});
    return {
        ...imageDefault,
        index: imageInfo.metadata.reqIndex,
        tmpFname: imageInfo.tmpFname,
        tmpSrc: imageInfo.tmpSrc,
        imageSrc: imageInfo.tmpSrc,
        imageFname: imageInfo.tmpFname.replace(/^\d{13}_/,''),
        metadata: imageInfo.metadata
    }
}

export const addImageData = (imageInfo) => async (dispatch, getState) => {
    console.log(`#### in addImageData:`, imageInfo)
    const state = getState();
    const {pageIndex} = imageInfo;
    const imageData = state.imageList.pageImages.get(pageIndex) || [];
    const newImage = mkImageItem(imageInfo);
    const images = [
        ...imageData,
        newImage
    ]
    dispatch(setPageImages({pageIndex, images}));
}

export const changePageTitle = ({pageIndex, title}) => (dispatch, getState) => {
    console.log(`### in changePageTitle:`, title);
    dispatch(setPageTitles({pageIndex, title}));
}

const firstElement = array => array[0];

const getCurrentImageData = (state, compareFunction) => {
    const pageIndex = state.imageList.currentTab;
    const imageData = state.imageList.pageImages.get(pageIndex) || [];
    return [...imageData].sort(compareFunction).filter(image => image.show);
}
const getCurrentImageIndex = state => {
    const pageIndex = state.imageList.currentTab;
    const imageData = state.imageList.pageImages.get(pageIndex) || [];
    const currentSrc = state.imageList.imagePreviewSrc;
    const currentImage = imageData.find(image => image.tmpSrc === currentSrc);
    const currentImageIndex = currentImage ? currentImage.index : null;
    return currentImageIndex;
}

export const setNextImage = () => (dispatch, getState) => {
    const state = getState();
    console.log(`### in setNextImage:`, state.imageList);
    const currentImageDataSorted = getCurrentImageData(state, (a,b) => a.index - b.index);
    const currentImageIndex = getCurrentImageIndex(state);
    if(currentImageIndex === null){
        dispatch(setImagePreviewOpen(false));
        return
    }
    const nextImage = currentImageDataSorted.find(image => image.index > currentImageIndex) || firstElement(currentImageDataSorted);
    dispatch(setImagePreviewSrc({imageSrc:nextImage.tmpSrc, index:nextImage.index, imageFname: nextImage.imageFname}));
}

export const setPrevImage = () => (dispatch, getState) => {
    const state = getState();
    console.log(`### in setNextImage:`, state.imageList);
    const currentImageDataSorted = getCurrentImageData(state, (a,b) => b.index - a.index);
    const currentImageIndex = getCurrentImageIndex(state);
    const prevImage = currentImageDataSorted.find(image => image.index < currentImageIndex) || firstElement(currentImageDataSorted);
    console.log(prevImage)
    dispatch(setImagePreviewSrc({imageSrc:prevImage.tmpSrc, index:prevImage.index, imageFname: prevImage.imageFname}));
}

export const setImageToggleChecked = (imageIndex) => (dispatch, getState) => {
    const state = getState();
    const pageIndex = state.imageList.currentTab;
    const clickedImage = state.imageList.pageImages.get(pageIndex).find(image => image.index === imageIndex);
    const checked = !clickedImage.checked;
    dispatch(setImageCheckbox({pageIndex, imageIndex, checked}));
    if(checked) dispatch(setLastImageChecked({pageIndex, imageIndex}));
}

export const setImageCheckedFromNearestChecked = (imageIndex) => (dispatch, getState) => {
    const state = getState();
    const pageIndex = state.imageList.currentTab;
    const lastCheckedImageIndex = state.imageList.pageLastCheckedImage.get(pageIndex);
    const shiftRightChecked = (index, lastIndex) => lastIndex < index;
    const shiftLeftChecked = (index, lastIndex) => lastIndex > index;
    const checkBetweenIndex = (start, end)  => {
        const pageImages = state.imageList.pageImages.get(pageIndex);
        pageImages.forEach(image => {
            const imageIndex = image.index;
            console.log(imageIndex,start,end);
            if(imageIndex >= start && imageIndex <= end) {
                dispatch(setImageCheckbox({pageIndex, imageIndex, checked:true}));
            } else {
                dispatch(setImageCheckbox({pageIndex, imageIndex, checked:false}));
            }
        })
    }
    if(shiftRightChecked(imageIndex, lastCheckedImageIndex)){
        // console.log(`shftRightChecked : ${imageIndex}, ${lastCheckedImageIndex}`);
        checkBetweenIndex(lastCheckedImageIndex, imageIndex);
    }
    if(shiftLeftChecked(imageIndex, lastCheckedImageIndex)){
        // console.log(`shiftLeftChecked : ${imageIndex}, ${lastCheckedImageIndex}`);
        checkBetweenIndex(imageIndex, lastCheckedImageIndex);
    }
}

export const delImage = (imageIndex, targetPageIndex) => async (dispatch, getState) => {
    const state = getState();
    const pageIndex = targetPageIndex || state.imageList.currentTab;
    const targetImage = state.imageList.pageImages.get(pageIndex).find(image => image.index === imageIndex);
    try {
        await utils.file.delete(targetImage.tmpSrc);
        dispatch(logInfo(`[${targetImage.tmpFname}] delete image success`));
    } catch(err) {
        console.error(err);
        // dispatch(logError(`[${targetImage.tmpFname}] delete image failure`))
    }
    dispatch(delImageFromImagelist({pageIndex, imageIndex}));
}

export const closeTabIfAllSaved = (pageIndex) => (dispatch, getState) => {
    const state = getState();
    state.imageList.pageImages.get(pageIndex).length === 0
    && state.navigator.browser.getPage(pageIndex).close();
}

const initialState = {
    currentTab: null,
    pageImages: new Map(),
    pageTitles: new Map(),
    pageLastCheckedImage: new Map(),
    imagePreviewOpen:false,
    imageShow: true
}

// reducer
export default handleActions({
    [ADD_PAGE]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageIndex} = action.payload;
        const pageTitles = new Map(state.pageTitles);
        const pageImages = new Map(state.pageImages);
        const initialTitle = '';
        const initialImageData = [];
        pageTitles.set(pageIndex, initialTitle);
        pageImages.set(pageIndex, initialImageData);
        return {
            ...state,
            pageTitles,
            pageImages
        }
    },
    [DEL_PAGE]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const pageIndex = action.payload;
        const pageTitles = new Map(state.pageTitles);
        const pageImages = new Map(state.pageImages);
        pageImages.delete(pageIndex);
        pageTitles.delete(pageIndex);
        return {
            ...state,
            pageImages,
            pageTitles
        }
    },
    [SET_PAGE_IMAGES]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageIndex, images} = action.payload;
        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, images);
        return {
            ...state,
            pageImages
        }
    },
    [SET_PAGE_TITLES]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%% change page', action.payload);
        const {pageIndex, title} = action.payload;
        const pageTitles = new Map(state.pageTitles);
        pageTitles.set(pageIndex, title);
        return {
            ...state,
            pageTitles
        }
    },
    [SET_CURRENT_TAB]: (state, action) => {
        const currentTab = action.payload;
        return {
            ...state,
            currentTab
        }
    },
    [FILTER_IMAGES_BY_TYPE]: (state, action) => {
        const {pageIndex, fileTypes} = action.payload;
        const formatFilter = (image) => {
            const {format} = image.metadata;
            if(fileTypes.includes('all')) return {...image, show:true};
            if(fileTypes.includes(format)) return {...image, show:true};
            return {...image, show:false};
        }
        const newImageData = state.pageImages.get(pageIndex).map(image => formatFilter(image));
        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        return {
            ...state,
            pageImages
        }
    },   
    [FILTER_IMAGES_BY_MINSIZE]: (state, action) => {
        const {pageIndex, fileSizeMin} = action.payload;
        const sizeFilter = image => {
            const {size} = image.metadata;
            const show = (size > fileSizeMin);
            console.log(show, image.show)
            if(image.show === show) return image;
            return {...image, show:!image.show}
        }
        const newImageData = state.pageImages.get(pageIndex).map(image => sizeFilter(image));
        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        return {
            ...state,
            pageImages
        }
    },
    [FILTER_IMAGES_BY_MAXSIZE]: (state, action) => {
        const {pageIndex, fileSizeMax} = action.payload;
        const sizeFilter = image => {
            const {size} = image.metadata;
            console.log(`*****${size}`); 
            if(size < fileSizeMax) return {...image, show:true};
            return {...image, show:false};
        }
        const newImageData = state.pageImages.get(pageIndex).map(image => sizeFilter(image));
        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        return {
            ...state,
            pageImages
        }
    },    
    [FILTER_IMAGES_BY_NAME]: (state, action) => {
        const {pageIndex, filePatterns} = action.payload;
        const nameFilter = (image) => {
            const name = image.tmpFname;
            console.log(`*****${name}`);
            const blnakRemoved = filePatterns.filter(pattern => pattern !== '');
            if(blnakRemoved.includes('*')) return {...image, show:true};
            const results = blnakRemoved.map(filename => {
              console.log(name)
              console.log(filename)
              return name.includes(filename)
            })
            if(results.some(result => result === true)) return {...image, show:true};
            return {...image, show:false};
        }
        const newImageData = state.pageImages.get(pageIndex).map(image => nameFilter(image));
        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        return {
            ...state,
            pageImages
        }
    },    
    [SET_IMAGE_PREVIEW_OPEN]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const imagePreviewOpen = action.payload;
        return {
            ...state,
            imagePreviewOpen
        }
    },
    [SET_IMAGE_PREVIEW_SRC]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {imageSrc, index, imageFname} = action.payload;
        return {
            ...state,
            imagePreviewSrc: imageSrc,
            imagePreviewSrcIndex: index,
            imagePreviewSrcName: imageFname
        }
    },    
    [SET_IMAGE_CHECKBOX]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageIndex, imageIndex, checked} = action.payload;
        const imageData = [...state.pageImages.get(pageIndex)];
        const image = imageData.find(image => image.index === imageIndex);
        const newImage = {...image, checked};
        const imageArrayIndex = imageData.findIndex(image => image.index === imageIndex);
        const newImageData = utils.clone.replaceElement(imageData, imageArrayIndex, newImage);

        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        // console.log(imageData, newImageData);
        return {
            ...state,
            pageImages
        }
    },  
    [SET_LAST_IMAGE_CHECKED]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageIndex, imageIndex} = action.payload;
        const pageLastCheckedImage = new Map(state.pageLastCheckedImage);
        pageLastCheckedImage.set(pageIndex, imageIndex);
        return {
            ...state,
            pageLastCheckedImage
        }
    }, 
    [SET_IMAGE_SAVED]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageIndex, imageIndex} = action.payload;
        const imageData = [...state.pageImages.get(pageIndex)];
        const image = imageData.find(image => image.index === imageIndex);
        const newImage = {...image, saved: true};
        const imageArrayIndex = imageData.findIndex(image => image.index === imageIndex);
        const newImageData = utils.clone.replaceElement(imageData, imageArrayIndex, newImage);

        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        console.log(imageData, newImageData);
        return {
            ...state,
            pageImages
        }
    },  
    [SET_ALL_IMAGE_CHECK]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const checked = action.payload;
        const pageIndex = state.currentTab;
        const imageData = [...state.pageImages.get(pageIndex)];
        const newImageData = imageData.map(image => ({...image, checked}));
        
        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        return {
            ...state,
            pageImages,
        }
    },  
    [DEL_IMAGE_FORM_IMAGELIST]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageIndex, imageIndex} = action.payload;
        const imageData = [...state.pageImages.get(pageIndex)];
        const newImageData = imageData.filter(image => image.index !== imageIndex);

        const pageImages = new Map(state.pageImages);
        pageImages.set(pageIndex, newImageData);
        return {
            ...state,
            pageImages
        }
    },
    [SET_IMAGE_SHOW_PREVIEW]: (state, action) => {
        // console.log('%%%%%%%%%%%%%%%%', action.payload);
        const newImageShow = !state.imageShow;

        return {
            ...state,
            imageShow: newImageShow
        }
    }
}, initialState);