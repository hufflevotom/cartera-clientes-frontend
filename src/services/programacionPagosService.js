import { ProgramacionPagos } from "../constants/Endpoints";
import { httpClient } from "../util/Api";

const getAll = async (limit, offset, clienteId, busqueda = "") => {
  return await httpClient.get(
    `${ProgramacionPagos.getAll}${clienteId}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const create = async (body) => {
  return await httpClient.post(ProgramacionPagos.create, body);
};

const getOne = async (clienteId) => {
  return await httpClient.get(ProgramacionPagos.getOne + clienteId);
};

const _delete = async (id) => {
  return await httpClient.delete(ProgramacionPagos.delete + id);
};

export const programacionPagosService = {
  getAll,
  create,
  getOne,
  delete: _delete,
};
