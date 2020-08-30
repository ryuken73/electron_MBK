import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import * as itemActions from '../modules/downloadItems';

function mapStateToProps(state, ownProps) {
  console.log(state)
  return {
    downloadItems: state.downloadItems.downloadItems,
    statusHidden: state.downloadItems.statusHidden
  }
}

function mapDispatchToProps(dispatch) {
  return {ItemActions: bindActionCreators(itemActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);