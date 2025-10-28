import * as vehicleRepository from "../repositories/vehicleRepository.js";
import * as parkingLogRepository from "../repositories/parkingLogRepository.js";
import * as logRepository from "../repositories/logRepository.js";
import { CAPACITY_LIMITS } from "../config/parking.config.js";
import {
  BadRequestError,
  ConflictError,
  DuplicateError,
  NotFoundError,
} from "../utils/customErrors.js";
import db from "../models/index.js";
import logger from "../config/logger.js";

/**
 * @async
 * @function getOccupancy
 * @description Calcula la ocupación actual para cada tipo de vehículo vs. su límite.
 * @returns {Promise<object>} Objeto con la ocupación actual y límite por tipo.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export const getOccupancy = async () => {
  try {
    const counts = await vehicleRepository.countActiveByTypeAndGender();

    const occupancy = {
      carros: { actual: counts.Carro || 0, limite: CAPACITY_LIMITS.Carro },
      motos_f: {
        actual: counts.Moto_Femenino || 0,
        limite: CAPACITY_LIMITS.Moto_Femenino,
      },
      motos_m: {
        actual: counts.Moto_Masculino || 0,
        limite: CAPACITY_LIMITS.Moto_Masculino,
      },
      bicicletas: {
        actual: counts.Bicicleta || 0,
        limite: CAPACITY_LIMITS.Bicicleta,
      },
    };
    logger.info("Ocupación del parqueadero consultada.");
    return occupancy;
  } catch (error) {
    logger.error(
      { error: error.message },
      "Error al calcular la ocupación del parqueadero."
    );
    throw error;
  }
};

export const getAllActiveVehicles = async (user) => {
  if (user.rol === "admin" || user.rol === "portero") {
    const allVehicles = await vehicleRepository.findAll({
      where: { activo: true },
    });
    if (allVehicles && allVehicles.length > 0) {
      return allVehicles;
    } else {
      return [];
    }
  }
  return [];
};

export const createVehicle = async (user, vehiclesData, ip) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = vehiclesData.map(async (vehicleData) => {
      const { codigo_sensor, placa, tipo_vehiculo, genero_dueno } = vehicleData;

      if (codigo_sensor) {
        const vehicleDb = await vehicleRepository.findBySensor(codigo_sensor, {
          transaction: t,
        });
        if (vehicleDb) {
          throw new DuplicateError(
            "Ya existe un vehículo asignado a este código."
          );
        }
      } else if (placa) {
        const vehicleDb = await vehicleRepository.findByPlate(placa, {
          transaction: t,
        });
        if (vehicleDb) {
          throw new DuplicateError(
            "Ya existe un vehículo con la misma matrícula."
          );
        }
      }

      if (tipo_vehiculo === "Bicicleta") {
        if (placa) {
          logger.warn(
            { vehicleData, userId: user.id_usuario },
            "Se intentó crear Bicicleta con placa. Forzando a NULL."
          );
          vehicleData.placa = null;
        }
      } else if (tipo_vehiculo === "Carro") {
        if (!placa) {
          throw new BadRequestError(
            `La placa es obligatoria para ${tipo_vehiculo}.`
          );
        }
      } else if (tipo_vehiculo === "Moto") {
        // Moto
        if (!placa) {
          throw new BadRequestError(
            `La placa es obligatoria para ${tipo_vehiculo}.`
          );
        }
        if (!["Masculino", "Femenino"].includes(genero_dueno)) {
          // Debe ser uno de los dos
          throw new BadRequestError(
            "El género (Masculino/Femenino) es obligatorio para Motos."
          );
        }
      } else {
        throw new BadRequestError(
          `Tipo de vehículo '${tipo_vehiculo}' no reconocido.`
        );
      }

      const newVehicle = await vehicleRepository.create(vehicleData, {
        transaction: t,
      });

      await logRepository.create(
        {
          accion: "CREAR_VEHICULO",
          id_usuario: user.id_usuario,
          descripcion: `El usuario (ID: ${user.id_usuario}) creó el vehiculo con matrícula '${newVehicle.placa}' asignado a la identificacion (ID: ${newVehicle.identificacion_dueno}).`,
          ip_usuario: ip,
          id_vehiculo: newVehicle.id_vehiculo,
        },
        { transaction: t }
      );
      return newVehicle;
    });
    const createdVehicles = await Promise.all(creationPromises);

    logger.info(
      { userId: user.id_usuario, count: createdVehicles.length },
      `${createdVehicles.length} vehiculo(s) creado(s) exitosamente.`
    );

    return createdVehicles;
  });
};

export const updateVehicle = async (updateData) => {
  return db.sequelize.transaction(async (t) => {
    const { user, ip, ...restOfData } = updateData;
    const vehicleDb = await vehicleRepository.findById(updateData.id_vehiculo, {
      transaction: t,
    });

    if (!vehicleDb) {
      throw new NotFoundError(
        "No se encontró el vehículo en la base de datos."
      );
    }

    const updatedVehicle = await vehicleRepository.update(
      restOfData,
      updateData.id_vehiculo,
      {
        transaction: t,
      }
    );

    await logRepository.create(
      {
        accion: "ACTUALIZAR_VEHICULO",
        id_usuario: user.id_usuario,
        descripcion: `El usuario (ID: ${user.id_usuario}) actualizó el vehiculo con matrícula '${updatedVehicle.placa}' asignado a la identificacion (ID: ${updatedVehicle.identificacion_dueno}).`,
        ip_usuario: ip,
        id_vehiculo: updateData.id_vehiculo,
      },
      { transaction: t }
    );

    return updatedVehicle;
  });
};

export const registerEntry = async (entryData) => {
  return db.sequelize.transaction(async (t) => {
    const { id_vehiculo, user, ip } = entryData;

    const vehicleDb = await vehicleRepository.findById(id_vehiculo, {
      transaction: t,
    });

    if (!vehicleDb) {
      throw new NotFoundError(
        "No se encontró un vehículo con el id proporcionado."
      );
    }

    if (vehicleDb.esta_dentro) {
      throw new ConflictError(
        `El vehículo con placa ${
          vehicleDb.placa || "ID " + id_vehiculo
        } ya se encuentra dentro.`
      );
    }

    const currentOccupancy = await getOccupancy();
    let isFull = false;
    let vehicleTypeKey = "";
    if (vehicleDb.tipo_vehiculo === "Carro") {
      vehicleTypeKey = "carros";
      if (currentOccupancy.carros.actual >= currentOccupancy.carros.limite)
        isFull = true;
    } else if (vehicleDb.tipo_vehiculo === "Moto") {
      vehicleTypeKey =
        vehicleDb.genero_dueno === "Femenino" ? "motos_f" : "motos_m";
      if (
        currentOccupancy[vehicleTypeKey].actual >=
        currentOccupancy[vehicleTypeKey].limite
      )
        isFull = true;
    } else if (vehicleDb.tipo_vehiculo === "Bicicleta") {
      vehicleTypeKey = "bicicletas";
      if (
        currentOccupancy.bicicletas.actual >= currentOccupancy.bicicletas.limite
      )
        isFull = true;
    }

    if (isFull) {
      throw new ConflictError(
        `Capacidad máxima alcanzada para ${
          vehicleDb.tipo_vehiculo
        } (${vehicleTypeKey.replace("_", " ")}).`
      );
    }

    await vehicleRepository.update(
      id_vehiculo,
      { esta_dentro: true },
      { transaction: t }
    );

    const createData = {
      id_usuario_entrada: user.id_usuario,
      id_vehiculo: id_vehiculo,
    };

    await parkingLogRepository.create(createData, { transaction: t });

    await logRepository.create(
      {
        accion: "REGISTRAR_ENTRADA",
        id_usuario: user.id_usuario,
        descripcion: `El portero (ID: ${user.id_usuario}) registró la entrada del vehiculo con matrícula '${vehicleDb.placa}' asignado a la identificacion (ID: ${vehicleDb.identificacion_dueno}).`,
        ip_usuario: ip,
        id_vehiculo: id_vehiculo,
      },
      { transaction: t }
    );

    logger.info(
      `Entrada registrada para vehículo ID ${id_vehiculo} por usuario ID ${user.id_usuario}.`
    );

    return;
  });
};

export const registerExit = async (exitData) => {
  return db.sequelize.transaction(async (t) => {
    const { id_vehiculo, user, ip } = exitData;

    const vehicleDb = await vehicleRepository.findById(id_vehiculo, {
      transaction: t,
    });

    if (!vehicleDb) {
      throw new NotFoundError(
        "No se encontró un vehículo con el id proporcionado."
      );
    }

    if (!vehicleDb.esta_dentro) {
      logger.warn(
        `Intento de registrar salida para vehículo ID ${id_vehiculo} que ya está fuera.`
      );
      throw new ConflictError(
        `El vehículo con placa ${
          vehicleDb.placa || "ID " + id_vehiculo
        } ya se encuentra fuera del parqueadero.`
      );
    }

    await vehicleRepository.update(
      id_vehiculo,
      { esta_dentro: false },
      { transaction: t }
    );

    const updateData = {
      id_usuario_salida: user.id_usuario,
      fecha_salida: new Date(),
    };

    await parkingLogRepository.updateExit(updateData, id_vehiculo, {
      transaction: t,
    });

    await logRepository.create(
      {
        accion: "REGISTRAR_SALIDA",
        id_usuario: user.id_usuario,
        descripcion: `El portero (ID: ${user.id_usuario}) registró la salida del vehiculo con matrícula '${vehicleDb.placa}' asignado a la identificacion (ID: ${vehicleDb.identificacion_dueno}).`,
        ip_usuario: ip,
        id_vehiculo: id_vehiculo,
      },
      { transaction: t }
    );

    logger.info(
      `Salida registrada para vehículo ID ${id_vehiculo} por usuario ID ${user.id_usuario}.`
    );

    return;
  });
};
