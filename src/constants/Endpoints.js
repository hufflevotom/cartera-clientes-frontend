import { backend } from "./Backend";

//* Módulo de Usuarios
export const Usuarios = {
  login: backend + "auth/usuarios/login",
  getAll: backend + "auth/usuarios",
  create: backend + "auth/usuarios",
  getOne: backend + "auth/usuarios/",
  update: backend + "auth/usuarios/",
  delete: backend + "auth/usuarios/",
};

//* Módulo de MotoTaxis
export const MotoTaxis = {
  getAll: backend + "movilidades/moto-persona",
  create: backend + "movilidades/moto-persona",
  getOne: backend + "movilidades/moto-persona/",
  update: backend + "movilidades/moto-persona/",
  uploadImage: backend + "movilidades/moto-persona/imagen/",
  delete: backend + "movilidades/moto-persona/",
};

//* Módulo de MotoTaxis
export const Registros = {
  getAll: backend + "movilidades/registros-moto/byMotoPersona/",
  getLeyend: backend + "movilidades/registros-moto/totales/",
  create: backend + "movilidades/registros-moto",
  getOne: backend + "movilidades/registros-moto/",
  update: backend + "movilidades/registros-moto/",
  uploadImage: backend + "movilidades/registros-moto/imagen/",
  delete: backend + "movilidades/registros-moto/",
};

//* Módulo de Soportes
export const Soportes = {
  getAll: backend + "proyectos/soporte",
  create: backend + "proyectos/soporte",
  getOne: backend + "proyectos/soporte/",
  update: backend + "proyectos/soporte/",
  delete: backend + "proyectos/soporte/",
  closeStatus: backend + "proyectos/soporte/cerrar-soporte/",
};

//* Módulo de ProgramacionPagos
export const ProgramacionPagos = {
  getAll: backend + "proyectos/pagos/programacion",
  create: backend + "proyectos/pagos/programacion",
  getOne: backend + "proyectos/pagos/programacion/",
  delete: backend + "proyectos/pagos/programacion/",
};

//* Módulo de Pagos
export const Pagos = {
  create: backend + "proyectos/pagos/pago",
  delete: backend + "proyectos/pagos/pago/",
};

//* Módulo de Clientes
export const Clientes = {
  getAll: backend + "proyectos/clientes",
  create: backend + "proyectos/clientes",
  getOne: backend + "proyectos/clientes/",
  update: backend + "proyectos/clientes/",
  delete: backend + "proyectos/clientes/",
};

//* Módulo de Proyectos
export const Proyectos = {
  getAll: backend + "proyectos/proyectos/cliente/",
  getAllTerminados: backend + "proyectos/proyectos/cliente/cerrado/",
  getAllAbiertos: backend + "proyectos/proyectos/cliente/abierto/",
  validate: backend + "proyectos/pagos/verifyProgramacion/",
  create: backend + "proyectos/proyectos",
  getOne: backend + "proyectos/proyectos/",
  update: backend + "proyectos/proyectos/",
  changeStatus: backend + "proyectos/proyectos/change-status/",
  delete: backend + "proyectos/proyectos/",
};

//* Módulo de Hostings
export const Hostings = {
  getAll: backend + "proyectos/soporte",
  create: backend + "proyectos/soporte",
  getOne: backend + "proyectos/soporte/",
  update: backend + "proyectos/soporte/",
  delete: backend + "proyectos/soporte/",
};
