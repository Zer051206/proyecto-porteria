/**
 * @file parkingService.js
 * @module Services/Parking
 * @description Capa de servicio para la lógica de negocio del módulo de parqueadero.
 * Maneja el registro de entradas/salidas, consulta de vehículos activos y ocupación.
 * @requires ../models
 * @requires ../repositories/vehicleRepository.js
 * @requires ../repositories/parkingLogRepository.js
 * @requires ../repositories/logRepository.js
 * @requires ../config/parking.config.js
 * @requires ../utils/customErrors.js
 * @requires ../config/logger.sj
 * @requires sequelize/Op
 */
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
    const counts = await vehicleRepository.countActiveByType();

    const occupancy = {
      carros: { actual: counts.Carro || 0, limite: CAPACITY_LIMITS.Carro },
      motos: { actual: counts.Moto || 0, limite: CAPACITY_LIMITS.Moto },
      bicicletas: {
        actual: counts.Bicicleta || 0,
        limite: CAPACITY_LIMITS.Bicicleta,
      },
      otros: {
        actual: counts.Otros || 0,
        limite: CAPACITY_LIMITS.Otros,
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

/**
 * @async
 * @function getAllActiveVehicles
 * @description Obtiene la lista de todos los vehículos registrados y activos en el sistema,
 * accesible para roles 'admin' o 'portero'. Útil para el dashboard principal.
 * @param {object} user - Objeto del usuario autenticado (requiere `rol`).
 * @returns {Promise<Array<object>>} Lista de todos los vehículos activos encontrados, o un array vacío.
 * @throws {Error} Si ocurre un error durante la consulta.
 */
export const getAllActiveVehicles = async (user) => {
  if (user.rol === "admin" || user.rol === "portero") {
    const allVehicles = await vehicleRepository.findAll({
      where: { activo: true },
      order: [["nombre_dueno", "ASC"]],
    });
    if (allVehicles && allVehicles.length > 0) {
      return allVehicles;
    } else {
      return [];
    }
  }
  return [];
};

/**
 * @async
 * @function createVehicles
 * @description Crea uno o más vehículos nuevos en una transacción.
 * Verifica duplicados por código de sensor y placa. Valida datos. Crea logs.
 * @param {object} user - El usuario que realiza la acción (requiere `id_usuario`).
 * @param {Array<object>} vehiclesData - Array con datos de los vehículos a crear.
 * @param {string} ip - IP del usuario.
 * @returns {Promise<Array<object>>} Array con las instancias de los vehículos creados.
 * @throws {DuplicateError} Si `codigo_sensor` o `placa` ya existen.
 * @throws {BadRequestError} Si faltan datos o son inconsistentes (`placa` vs `tipo_vehiculo`, `genero_dueno` vs `tipo_vehiculo`).
 * @throws {Error} Si ocurre otro error durante la transacción.
 */
export const createVehicles = async (user, vehiclesData, ip) => {
  return db.sequelize.transaction(async (t) => {
    const creationPromises = vehiclesData.map(async (vehicleData) => {
      const { codigo_sensor, placa, tipo_vehiculo } = vehicleData;

      // Verifica duplicado por sensor si existe
      if (codigo_sensor) {
        const existingVehicleBySensor =
          await vehicleRepository.findBySensorCode(codigo_sensor, {
            transaction: t,
          });
        if (existingVehicleBySensor)
          throw new DuplicateError(
            `Código sensor '${codigo_sensor}' ya existe.`
          );
      }
      // Verifica duplicado por placa si existe
      if (placa) {
        const existingVehicleByPlate = await vehicleRepository.findByPlate(
          placa,
          { transaction: t }
        );
        if (existingVehicleByPlate)
          throw new DuplicateError(`Matrícula '${placa}' ya existe.`);
      }

      if (tipo_vehiculo === "Bicicleta" || tipo_vehiculo === "Otros") {
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
        if (!placa) {
          throw new BadRequestError(
            `La placa es obligatoria para ${tipo_vehiculo}.`
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

      let logDescripcionVehiculo = `tipo ${newVehicle.tipo_vehiculo} (ID: ${newVehicle.id_vehiculo}, Placa: ${newVehicle.placa}, Sensor: ${newVehicle.codigo_sensor})`;

      await logRepository.create(
        {
          accion: "CREAR_VEHICULO",
          id_usuario: user.id_usuario,
          descripcion: `El usuario (ID: ${user.id_usuario}) creó el vehiculo ${logDescripcionVehiculo} asignado a ID Dueño: ${newVehicle.identificacion_dueno}.`,
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

/**
 * @async
 * @function updateVehicle
 * @description Actualiza los detalles generales de un vehículo existente en una transacción. Crea un log de auditoría.
 * @param {number} id_vehiculo - El ID del vehículo a actualizar.
 * @param {object} dataToUpdate - Objeto con los campos y valores a actualizar (validados por el controlador).
 * @param {object} user - Usuario que realiza la acción (requiere `id_usuario`).
 * @param {string} ip - IP del usuario.
 * @returns {Promise<object>} La instancia del vehículo actualizado.
 * @throws {NotFoundError} Si el vehículo con el `id_vehiculo` proporcionado no se encuentra.
 * @throws {Error} Si ocurre otro error durante la transacción o actualización.
 */
export const updateVehicle = async (updateData) => {
  return db.sequelize.transaction(async (t) => {
    const { user, ip, ...restOfData } = updateData;

    const vehicleDb = await vehicleRepository.findById(updateData.id_vehiculo, {
      transaction: t,
      attributes: ["id_vehiculo", "placa", "identificacion_dueño"],
    });

    if (!vehicleDb) {
      throw new NotFoundError(
        "No se encontró el vehículo en la base de datos."
      );
    }

    const [affectedRows] = await vehicleRepository.update(
      restOfData,
      updateData.id_vehiculo,
      {
        transaction: t,
      }
    );

    if (affectedRows === 0) {
      logger.warn(
        { vehicleId: updateData.id_vehiculo },
        "Update no afectó filas."
      );
    }

    await logRepository.create(
      {
        accion: "ACTUALIZAR_VEHICULO",
        id_usuario: user.id_usuario,
        descripcion: `Usuario ID: ${user.id_usuario} actualizó vehículo ID: ${
          updateData.id_vehiculo
        } (Placa: ${vehicleDb.placa || "N/A"}).`,
        ip_usuario: ip,
        id_vehiculo: updateData.id_vehiculo,
      },
      { transaction: t }
    );

    const updatedVehicle = await vehicleRepository.findById(updateData.id_vehiculo, {
      transaction: t,
    });
    logger.info(
      `Vehículo ID ${updateData.id_vehiculo} actualizado por usuario ID ${user.id_usuario}.`
    );
    return updatedVehicle;
  });
};

/**
 * @async
 * @function registerEntry
 * @description Registra la entrada de un vehículo **existente**. Verifica estado y capacidad.
 * Actualiza estado en `vehiculos` y crea registro en `parqueadero_historial`.
 * @param {object} entryData - Toda la informacion necesario para realizar el log.
 * @returns {Promise<object>} El registro del historial de parqueadero creado.
 */
export const registerEntry = async (entryData) => {
  return db.sequelize.transaction(async (t) => {
    const { id_vehiculo, id_usuario, ip } = entryData;

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
      if (currentOccupancy.carros.actual >= currentOccupancy.carros.limite) {
        isFull = true;
      }
    } else if (vehicleDb.tipo_vehiculo === "Moto") {
      vehicleTypeKey = "motos";
      if (currentOccupancy.motos.actual >= currentOccupancy.motos.limite) {
        isFull = true;
      }
    } else if (vehicleDb.tipo_vehiculo === "Bicicleta") {
      vehicleTypeKey = "bicicletas";
      if (
        currentOccupancy.bicicletas.actual >= currentOccupancy.bicicletas.limite
      ) {
        isFull = true;
      }
    } else if (vehicleDb.tipo_vehiculo === "Otros") {
      vehicleTypeKey = "otros";
      if (currentOccupancy.otros.actual >= currentOccupancy.otros.limite) {
        isFull = true;
      }
    } else {
      logger.error(
        { vehicleId: id_vehiculo, vehicleType: vehicleDb.tipo_vehiculo },
        "Tipo vehículo desconocido en BD."
      );
      throw new Error("Tipo de vehículo desconocido.");
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
      id_usuario_entrada: id_usuario,
      id_vehiculo: id_vehiculo,
      fecha_entrada: new Date(),
    };

    const historyLog = await parkingLogRepository.create(createData, {
      transaction: t,
    });

    await logRepository.create(
      {
        accion: "REGISTRAR_ENTRADA",
        id_usuario: id_usuario,
        descripcion: `Portero ID: ${id_usuario} registró entrada vehículo ID: ${id_vehiculo} (Placa: ${
          vehicleDb.placa || "N/A"
        }, Dueño ID: ${vehicleDb.identificacion_dueno}).`,
        ip_usuario: ip,
        id_vehiculo: id_vehiculo,
      },
      { transaction: t }
    );

    logger.info(
      `Entrada registrada para vehículo ID ${id_vehiculo} por usuario ID ${id_usuario}.`
    );

    return historyLog;
  });
};

/**
 * @async
 * @function registerExit
 * @description Registra la salida de un vehículo. Actualiza estado en `vehiculos` y
 * el último registro abierto en `parqueadero_historial`.
 * @param {object} exitData - Toda la información necesaria para realizar el log.
 * @returns {Promise<object>} Objeto indicando éxito.
 */
export const registerExit = async (exitData) => {
  return db.sequelize.transaction(async (t) => {
    const { id_vehiculo, id_usuario, ip } = exitData;

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

    const vehicle = await vehicleRepository.update(
      id_vehiculo,
      { esta_dentro: false },
      { transaction: t }
    );

    if (!vehicle) {
      throw new Error("No se pudo actualizar el estado.");
    }

    const updateData = {
      id_usuario_salida: id_usuario,
      fecha_salida: new Date(),
    };

    await parkingLogRepository.updateExit(updateData, id_vehiculo, {
      transaction: t,
    });

    await logRepository.create(
      {
        accion: "REGISTRAR_SALIDA",
        id_usuario: id_usuario,
        descripcion: `Portero ID: ${id_usuario} registró salida vehículo ID: ${id_vehiculo} (Placa: ${
          vehicleDb.placa || "N/A"
        }, Dueño ID: ${vehicleDb.identificacion_dueno}).`,
        ip_usuario: ip,
        id_vehiculo: id_vehiculo,
      },
      { transaction: t }
    );

    logger.info(
      `Salida registrada para vehículo ID ${id_vehiculo} por usuario ID ${id_usuario}.`
    );

    return { success: true, message: "Salida registrada exitosamente." };
  });
};

/**
 * @async
 * @function handleVehicleScan
 * @description Procesa un código de sensor leído, busca el vehículo asociado,
 * y llama a registerEntry o registerExit según corresponda.
 * @param {string} codigo_sensor - El código leído por el sensor.
 * @param {string} ip - La dirección IP desde donde se originó la petición (para logs).
 * @returns {Promise<object>} Objeto indicando la acción realizada y los datos del vehículo. Ej: { action: 'entry'|'exit', vehicle: vehicleInstance }
 * @throws {NotFoundError} Si el código del sensor no corresponde a ningún vehículo activo.
 * @throws {ConflictError} Si se intenta entrar y está lleno, o si el estado ya es el deseado.
 * @throws {Error} Si ocurre otro error.
 */
export const handleVehicleScan = async (codigo_sensor, ip) => {
  logger.debug(
    { sensorCode: codigo_sensor },
    "Procesando escaneo de sensor..."
  );

  // 1. Buscar vehículo por código de sensor
  const vehicleDb = await vehicleRepository.findBySensorCode(codigo_sensor);

  if (!vehicleDb || !vehicleDb.activo) {
    // Verifica también que el vehículo esté activo en el sistema
    logger.warn(
      { sensorCode: codigo_sensor },
      "Código de sensor no encontrado o vehículo inactivo."
    );
    throw new NotFoundError(
      `Código de sensor '${codigo_sensor}' no reconocido o vehículo inactivo.`
    );
  }

  // 2. Determinar si es entrada o salida y llamar a la función correspondiente
  const SENSOR_USER_ID = process.env.SENSOR_USER_ID || 3;

  let result;
  if (!vehicleDb.esta_dentro) {
    // --- Intento de ENTRADA ---
    const entryData = {
      id_vehiculo: vehicleDb.id_vehiculo,
      id_usuario: SENSOR_USER_ID,
      ip: ip,
    };
    logger.info(
      { vehicleId: vehicleDb.id_vehiculo, sensorCode: codigo_sensor },
      "Sensor detectó intento de ENTRADA."
    );
    // registerEntry maneja chequeo de capacidad, actualización de estado, historial y log
    await registerEntry(entryData); // Llama a la función de entrada
    vehicleDb.esta_dentro = true;
    result = { action: "entry", vehicle: vehicleDb }; // Devuelve la acción y el vehículo
  } else {
    // --- Intento de SALIDA ---
    logger.info(
      { vehicleId: vehicleDb.id_vehiculo, sensorCode: codigo_sensor },
      "Sensor detectó intento de SALIDA."
    );
    const exitData = {
      id_vehiculo: vehicleDb.id_vehiculo,
      id_usuario: SENSOR_USER_ID,
      ip: ip,
    };
    // registerExit maneja chequeo de estado, actualización de estado, historial y log
    await registerExit(exitData); // Llama a la función de salida
    vehicleDb.esta_dentro = false;
    result = { action: "exit", vehicle: vehicleDb }; // Devuelve la acción y el vehículo
  }

  return result;
};
