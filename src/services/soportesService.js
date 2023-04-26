import { Soportes } from "../constants/Endpoints";
import { httpClient } from "../util/Api";

const getAll = async (limit, offset, busqueda = "") => {
  return await httpClient.get(
    `${Soportes.getAll}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const create = async (body) => {
  return await httpClient.post(Soportes.create, body);
};

const getOne = async (id) => {
  return await httpClient.get(Soportes.getOne + id);
};

const update = async (id, body) => {
  return await httpClient.put(Soportes.update + id, body);
};

const close = async (id) => {
  return await httpClient.put(Soportes.closeStatus + id);
};

const _delete = async (id) => {
  return await httpClient.delete(Soportes.delete + id);
};

export const soportesService = {
  getAll,
  create,
  getOne,
  update,
  changeState: {
    close,
  },
  delete: _delete,
};
