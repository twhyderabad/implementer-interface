import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formLoad, setChangedProperty } from '../actions/control';
import FormHelper from 'form-builder/helpers/formHelper';
import { commonConstants } from 'common/constants';
import NotificationContainer from 'common/Notification';

export class FormEventContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { events: {} , errorMessage: {} };

    this.setErrorMessage = this.setErrorMessage.bind(this);
  }

  componentWillUpdate(newProps) {
    const updatedEvents = newProps.formDetails && newProps.formDetails.events;
    if (updatedEvents && this.state.events !== updatedEvents) {
      this.setState({ events: updatedEvents });
      this.props.updateFormEvents(updatedEvents);
    }
  }
  setErrorMessage(errorMessage) {
    const errorNotification = {
      message: errorMessage,
      type: commonConstants.responseType.error,
    };
    this.setState({ errorMessage: errorNotification });
    setTimeout(() => {
      this.setState({ errorMessage: {} });
    }, commonConstants.toastTimeout);
  }
  updateProperty() {
    /* try {
      const formJson = this.props.loadFormJson();
      const formControlEvents = FormHelper.getObsControlEvents(formJson);
      this.props.dispatch(formLoad(formControlEvents));
    } catch (e) {
      this.setErrorMessage(e.message);
    } */
    const properties = { [this.props.eventProperty]: true };
    this.props.dispatch(setChangedProperty(properties));
  }

  render() {
    const name = this.props.label;
    return (
      <div className="form-event-container">
        <label>{name}</label>
        <button onClick={() => this.updateProperty()}>
          <i aria-hidden="true" className="fa fa-code" />
        </button>
      </div>
    );
  }
}

FormEventContainer.propTypes = {
  dispatch: PropTypes.func,
  eventProperty: PropTypes.string,
  formDetails: PropTypes.object,
  label: PropTypes.string,
  loadFormJson: PropTypes.func,
  updateFormEvents: PropTypes.func,
};

const mapStateToProps = (state) => ({
  formDetails: state.formDetails,
});

export default connect(mapStateToProps)(FormEventContainer);

