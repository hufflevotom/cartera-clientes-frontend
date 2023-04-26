/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Table } from "antd";

import { Boton } from "../../components/Boton";

import { cliente } from "../../models/cliente";
import { clientesService } from "../../services";

import { ModalCliente as Modal } from "./cliente.modal";
import { InfoCliente as Drawer } from "./cliente.drawer";
import Proyectos from "./proyecto.table";
import { useDataTable } from "../../hooks/useDataTable";
import { ProjectOutlined } from "@ant-design/icons";
import { useState } from "react";

const TablaCliente = () => {
  const model = "cliente";
  const [verModalProyecto, setVerModalProyecto] = useState(false);
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
    model: cliente,
    service: clientesService,
    tabla: {
      columns: [
        {
          title: "Documento",
          dataIndex: "documento",
          key: "documento",
        },
        {
          title: "Razón Social",
          dataIndex: "razonSocial",
          key: "razonSocial",
        },
        {
          title: "Responsable",
          dataIndex: "responsable",
          key: "responsable",
        },
        {
          title: "Teléfono",
          dataIndex: "telefono",
          key: "telefono",
        },
      ],
      actions: {
        aditionalActions: [
          {
            title: "Proyectos",
            onClick: (record) => {
              proyectos(record);
            },
            icon: <ProjectOutlined style={{ fontSize: 20, color: "orange" }} />,
          },
        ],
        info: true,
        edit: true,
        delete: true,
      },
    },
  });

  const proyectos = (record) => {
    setDatoSeleccionado(record);
    setVerModalProyecto(true);
  };

  return (
    <Card
      title={`Lista de ${model}s`}
      extra={
        <Boton type="primary" onClick={agregar} name={`Agregar ${model}`} />
      }
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
      {verModalProyecto ? (
        <Proyectos
          verModal={verModalProyecto}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModalProyecto}
        />
      ) : null}
    </Card>
  );
};

export default TablaCliente;
