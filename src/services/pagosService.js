import { Pagos } from "../constants/Endpoints";
import { httpClient } from "../util/Api";

const create = async (body) => {
  return await httpClient.post(Pagos.create, body);
};

const _delete = async (id) => {
  return await httpClient.delete(Pagos.delete + id);
};

export const pagosService = {
  create,
  delete: _delete,
};
