import { Hostings } from "../constants/Endpoints";
import { httpClient } from "../util/Api";

const getAll = async (limit, offset, busqueda = "") => {
  return await httpClient.get(
    `${Hostings.getAll}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const create = async (body) => {
  return await httpClient.post(Hostings.create, body);
};

const getOne = async (id) => {
  return await httpClient.get(Hostings.getOne + id);
};

const update = async (id, body) => {
  return await httpClient.put(Hostings.update + id, body);
};

const _delete = async (id) => {
  return await httpClient.delete(Hostings.delete + id);
};

export const hostingsService = {
  getAll,
  create,
  getOne,
  update,
  delete: _delete,
};
