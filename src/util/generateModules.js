/* @hufflevotom
 * Genera los modulos de la aplicacion, tanto el menú para el sidebar como las rutas de los modulos
 */

import { Link, Route } from "react-router-dom";
import { Modulos } from "../constants/Modulos";
import asyncComponent from "util/asyncComponent";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";

export const generateModules = (token, tipo, match, navStyle) => {
  let menu = Modulos;
  const items = [];
  if (token && token.modulos) {
    var rutas = [];
    var hijos = [];
    token.modulos.sort();
    token.modulos.forEach((item) => {
      var busqueda = menu.find((a) => item === a.modulo);
      if (busqueda !== undefined) {
        rutas.push(busqueda);
        hijos.push(busqueda);
      } else {
        menu.forEach((a) => {
          if (a.hijos) {
            const hijo = a.hijos.find((b) => item === b.modulo);
            if (hijo) {
              rutas.push(hijo);
              // Filtrar y agregar padres
              if (hijos.includes(a) === false) {
                hijos.push(a);
              }
            }
          }
        });
      }
    });
    // Agregar hijos a los padres
    hijos.forEach((a) => {
      if (a.hijos) {
        a.hijos = a.hijos.filter((b) => rutas.includes(b));
      }
    });
    if (tipo === "ruta") {
      // Generar rutas
      rutas.forEach((a) => {
        items.push({
          orden: a.orden,
          item: (
            <Route
              key={a.key}
              path={`${match.url + a.ruta}`}
              component={asyncComponent(() => import("../modules/" + a.ruta))}
            />
          ),
        });
      });
    } else {
      // Generar el menu
      hijos.forEach((a) => {
        if (a.subMenu) {
          // Contienen hijos
          items.push({
            orden: a.orden,
            item: (
              <SubMenu
                key={a.key}
                popupClassName={match(navStyle)}
                title={
                  <span
                    style={{
                      display: "flex",
                      flexDirecction: "row",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    {a.icono}
                    <span>{a.descripcion}</span>
                  </span>
                }
              >
                {a.hijos &&
                  a.hijos.map((e) => (
                    <Menu.Item key={e.key}>
                      <Link
                        to={"/" + e.ruta}
                        style={{
                          display: "flex",
                          flexDirecction: "row",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        {e.icono}
                        <span>{e.descripcion}</span>
                      </Link>
                    </Menu.Item>
                  ))}
              </SubMenu>
            ),
          });
        } else {
          // No contienen hijos
          items.push({
            orden: a.orden,
            item: (
              <Menu.Item key={a.key}>
                <Link
                  to={"/" + a.ruta}
                  style={{
                    display: "flex",
                    flexDirecction: "row",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  {a.icono}
                  <span>{a.descripcion}</span>
                </Link>
              </Menu.Item>
            ),
          });
        }
      });
    }
  }
  // Ordenar items
  items.sort((a, b) => {
    if (a.orden < b.orden) {
      return -1;
    }
    if (a.orden > b.orden) {
      return 1;
    }
    return 0;
  });
  return items.map((a) => a.item);
};
