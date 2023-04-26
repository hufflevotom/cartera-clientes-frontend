import { Proyectos } from "../constants/Endpoints";
import { httpClient } from "../util/Api";

const getAll = async (limit, offset, busqueda = "", clienteId) => {
  return await httpClient.get(
    `${Proyectos.getAll}${clienteId}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const getAllTerminados = async (limit, offset, busqueda = "", clienteId) => {
  return await httpClient.get(
    `${Proyectos.getAllTerminados}${clienteId}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const getAllAbiertos = async (limit, offset, busqueda = "", clienteId) => {
  return await httpClient.get(
    `${Proyectos.getAllAbiertos}${clienteId}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const validate = async (proyectoId) => {
  return await httpClient.get(`${Proyectos.validate}${proyectoId}`);
};

const create = async (body) => {
  return await httpClient.post(Proyectos.create, body);
};

const getOne = async (id) => {
  return await httpClient.get(Proyectos.getOne + id);
};

const update = async (id, body) => {
  return await httpClient.put(Proyectos.update + id, body);
};

const close = async (id) => {
  return await httpClient.put(Proyectos.changeStatus + id, {
    inProgress: false,
  });
};

const _delete = async (id) => {
  return await httpClient.delete(Proyectos.delete + id);
};

export const proyectosService = {
  getAll,
  getAllTerminados,
  getAllAbiertos,
  validate,
  create,
  getOne,
  update,
  changeState: { close },
  delete: _delete,
};
