import { Clientes } from "../constants/Endpoints";
import { httpClient } from "../util/Api";

const getAll = async (limit, offset, busqueda = "") => {
  return await httpClient.get(
    `${Clientes.getAll}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const create = async (body) => {
  return await httpClient.post(Clientes.create, body);
};

const getOne = async (id) => {
  return await httpClient.get(Clientes.getOne + id);
};

const update = async (id, body) => {
  return await httpClient.put(Clientes.update + id, body);
};

const _delete = async (id) => {
  return await httpClient.delete(Clientes.delete + id);
};

export const clientesService = {
  getAll,
  create,
  getOne,
  update,
  delete: _delete,
};
