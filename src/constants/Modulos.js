/* @hufflevotom
! IMPORTANTE:
!  - Los modulos deben ser los mismos que los de la base de datos
!  - La ruta debe respetar los nombres y orden de las carpetas
*/

import {
  CompassOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

const estilo = { fontSize: "20px" };

export const Modulos = [
  {
    orden: 0,
    key: "Inicio",
    modulo: "inicio",
    ruta: "Inicio",
    descripcion: "Inicio",
    icono: <DashboardOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 1,
    key: "Clientes",
    modulo: "clientes",
    ruta: "Clientes",
    descripcion: "Clientes",
    icono: <UserOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 2,
    key: "Hosting",
    modulo: "hosting",
    ruta: "Hosting",
    descripcion: "Hosting",
    icono: <SearchOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 3,
    key: "Pagos",
    modulo: "pagos",
    ruta: "Pagos",
    descripcion: "Pagos",
    icono: <CreditCardOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 4,
    key: "Soporte",
    modulo: "soporte",
    ruta: "Soporte",
    descripcion: "Soporte",
    icono: <CompassOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 5,
    key: "Usuarios",
    modulo: "usuarios",
    ruta: "Usuarios",
    descripcion: "Usuarios",
    icono: <UserOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 6,
    key: "Proyectos",
    modulo: "proyectos",
    ruta: "Proyectos",
    descripcion: "Proyectos",
    icono: <UserOutlined style={estilo} />,
    subMenu: false,
  },
];
