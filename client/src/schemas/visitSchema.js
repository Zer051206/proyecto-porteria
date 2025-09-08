import * as Yup from 'yup';

const VisitSchema = Yup.object({
  nombre_visitante: Yup.string().required('El nombre completo es obligatorio.'),
  telefono: Yup.string().required('El telefono es obligatorio'),
  identificacion: Yup.string().required('La identificacion es obligatoria.'),
  id_tipo_identificacion: Yup.number().required('El tipo de identificacion es obligatoria.'),
  empresa: Yup.string().nullable(),
  nombre_destinatario: Yup.string().required('El destinatario es obligatorio.'),
  id_area: Yup.number().required('El área es obligatoria'),
  observaciones: Yup.string().nullable()
});

export default VisitSchema;