import _cloneDeep from 'lodash.clonedeep';
import createAsyncAction from '../utils/create-async-action';
import createAction from '../utils/create-action';
import createReducer from '../utils/create-reducer';
import axios from '../../utils/axios';

function getDropdownFieldNames(fieldNames) {
  return fieldNames.map((field) => {
    const [name] = Object.keys(field);
    const { [name]: label } = field;

    return {
      key: name,
      value: name,
      text: label,
    };
  });
}

const FILTERS_FIELDS_OPEN_MODAL = 'FILTERS_FIELDS_OPEN_MODAL';
const FILTERS_FIELDS_CLOSE_MODAL = 'FILTERS_FIELDS_CLOSE_MODAL';
const FILTERS_FIELDS_CHANGE_FIELD_NAMES = 'FILTERS_FIELDS_CHANGE_FIELD_NAMES';
const FILTERS_FIELDS_REQUEST = 'FILTERS_FIELDS_REQUEST';
const FILTERS_FIELDS_SUCCESS_RESPONSE = 'FILTERS_FIELDS_SUCCESS_RESPONSE';
const FILTERS_FIELDS_RESPONSE_FAILURE = 'FILTERS_FIELDS_RESPONSE_FAILURE';

export const openModal = createAction(FILTERS_FIELDS_OPEN_MODAL);
export const closeModal = createAction(FILTERS_FIELDS_CLOSE_MODAL);
export const changeFieldNames = createAction(FILTERS_FIELDS_CHANGE_FIELD_NAMES, 'fieldNamesContainer', 'currentFieldNames');

export function getCurrentFieldNames() {
  return (dispatch, getState) => {
    const {
      changes: {
        dataSources: { activeDataSourceId },
        activeTables: { activeTableName },
        filters: { fieldNamesContainer },
      },
    } = getState();

    const currentFieldNames = fieldNamesContainer.find(({
      activeDataSourceId: fieldNamesActiveDataSourceId,
      activeTableName: fieldNamesActiveTableName,
    }) => (
      fieldNamesActiveDataSourceId === activeDataSourceId && fieldNamesActiveTableName === activeTableName
    ));

    if (currentFieldNames) {
      return currentFieldNames;
    }

    return {
      activeDataSourceId: '',
      activeTableName: '',
      activeFieldNames: [],
      dropdownList: [],
      fieldFilters: [],
    };
  };
}

export const fetch = createAsyncAction([
  FILTERS_FIELDS_REQUEST,
  FILTERS_FIELDS_SUCCESS_RESPONSE,
  FILTERS_FIELDS_RESPONSE_FAILURE,
], async (dispatch, getState) => {
  try {
    const {
      changes: {
        dataSources: { activeDataSourceId },
        activeTables: { activeTableName },
        filters: { fieldNamesContainer },
      },
    } = getState();

    const cachedFieldNames = fieldNamesContainer.find(({
      activeDataSourceId: fieldNamesActiveDataSourceId,
      activeTableName: fieldNamesActiveTableName,
    }) => (
      fieldNamesActiveDataSourceId === activeDataSourceId && fieldNamesActiveTableName === activeTableName
    ));

    const nextFieldNamesContainer = _cloneDeep(fieldNamesContainer);

    if (!cachedFieldNames) {
      const {
        data: { active_field_names: activeFieldNames },
      } = await axios(`backup/tables/${activeDataSourceId}/${activeTableName}`);

      const dropdownList = getDropdownFieldNames(activeFieldNames);

      const currentFieldNames = {
        activeDataSourceId,
        activeTableName,
        activeFieldNames,
        dropdownList,
        fieldFilters: [],
      };

      nextFieldNamesContainer.push(currentFieldNames);

      return { fieldNamesContainer: nextFieldNamesContainer };
    }

    return { fieldNamesContainer: nextFieldNamesContainer };
  } catch (error) {
    console.error(error);

    throw error;
  }
});

export function changeFieldFilters(fieldFilters) {
  return (dispatch, getState) => {
    const {
      changes: {
        dataSources: { activeDataSourceId },
        activeTables: { activeTableName },
        filters: { fieldNamesContainer },
      },
    } = getState();

    const currentFieldNames = dispatch(getCurrentFieldNames());

    const nextFieldNamesContainer = fieldNamesContainer.map((fieldNames) => {
      const {
        activeDataSourceId: fieldNamesActiveDataSourceId,
        activeTableName: fieldNamesActiveTableName,
      } = fieldNames;

      if (fieldNamesActiveDataSourceId === activeDataSourceId && fieldNamesActiveTableName === activeTableName) {
        return {
          ..._cloneDeep(currentFieldNames),
          fieldFilters,
        };
      }

      return _cloneDeep(fieldNames);
    });

    dispatch(changeFieldNames(nextFieldNamesContainer));
  };
}

const initialState = {
  isFetching: false,
  isFailed: false,
  modalIsOpened: false,
  fieldNamesContainer: [],
  error: undefined,
};

export default createReducer(initialState, {
  [FILTERS_FIELDS_OPEN_MODAL]: state => ({ ...state, modalIsOpened: true }),
  [FILTERS_FIELDS_CLOSE_MODAL]: state => ({ ...state, modalIsOpened: false }),
  [FILTERS_FIELDS_CHANGE_FIELD_NAMES]: (state, { fieldNamesContainer }) => ({ ...state, fieldNamesContainer }),
  [FILTERS_FIELDS_REQUEST]: state => ({ ...state, isFetching: true, isFailed: false, error: null }),
  [FILTERS_FIELDS_SUCCESS_RESPONSE]: (state, { response }) => ({ ...state, isFetching: false, ...response }),
  [FILTERS_FIELDS_RESPONSE_FAILURE]: (state, { error }) => ({ ...state, isFetching: false, isFailed: true, error }),
});
