/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import { Modal, Table } from "antd";

import { Boton } from "../../components/Boton";

import { registro } from "../../models/registro";
import { registrosService } from "../../services";

import ModalRegistro from "./registros.modal";
import InfoRegistros from "./registros.drawer";
import moment from "moment";

import { useDataTable } from "../../hooks/useDataTable";

const Registros = ({
  datoSeleccionado: datoSeleccionadoMotoTaxi,
  verModal: verModalMotoTaxi,
  setVerModal: setVerModalMotoTaxi,
}) => {
  const [fechaInicio, setFechaInicio] = useState(moment());
  const [fechaFin, setFechaFin] = useState(moment());
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
    model: registro,
    service: registrosService,
    tabla: {
      columns: [
        {
          title: "Valor",
          dataIndex: "valor",
          key: "valor",
        },
        {
          title: "Fecha",
          dataIndex: "fecha",
          key: "fecha",
          render: (text) => <span>{moment(text).format("DD/MM/YYYY")}</span>,
        },
        {
          title: "Gasto",
          dataIndex: "valor_gasto",
          key: "valor_gasto",
        },
        {
          title: "Descripcion",
          dataIndex: "descripcion",
          key: "descripcion",
        },
      ],
      info: true,
      edit: true,
      delete: true,
    },
    getAll: {
      func: registrosService.getAll,
      params: {
        paginate: true,
        values: [fechaInicio, fechaFin, datoSeleccionadoMotoTaxi.id],
      },
    },
  });

  return (
    <Modal
      open={verModalMotoTaxi}
      onCancel={() => setVerModalMotoTaxi(false)}
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
          <div>Lista de Registros</div>

          <Boton type="primary" onClick={agregar} name="Agregar Registro" />
        </div>
      }
      maskClosable={false}
      closable={false}
      width={1000}
      footer={
        <Boton
          type="primary"
          onClick={() => setVerModalMotoTaxi(false)}
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
        <ModalRegistro
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          datoSeleccionadoMotoTaxi={datoSeleccionadoMotoTaxi}
          setVerModal={setVerModal}
          tipo={tipo}
        />
      ) : null}
      {verDetalle ? (
        <InfoRegistros
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Modal>
  );
};

export default Registros;
