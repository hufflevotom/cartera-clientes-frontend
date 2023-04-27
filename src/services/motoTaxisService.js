import { MotoTaxis } from "../constants/Endpoints";
import { httpClient, httpClientForm } from "../util/Api";

const getAll = async (limit, offset, busqueda = "") => {
  console.log(busqueda);
  return await httpClient.get(
    `${MotoTaxis.getAll}?limit=${limit}&offset=${offset}${
      busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
    }`
  );
};

const getTotales = async (id) => {
  return await httpClient.get(MotoTaxis.getTotales);
};

const create = async (body) => {
  return await httpClient.post(MotoTaxis.create, body);
};

const getOne = async (id) => {
  return await httpClient.get(MotoTaxis.getOne + id);
};

const uploadImage = async ({ imagen, motoPersonaId, tipo }) => {
  const body = new FormData();
  body.append("imagen", imagen);
  return await httpClientForm.put(
    `${MotoTaxis.uploadImage}${motoPersonaId}/${tipo === "entrega" ? 1 : 2}`,
    body
  );
};

const update = async (id, body) => {
  return await httpClient.put(MotoTaxis.update + id, body);
};

const _delete = async (id) => {
  return await httpClient.delete(MotoTaxis.delete + id);
};

export const motoTaxisService = {
  getAll,
  getTotales,
  create,
  getOne,
  update,
  delete: _delete,
  uploadImage,
};
