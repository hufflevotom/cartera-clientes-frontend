/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Table } from "antd";

import { Boton } from "../../components/Boton";

import { proyecto } from "../../models/proyecto";
import { proyectosService } from "../../services";

import ModalProyecto from "./proyecto.modal";
import InfoProyecto from "./proyecto.drawer";
import moment from "moment";

import { useDataTable } from "../../hooks/useDataTable";

const Proyectos = ({
  datoSeleccionado: datoSeleccionadoCliente,
  verModal: verModalCliente,
  setVerModal: setVerModalCliente,
}) => {
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
    model: proyecto,
    service: proyectosService,
    tabla: {
      columns: [
        {
          title: "Nombre",
          dataIndex: "nombre",
          key: "nombre",
        },
        {
          title: "Descripcion",
          dataIndex: "descripcion",
          key: "descripcion",
        },
        {
          title: "Fecha de Inicio",
          dataIndex: "fechaInicio",
          key: "fechaInicio",
          render: (text) => <span>{moment(text).format("DD/MM/YYYY")}</span>,
        },
      ],
      info: true,
      edit: true,
      delete: true,
    },
    getAll: {
      func: proyectosService.getAll,
      params: [datoSeleccionadoCliente.id],
    },
  });

  return (
    <Modal
      visible={verModalCliente}
      onCancel={() => setVerModalCliente(false)}
      title={
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>Lista de proyectos</div>

          <Boton type="primary" onClick={agregar} name="Agregar Proyecto" />
        </div>
      }
      maskClosable={false}
      closable={false}
      width={1000}
      footer={
        <Boton
          type="primary"
          onClick={() => setVerModalCliente(false)}
          name="Cerrar"
        />
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
        <ModalProyecto
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          datoSeleccionadoCliente={datoSeleccionadoCliente}
          setVerModal={setVerModal}
          tipo={tipo}
        />
      ) : null}
      {verDetalle ? (
        <InfoProyecto
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Modal>
  );
};

export default Proyectos;
