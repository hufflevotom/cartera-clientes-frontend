import { Registros } from "../constants/Endpoints";
import { httpClient, httpClientForm } from "../util/Api";

const getAll = async (
  limit,
  offset,
  busqueda = "",
  fechaInicio,
  fechaFin,
  idMotoPersona
) => {
  let url = `${
    Registros.getAll
  }${idMotoPersona}?limit=${limit}&offset=${offset}${
    busqueda && busqueda !== "" ? `&busqueda=${busqueda}` : ""
  }`;

  if (fechaInicio && fechaInicio !== "") {
    url += `&fechaInicio=${fechaInicio}`;
  }
  if (fechaFin && fechaFin !== "") {
    url += `&fechaFin=${fechaFin}`;
  }

  return await httpClient.get(url);
};

const create = async (body) => {
  return await httpClient.post(Registros.create, body);
};

const getOne = async (id) => {
  return await httpClient.get(Registros.getOne + id);
};

const uploadImage = async ({ imagen, motoPersonaId, tipo }) => {
  const body = new FormData();
  body.append("imagen", imagen);
  return await httpClientForm.put(
    `${Registros.uploadImage}${motoPersonaId}/${tipo === "entrega" ? 1 : 2}`,
    body
  );
};

const update = async (id, body) => {
  return await httpClient.put(Registros.update + id, body);
};

const _delete = async (id) => {
  return await httpClient.delete(Registros.delete + id);
};

export const registrosService = {
  getAll,
  create,
  getOne,
  update,
  delete: _delete,
  uploadImage,
};
