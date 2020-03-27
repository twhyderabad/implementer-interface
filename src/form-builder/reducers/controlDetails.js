import { cloneDeep } from 'lodash';
const controlDetails = (store = {}, action) => {
  switch (action.type) {
    // eslint-disable-next-line no-case-declarations
    case 'SELECT_CONTROL':
      let storeClone;

      if (store.allControls === undefined) {
        storeClone = Object.assign({}, store, { allControls: [action.metadata] });
        // eslint-disable-next-line no-else-return
      } else {
        storeClone = store;
        storeClone.allControls = storeClone.allControls.filter(control =>
          control.id !== action.metadata.id);
        storeClone.allControls = storeClone.allControls.concat(action.metadata);
      }
      return Object.assign({}, storeClone, { selectedControl: action.metadata });
    case 'DESELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: undefined });
    case 'FOCUS_CONTROL':
      return Object.assign({}, store, { focusedControl: action.id });
    case 'BLUR_CONTROL':
      return Object.assign({}, store, { focusedControl: undefined });
    case 'SOURCE_CHANGED':
      // eslint-disable-next-line
      store.selectedControl.events = { onValueChange: action.source };
      // eslint-disable-next-line no-param-reassign
      store.allControls = store.allControls.map(control =>
        (control.id === action.id ?
          Object.assign({}, control, { events: { onValueChange: action.source } })
          : control)
      );
      return cloneDeep(store);

    case 'FORM_LOAD':
      return Object.assign({}, store, { allControls: action.controls });
    case 'DRAG_SOURCE_CHANGED':
      return Object.assign({}, store, { dragSourceCell: action.cell });

    default:
      return store;
  }
};

export default controlDetails;
