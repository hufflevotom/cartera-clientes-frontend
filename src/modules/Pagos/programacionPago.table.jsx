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
          title: "Día de Pago",
          dataIndex: "diaPago",
          key: "diaPago",
          render: (text) => <span>{text} de cada mes</span>,
        },
        {
          title: "Proyecto",
          dataIndex: ["proyecto", "nombre"],
          key: "proyecto",
        },
      ],
      aditionalActions: [
        {
          title: "Proyectos",
          onClick: (record) => {
            pagos(record);
          },
          icon: (
            <CreditCardOutlined style={{ fontSize: 20, color: "orange" }} />
          ),
        },
      ],
      info: true,
      edit: true,
      delete: true,
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
        />
      ) : null}
    </Card>
  );
};

export default TablaProgramacionPago;
