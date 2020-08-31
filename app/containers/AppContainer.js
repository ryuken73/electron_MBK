import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as appActions from '../modules/app';
import * as itemListActions from '../modules/itemList';

function mapStateToProps(state, ownProps) {
  console.log(state)
  return {
    statusHidden: state.app.statusHidden,
    todayTabId: state.app.todayTabId
  }
}

function mapDispatchToProps(dispatch) {
  return {
    AppActions: bindActionCreators(appActions, dispatch),
    ItemListActions: bindActionCreators(itemListActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);