import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as appActions from '../modules/app';
import * as itemTabActions from '../modules/itemTab';
import * as itemListActions from '../modules/itemList';

function mapStateToProps(state, ownProps) {
  console.log(state)
  return {
    statusHidden: state.app.statusHidden,
    currentTabId: state.itemTab.currentTabId
  }
}

function mapDispatchToProps(dispatch) {
  return {
    AppActions: bindActionCreators(appActions, dispatch),
    ItemTabActions: bindActionCreators(itemTabActions, dispatch),
    ItemListActions: bindActionCreators(itemListActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);