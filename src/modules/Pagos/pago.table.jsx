/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { Button, Divider, Modal, Table, Tooltip } from "antd";

import { Boton } from "../../components/Boton";

import { pago } from "../../models/pago";
import { pagosService, programacionPagosService } from "../../services";
import { openNotification } from "../../util/utils";

import ModalPago from "./pago.modal";
import InfoPago from "./pago.drawer";
import moment from "moment";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const Pago = ({
  datoSeleccionado: datoSeleccionadoProgramacion,
  verModal: verModalProgramacion,
  setVerModal: setVerModalProgramacion,
}) => {
  const confirm = Modal.confirm;
  const [verDetalle, setVerDetalle] = useState(false);
  const [verModal, setVerModal] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(pago);
  const [tipo, setTipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [paginacion, setPaginacion] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 20],
  });

  const showInfo = (dato) => {
    setDatoSeleccionado(dato);
    setVerDetalle(true);
  };

  const agregar = () => {
    setDatoSeleccionado({ ...pago });
    setTipo("agregar");
    setVerModal(true);
  };

  const eliminar = (record) => {
    eliminarData(record);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: "¿Esta seguro que desea eliminar " + record.nombre + "?",
      content: "",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        eliminar(record);
      },
      onCancel() {},
    });
  };

  const traerDatos = async (pagination) => {
    setLoading(true);
    const respuesta = await programacionPagosService.getOne(
      datoSeleccionadoProgramacion.id
    );
    const data = respuesta.data.body[0].pagos.map((e, i) => ({
      ...e,
      key: i,
    }));
    setLoading(false);
    setData([...data]);
    setPaginacion({
      ...pagination,
      total: respuesta.data.body[0].pagos.length,
    });
  };

  const eliminarData = async (record) => {
    setLoading(true);
    const respuesta = await pagosService.delete(record.id);
    if (respuesta.data.statusCode === 200) {
      traerDatos(paginacion);
      openNotification(
        "Registro Eliminado",
        record.nombre + " fue eliminado con exito",
        ""
      );
      setLoading(false);
    } else {
      openNotification(
        "Error al Eliminar",
        "Por favor vuelva a intentarlo",
        "Alerta"
      );
    }
  };

  const columns = [
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
    {
      title: "",
      key: "action",
      width: 150,
      render: (text, record) => (
        <span>
          <Tooltip placement="top" title="Detalles">
            <Button
              style={{ margin: 0, padding: 0 }}
              onClick={() => {
                showInfo(record);
              }}
              type="link"
              icon={<EyeOutlined style={{ fontSize: 20 }} />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="top" title="Eliminar">
            <Button
              style={{ margin: 0, padding: 0 }}
              onClick={() => {
                showDeleteConfirm(record);
              }}
              type="link"
              icon={<DeleteOutlined style={{ fontSize: 20, color: "red" }} />}
            />
          </Tooltip>
        </span>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPaginacion(pagination);
    traerDatos(pagination);
  };

  useEffect(() => {
    traerDatos(paginacion);
  }, []);

  return (
    <Modal
      visible={verModalProgramacion}
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
          <div>Lista de pagos</div>

          <Boton type="primary" onClick={agregar} name="Agregar pago" />
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

export default Pago;
