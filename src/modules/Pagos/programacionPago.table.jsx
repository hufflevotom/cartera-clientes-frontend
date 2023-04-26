/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import { Card, Table } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";

import { Boton } from "../../components/Boton";

import { programacionPago } from "../../models/programacionPago";
import { programacionPagosService } from "../../services";

import { ModalProgramacionPago as Modal } from "./programacionPago.modal";
import { InfoProgramacionPago as Drawer } from "./programacionPago.drawer";
import Pago from "./pago.table";
import { useDataTable } from "../../hooks/useDataTable";
import moment from "moment";

const TablaProgramacionPago = () => {
  const model = "programación de pago";
  const [verModalPago, setVerModalPago] = useState(false);
  const {
    agregar,
    loading,
    columns,
    data,
    paginacion,
    handleTableChange,
    verModal,
    setVerModal,
    verDetalle,
    setVerDetalle,
    datoSeleccionado,
    setDatoSeleccionado,
    tipo,
    traerDatos,
  } = useDataTable({
    model: programacionPago,
    service: programacionPagosService,
    tabla: {
      columns: [
        {
          title: "Proyecto",
          dataIndex: ["proyecto", "nombre"],
          key: "proyecto",
        },
        {
          title: "Día de Pago",
          dataIndex: "diaPago",
          key: "diaPago",
          render: (text) => <span>{text} de cada mes</span>,
        },
        {
          title: "Próximo pago",
          dataIndex: "diaPago",
          key: "diaPago",
          render: (txt, record) => {
            let estado = "Pendiente";
            let fechaProgramada = moment();
            if (record.pagos.length > 0) {
              const ultimoPago = record.pagos[record.pagos.length - 1];
              const ultimaFecha = moment(ultimoPago.fechaPago).format(
                "MM/YYYY"
              );
              const numeros = ultimaFecha.split("/");
              const mes =
                parseInt(numeros[0], 10) < 12
                  ? parseInt(numeros[0], 10) + 1
                  : 1;
              const anio =
                parseInt(numeros[0], 10) < 12
                  ? parseInt(numeros[1], 10)
                  : parseInt(numeros[1], 10) + 1;
              const ultimodia = parseInt(
                moment(`${anio}-${mes}-01`).endOf("month").format("DD"),
                10
              );
              fechaProgramada = moment(
                `${
                  parseInt(record.diaPago, 10) > ultimodia
                    ? ultimodia.toString().padStart(2, "0")
                    : parseInt(record.diaPago, 10).toString().padStart(2, "0")
                }/${mes.toString().padStart(2, "0")}/${anio}`,
                "DD/MM/YYYY"
              );
            } else {
              const numeros = moment(record.createdAt)
                .format("MM/YYYY")
                .split("/");
              let mes = parseInt(numeros[0], 10);
              let anio = parseInt(numeros[1], 10);
              if (
                moment(record.createdAt).isAfter(
                  moment(`${anio}-${mes}-${record.diaPago}`)
                )
              ) {
                mes =
                  parseInt(numeros[0], 10) < 12
                    ? parseInt(numeros[0], 10) + 1
                    : 1;
                anio =
                  parseInt(numeros[0], 10) < 12
                    ? parseInt(numeros[1], 10)
                    : parseInt(numeros[1], 10) + 1;
              }
              const ultimodia = parseInt(
                moment(`${anio}-${mes}-01`).endOf("month").format("DD"),
                10
              );
              fechaProgramada = moment(
                `${
                  parseInt(record.diaPago, 10) > ultimodia
                    ? ultimodia.toString().padStart(2, "0")
                    : parseInt(record.diaPago, 10).toString().padStart(2, "0")
                }/${mes.toString().padStart(2, "0")}/${anio}`,
                "DD/MM/YYYY"
              );
            }

            if (moment().isAfter(fechaProgramada)) {
              estado = "Atrasado";
            } else {
              estado = "Pendiente";
            }

            return (
              <span
                style={{
                  color: estado === "Pendiente" ? "orange" : "red",
                }}
              >
                {fechaProgramada.format("DD/MM/YYYY")}
              </span>
            );
          },
        },
      ],
      actions: {
        aditionalActions: [
          {
            title: "Pagos",
            onClick: (record) => {
              pagos(record);
            },
            icon: (
              <CreditCardOutlined style={{ fontSize: 20, color: "orange" }} />
            ),
          },
        ],
        info: true,
        edit: false,
        delete: true,
      },
    },
  });

  const pagos = (record) => {
    setDatoSeleccionado(record);
    setVerModalPago(true);
  };

  return (
    <Card
      title={`Lista de ${model}s`}
      extra={<Boton type="primary" onClick={agregar} name="Programar Pago" />}
    >
      <Table
        style={{ width: "100%", textAlign: "center" }}
        className="gx-table-responsive"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={paginacion}
        onChange={handleTableChange}
      />
      {verModal ? (
        <Modal
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModal}
          tipo={tipo}
        />
      ) : null}
      {verDetalle ? (
        <Drawer
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
      {verModalPago ? (
        <Pago
          verModal={verModalPago}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModalPago}
          traerDatos={traerDatos}
        />
      ) : null}
    </Card>
  );
};

export default TablaProgramacionPago;
