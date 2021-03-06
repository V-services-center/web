import * as React from 'react';
import { Form, Field, useFormConnect } from 'hooked-form';
import { graphql } from 'react-apollo';

import { map as mapQuery } from '../_queries.gql';
import StringField from '../../../common/fields/stringField';
import SelectField from '../../../common/fields/selectField';
import Modal from '../../../common/modal';

import { createPin as createPinMutation } from './_mutations.gql';
import Template from './Template';

interface TemplateField {
  name: string;
}

interface TemplatePin {
  id: string;
  name: string;
  fields: TemplateField[];
}

interface CreatePinModalProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  createPin: (values: object) => void;
  mapId?: string;
  onClose: () => void;
  handleSubmit: () => void;
  templatePins: TemplatePin[];
}

const CreatePinModal: React.FC<CreatePinModalProps> = ({
  onClose,
  handleSubmit,
  templatePins,
}) => {
  const { values: { templatePinId } } = useFormConnect();
  const options = React.useMemo(
    () => templatePins.map(({ id, name }) => ({ value: id, label: name })),
    []);

  const templatePin = React.useMemo(
    () => templatePinId && templatePins.find(({ id }) => id === templatePinId),
    [templatePinId]);

  const buttons = React.useMemo(
    () => [
      { label: 'Close', type: 'button', onClick: close, flavor: 'danger' },
      { label: 'Submit', type: 'submit', flavor: 'primary' },
    ],
    [close]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Create Pin"
      onSubmit={handleSubmit}
      buttons={buttons}
    >
      <Field
        fieldId="name"
        component={StringField}
        placeholder="Name"
        label="Name"
      />
      <Field
        component={SelectField}
        fieldId="templatePinId"
        label="Choose your template"
        options={options}
      />
      {templatePin && <Template fields={templatePin.fields} />}
    </Modal>
  );
};

const CreatePinFormModal = Form({
  mapPropsToValues: ({ coordinates, templatePins, mapId }: CreatePinModalProps) => ({
    id: mapId,
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    name: '',
    templatePinId: templatePins.length === 1 ? templatePins[0].id : '',
  }),
  onSubmit: async (
    values,
    { createPin, mapId }: CreatePinModalProps,
  ) => {
    await createPin({
      refetchQueries: [{ query: mapQuery, variables: { id: mapId } }],
      variables: values,
    });
  },
})(CreatePinModal);

export default graphql<{
  coordinates: object;
  mapId?: string;
  onClose: () => void;
  templatePins: TemplatePin[];
}>(createPinMutation, { name: 'createPin' })(CreatePinFormModal);
