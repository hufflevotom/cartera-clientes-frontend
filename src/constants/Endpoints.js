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
  create: backend + "proyectos/proyectos",
  getOne: backend + "proyectos/proyectos/",
  update: backend + "proyectos/proyectos/",
  delete: backend + "proyectos/proyectos/",
};
