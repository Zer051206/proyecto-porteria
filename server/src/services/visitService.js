export const createVisit = async (visitData) => {
  const activeVisite = visitModel.findActiveVisitById(visitData.id_visitante);
  if (activeVisite) {
    throw new Error('La visita ya existe');
  }

  const areaExists = await visitModel.findAreaById(id_area);
  if (!areaExists) {
      throw new Error('El área de destino no es válida.');
  }

  const newVisit = await Visita.create(visitData);

  return newVisit;
}