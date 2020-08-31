import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ItemTab from '../components/ItemTab';
import * as itemTabActions from '../modules/itemTab';

function mapStateToProps(state, ownProps) {
  console.log(state)
  return {
    currentTabId: state.itemTab.currentTabId,
  }
}

function mapDispatchToProps(dispatch) {
  return {ItemTabActions: bindActionCreators(itemTabActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemTab);