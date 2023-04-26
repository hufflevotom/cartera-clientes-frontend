/* @hufflevotom
! IMPORTANTE:
!  - Los modulos deben ser los mismos que los de la base de datos
!  - La ruta debe respetar los nombres y orden de las carpetas
*/

import {
  CarOutlined,
  CloudServerOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  SolutionOutlined,
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
    key: "MotoTaxis",
    modulo: "motoTaxis",
    ruta: "MotoTaxis",
    descripcion: "MotoTaxis",
    icono: <CarOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 2,
    key: "Clientes",
    modulo: "clientes",
    ruta: "Clientes",
    descripcion: "Clientes",
    icono: <SolutionOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 3,
    key: "Hostings",
    modulo: "hostings",
    ruta: "Hostings",
    descripcion: "Hostings",
    icono: <CloudServerOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 4,
    key: "Pagos",
    modulo: "pagos",
    ruta: "Pagos",
    descripcion: "Pagos",
    icono: <CreditCardOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 5,
    key: "Soportes",
    modulo: "soportes",
    ruta: "Soportes",
    descripcion: "Soporte",
    icono: <CustomerServiceOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 6,
    key: "Usuarios",
    modulo: "usuarios",
    ruta: "Usuarios",
    descripcion: "Usuarios",
    icono: <UserOutlined style={estilo} />,
    subMenu: false,
  },
  {
    orden: 7,
    key: "Proyectos",
    modulo: "proyectos",
    ruta: "Proyectos",
    descripcion: "Proyectos",
    icono: <UserOutlined style={estilo} />,
    subMenu: false,
  },
];
