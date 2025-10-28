import { col, fn } from "sequelize";
import db from "../models";

const Vehicle = db.Vehicle;

export const countActiveByTypeAndGender = async () => {
  try {
    const results = await Vehicle.findAll({
      attributes: [
        "tipo_vehiculo",
        "genero_dueno",
        [fn("COUNT"), col("id_vehiculo"), "count"],
      ],
      where: {
        esta_dentro: true,
        activo: true,
      },
      group: ["tipo_vehiculo", "genero_dueno"],
      raw: true,
    });

    const counts = {
      Carro: 0,
      Moto_Femenino: 0,
      Moto_Masculino: 0,
      Bicicleta: 0,
    };

    results.forEach((result) => {
      const { tipo_vehiculo, genero_dueno, count } = result;
      if (tipo_vehiculo === "Carro") {
        counts.Carro += count;
      } else if (tipo_vehiculo === "Moto") {
        if (genero_dueno === "Femenino") {
          counts.Moto_Femenino = count;
        } else if (genero_dueno === "Masculino") {
          counts.Moto_Masculino = count;
        }
      } else if (tipo_vehiculo === "Bicicleta") {
        counts.Bicicleta += count;
      }
    });

    return counts;
  } catch (error) {
    logger.error(
      { error: error.message },
      "Error al contar vehículos activos por tipo y género."
    );
    throw error;
  }
};

export const findAll = async (options = {}) => {
  return Vehicle.findAll(options);
};

export const findById = async (id, options = {}) => {
  return Vehicle.findByPk(id, options);
};

export const findByPlate = async (placa, options = {}) => {
  return Vehicle.findOne({
    where: { placa: placa },
    ...options,
  });
};

export const findBySensor = async (codigo_sensor, options = {}) => {
  return Vehicle.findOne({
    where: { codigo_sensor: codigo_sensor },
    ...options,
  });
};

export const create = async (data, options = {}) => {
  return Vehicle.create(data, options);
};

export const update = async (id, data, options = {}) => {
  const [rowsAffected] = await Vehicle.update(
    data,
    { where: { id_vehiculo: id } },
    options
  );

  if (rowsAffected.length > 0) {
    return Vehicle.findById(id);
  }
  return null;
};
