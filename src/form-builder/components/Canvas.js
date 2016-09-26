import React, { PropTypes } from 'react';
import { DraggableComponent } from './DraggableComponent';
import { DescriptorParser as Descriptor } from 'form-builder/helpers/descriptorParser';
import maxBy from 'lodash/maxBy';
import toNumber from 'lodash/toNumber';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { selectControl } from 'form-builder/actions/control';
import { componentMapper } from 'form-builder/helpers/componentMapper';

class Canvas extends DraggableComponent {
  constructor() {
    super();
    this.state = { descriptors: [] };
    this.components = {};
    this.storeComponentRef = this.storeComponentRef.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.clearSelectedControl = this.clearSelectedControl.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const currentDescriptors = this.state.descriptors;
    const conceptToControlMap = nextProps.conceptToControlMap;
    const descriptorsWithConcepts = componentMapper(currentDescriptors, conceptToControlMap);
    this.setState({ descriptors: descriptorsWithConcepts });
  }

  postDragProcess(data) {
    const component = window.componentStore.getDesignerComponent(data);
    const descriptor = new Descriptor(data, component).data();
    const descriptorClone = Object.assign({}, descriptor);
    descriptorClone.metadata.id = this.createId();
    this.setState({ descriptors: this.state.descriptors.concat(descriptorClone) });
  }

  onSelect(event, id) {
    this.props.dispatch(selectControl(id));
    event.stopPropagation();
  }

  clearSelectedControl() {
    this.props.dispatch(selectControl(undefined));
  }

  createId() {
    const latestDescriptor = maxBy(this.state.descriptors, (d) => toNumber(d.metadata.id));
    return latestDescriptor ? (+latestDescriptor.metadata.id + 1).toString() : '1';
  }

  prepareJson() {
    const controls = map(this.components, (component) => component.getJsonDefinition()) || [];
    const formJson = {
      id: this.props.formUuid,
      uuid: this.props.formUuid,
      controls,
    };
    return formJson;
  }

  storeComponentRef(ref) {
    if (ref) {
      this.components[ref.props.metadata.id] = ref;
    }
  }

  renderComponents() {
    return this.state.descriptors.map(descriptor =>
      React.createElement(descriptor.control, {
        key: descriptor.metadata.id,
        metadata: descriptor.metadata,
        ref: this.storeComponentRef,
        onSelect: this.onSelect,
      })
    );
  }

  render() {
    return (
      <div
        className="form-builder-canvas"
        onClick={this.clearSelectedControl}
        onDragOver={ this.onDragOver }
        onDrop={ this.onDrop }
      >
        <div className="canvas-placeholder">Drag & Drop controls to create a form</div>
        <div id="form-detail">{ this.renderComponents() }</div>
      </div>
    );
  }
}

Canvas.propTypes = {
  conceptToControlMap: PropTypes.object,
  dispatch: PropTypes.func,
  formUuid: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return { conceptToControlMap: state.conceptToControlMap };
}

export default connect(mapStateToProps, null, null, { withRef: true })(Canvas);
