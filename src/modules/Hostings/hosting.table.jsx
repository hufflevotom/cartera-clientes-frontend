/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { Card, Table } from "antd";

import { hosting } from "../../models/hosting";
import { hostingsService } from "../../services";
import { useDataTable } from "../../hooks/useDataTable";
import { formatter } from "../../util/utils";

import { Boton } from "../../components/Boton";

import { ModalHosting as Modal } from "./hosting.modal";
import { InfoHosting as Drawer } from "./hosting.drawer";

const TablaHosting = () => {
  const model = "hosting";
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
    tipo,
    traerDatos,
  } = useDataTable({
    model: hosting,
    service: hostingsService,
    tabla: {
      columns: [
        {
          title: "Cliente",
          dataIndex: ["proyecto", "cliente", "razonSocial"],
          key: "cliente",
        },
        {
          title: "Proyecto",
          dataIndex: ["proyecto", "nombre"],
          key: "proyecto",
        },
        {
          title: "Enlace",
          dataIndex: "enlace",
          key: "enlace",
          render: (text) => (
            <a href={text} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          ),
        },
      ],
      info: true,
      edit: true,
      delete: true,
    },
  });

  return (
    <Card
      title={`Lista de ${model}'s`}
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
          datoSeleccionado={datoSeleccionado}
          verModal={verModal}
          setVerModal={setVerModal}
          tipo={tipo}
          traerDatos={traerDatos}
        />
      ) : null}
      {verDetalle ? (
        <Drawer
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Card>
  );
};

export default TablaHosting;
