import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormDetail from 'form-builder/components/FormDetail.jsx';
import { getStore } from 'test/utils/storeHelper';
import { Provider } from 'react-redux';
import { ComponentStore } from 'bahmni-form-controls';
import sinon from 'sinon';
import * as ScriptEditorModal from 'form-builder/components/ScriptEditorModal';
import * as FormConditionsModal from 'form-builder/components/FormConditionsModal';

chai.use(chaiEnzyme());

describe('FormDetails', () => {
  let wrapper;
  let getDesignerComponentStub;
  let getAllDesignerComponentsStub;
  let scriptEditorModalStub;
  let formConditionsModalStub;

  const formData = {
    id: 1,
    name: 'someFormName',
    version: '1',
    uuid: 'someUuid',
    resources: [],
    published: false,
  };
  const control = () => (<div></div>);

  before(() => {
    getDesignerComponentStub = sinon.stub(ComponentStore, 'getDesignerComponent');
    getDesignerComponentStub.returns({
      metadata: {
        attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
      },
      control,
    });
    getAllDesignerComponentsStub = sinon.stub(ComponentStore, 'getAllDesignerComponents');
    getAllDesignerComponentsStub.returns({});
    scriptEditorModalStub = sinon.stub(ScriptEditorModal, 'default')
      .returns(<div>A stub</div>);
    formConditionsModalStub = sinon.stub(FormConditionsModal, 'default')
      .returns(<div>formConditions stub</div>);
  });

  after(() => {
    getDesignerComponentStub.restore();
    getAllDesignerComponentsStub.restore();
    scriptEditorModalStub.restore();
    formConditionsModalStub.restore();
  });

  it('should render form details when form data is present', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    expect(wrapper).to.have.exactly(1).descendants('ControlPool');
    expect(wrapper).to.have.exactly(1).descendants('ControlPropertiesContainer');
    expect(wrapper).to.have.exactly(1).descendants('Canvas');
    expect(wrapper.find('.header-title').at(0).text()).to.eql('someFormName v1 - Draft');
    expect(wrapper.find('Canvas').props().formUuid).to.eql('someUuid');
  });

  it('should render with column side scroll when form data is present', () => {
    const formDataWithoutVersion = {
      id: 1,
      name: 'someFormName',
      uuid: 'someUuid',
      resources: [],
      published: false,
    };
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formDataWithoutVersion}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    expect(wrapper.find('.header-title').at(0).text()).to.eql('someFormName  - Draft');
    // canvas.find('.form-builder-canvas').simulate('click');
    // const scrollInstance = wrapper.find('.column-side');
  });
  it('should render null when form data is not present', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    expect(wrapper).to.have.exactly(0).descendants('ControlPool');
    expect(wrapper).to.have.exactly(0).descendants('ControlPropertiesContainer');
    expect(wrapper).to.have.exactly(0).descendants('Canvas');
  });

  it('should pass the given defaultLocale to Canvas', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          defaultLocale= "en"
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    expect(wrapper).to.have.exactly(1).descendants('Canvas');
    expect(wrapper.find('.header-title').at(0).text()).to.eql('someFormName v1 - Draft');
    const canvas = wrapper.find('Canvas').props();
    expect(canvas.formUuid).to.eql('someUuid');
    expect(canvas.defaultLocale).to.equal('en');
  });

  it('should render nothing when form data is not preset', () => {
    wrapper = shallow(
      <FormDetail
        publishForm={() => {}}
        saveFormResource={() => {}}
        setError={() => {}}
      />);
    expect(wrapper).to.be.blank();
  });

  it('should render Form Event and Save Event with props', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    const formEvents = wrapper.find('FormEventContainer');
    const formEventProps = formEvents.first().props();
    expect(formEventProps).to.have.property('label');
    expect(formEventProps.label).to.be.equal('Form Event');
    expect(formEventProps.eventProperty).to.be.equal('formInitEvent');
    const saveEventProps = formEvents.at(1).props();
    expect(saveEventProps).to.have.property('label');
    expect(saveEventProps.label).to.be.equal('Save Event');
    expect(saveEventProps.eventProperty).to.be.equal('formSaveEvent');

    const formConditionsEventProps = formEvents.at(2).props();
    expect(formConditionsEventProps).to.have.property('label');
    expect(formConditionsEventProps.label).to.be.equal('Form Conditions');
    expect(formConditionsEventProps.eventProperty).to.be.equal('formConditionsEvent');
    expect(formEvents.length).to.be.equal(3);
  });

  it('should create the idGenerator and pass it as props to required children', () => {
    wrapper = mount(
      <Provider store={getStore()}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>
    );
    const controlPoolProps = wrapper.find('ControlPool').props();
    const canvasProps = wrapper.find('Canvas').props();

    expect(controlPoolProps).to.have.property('idGenerator');
    expect(canvasProps).to.have.property('idGenerator');
    expect(canvasProps.idGenerator).to.be.equal(controlPoolProps.idGenerator);
  });

  it('should render popup when formSaveEvent is true', () => {
    const property = { formSaveEvent: true };
    const state = { controlProperty: { property }, formDetails: {}, controlDetails: {} };
    const store = getStore(state);
    wrapper = mount(
      <Provider store={store}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>);

    expect(wrapper.find('FormEventEditor').find('Popup').length).to.eq(1);
  });

  it('should render popup when formInitEvent is true', () => {
    const property = { formInitEvent: true };
    const state = { controlProperty: { property }, formDetails: {}, controlDetails: {} };
    const store = getStore(state);
    wrapper = mount(
      <Provider store={store}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>);

    expect(wrapper.find('FormEventEditor').find('Popup').length).to.eq(1);
  });

  it('should render popup when formConditionsEvent is true', () => {
    const property = { formConditionsEvent: true };
    const state = { controlProperty: { property }, formDetails: {}, controlDetails: {} };
    const store = getStore(state);
    wrapper = mount(
      <Provider store={store}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>);

    expect(wrapper.find('FormEventEditor').find('Popup').length).to.eq(1);
  });

  it('should not render popup when formInitEvent,formSaveEvent,formConditionsEvent are false',
    () => {
      const property = { formInitEvent: false, formSaveEvent: false, formConditionsEvent: false };
      const state = { controlProperty: { property }, formDetails: {}, controlDetails: {} };
      const store = getStore(state);
      wrapper = mount(
      <Provider store={store}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>);
      expect(wrapper.find('FormEventEditor').find('Popup').length).to.eq(0);
    });

  it('should render script of onFormSave when formSaveEvent is true', () => {
    const dummyScript = 'function abcd(){ var a=1;}';
    const property = { formSaveEvent: true };
    const state = { controlProperty: { property },
      formDetails: { events: { onFormSave: dummyScript } }, controlDetails: {} };
    const store = getStore(state);
    wrapper = mount(
      <Provider store={store}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>);
    expect(wrapper.find('FormEventEditor').find('Popup').find('default')
      .prop('script')).to.eq(dummyScript);
  });

  it('should render script of onFormInit when formInitEvent is true', () => {
    const dummyScript = 'function abcd(){ var a=1;}';
    const property = { formInitEvent: true };
    const state = { controlProperty: { property },
      formDetails: { events: { onFormInit: dummyScript } }, controlDetails: {} };
    const store = getStore(state);
    wrapper = mount(
      <Provider store={store}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>);
    expect(wrapper.find('FormEventEditor').find('Popup').find('default')
      .prop('script')).to.eq(dummyScript);
  });

  it('should render controlEvents and formDetails when formConditionsEvent is true', () => {
    const dummyScript = '';
    const property = { formConditionsEvent: true };
    const formDetails = { events: { onFormInit: dummyScript } };
    const allObsControlEvents = [{ id: '1', name: 'name', events: { onValueChange: '' } }];
    const state = { controlProperty: { property },
      formDetails, controlDetails: { allObsControlEvents } };
    const store = getStore(state);
    wrapper = mount(
      <Provider store={store}>
        <FormDetail
          formData={formData}
          publishForm={() => {}}
          saveFormResource={() => {}}
          setError={() => {}}
        />
      </Provider>);
    expect(wrapper.find('FormEventEditor').find('Popup').find('default')
      .prop('formDetails')).to.eq(formDetails);
    expect(wrapper.find('FormEventEditor').find('Popup').find('default')
      .prop('controlEvents')).to.eq(allObsControlEvents);
    expect(wrapper.find('FormEventEditor').find('Popup').find('default')
      .prop('script')).to.eq(undefined);
  });
});
