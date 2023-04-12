/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Table } from "antd";
import moment from "moment";

import { useDataTable } from "../../hooks/useDataTable";
import { pago } from "../../models/pago";
import { pagosService, programacionPagosService } from "../../services";

import { Boton } from "../../components/Boton";

import ModalPago from "./pago.modal";
import InfoPago from "./pago.drawer";

const TablaPago = ({
  datoSeleccionado: datoSeleccionadoProgramacion,
  verModal: verModalProgramacion,
  setVerModal: setVerModalProgramacion,
}) => {
  const model = "pago";
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
    model: pago,
    service: pagosService,
    tabla: {
      columns: [
        {
          title: "Monto",
          dataIndex: "monto",
          key: "monto",
        },
        {
          title: "Fecha de pago",
          dataIndex: "fechaPago",
          key: "fechaPago",
          render: (text) => <span>{moment(text).format("DD/MM/YYYY")}</span>,
        },
        {
          title: "Observaciones",
          dataIndex: "observaciones",
          key: "observaciones",
        },
      ],
      info: true,
      edit: false,
      delete: true,
    },
    getAll: {
      func: programacionPagosService.getOne,
      params: { paginate: false, values: [datoSeleccionadoProgramacion.id] },
      response: "pagos",
    },
  });

  return (
    <Modal
      open={verModalProgramacion}
      onCancel={() => setVerModalProgramacion(false)}
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
          <div>Lista de {model}s</div>

          <Boton type="primary" onClick={agregar} name={`Agregar ${model}`} />
        </div>
      }
      maskClosable={false}
      closable={false}
      width={1000}
      footer={
        <Boton
          type="primary"
          onClick={() => setVerModalProgramacion(false)}
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
        <ModalPago
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          datoSeleccionadoProgramacion={datoSeleccionadoProgramacion}
          setVerModal={setVerModal}
          tipo={tipo}
        />
      ) : null}
      {verDetalle ? (
        <InfoPago
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Modal>
  );
};

export default TablaPago;
