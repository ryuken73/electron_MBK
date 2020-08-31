import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ItemList from '../components/ItemList';
import * as itemListActions from '../modules/itemList';

function mapStateToProps(state, ownProps) {
  console.log(state)
  return {
    tabItems: state.itemList.tabItems,
  }
}

function mapDispatchToProps(dispatch) {
  return {ItemListActions: bindActionCreators(itemListActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);