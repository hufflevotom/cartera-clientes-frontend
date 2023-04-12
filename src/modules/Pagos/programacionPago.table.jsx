/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { Button, Card, Divider, Modal, Table, Tooltip } from "antd";
import {
  CreditCardOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { Boton } from "../../components/Boton";

import { programacionPago } from "../../models/programacionPago";
import { programacionPagosService } from "../../services";
import { openNotification } from "../../util/utils";

import ModalProgramacionPago from "./programacionPago.modal";
import InfoProgramacionPago from "./programacionPago.drawer";
import Pago from "./pago.table";

const ProgramacionPago = () => {
  const confirm = Modal.confirm;
  const [verDetalle, setVerDetalle] = useState(false);
  const [verModal, setVerModal] = useState(false);
  const [verModalPago, setVerModalPago] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(programacionPago);
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
    setDatoSeleccionado({ ...programacionPago });
    setTipo("agregar");
    setVerModal(true);
  };

  const pagos = (record) => {
    setDatoSeleccionado(record);
    setVerModalPago(true);
  };

  const eliminar = (record) => {
    eliminarData(record);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title:
        "¿Esta seguro que desea eliminar la programacion de " +
        record.proyecto.nombre +
        "?",
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
    const limit = pagination.pageSize;
    const offset =
      pagination.current * pagination.pageSize - pagination.pageSize;
    const respuesta = await programacionPagosService.getAll(limit, offset, "");
    const data = respuesta.data.body[0].map((e, i) => ({
      ...e,
      key: i,
    }));
    setLoading(false);
    setData([...data]);
    setPaginacion({ ...pagination, total: respuesta.data.body[1] });
  };

  const eliminarData = async (record) => {
    setLoading(true);
    const respuesta = await programacionPagosService.delete(record.id);
    if (respuesta.data.statusCode === 200) {
      traerDatos(paginacion);
      openNotification(
        "Registro Eliminado",
        "La programacion para el proyecto " +
          record.proyecto.nombre +
          " fue eliminada con exito",
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
    {
      title: "",
      key: "action",
      width: 200,
      render: (text, record) => (
        <span>
          <Tooltip placement="top" title="Pagos">
            <Button
              style={{ margin: 0, padding: 0 }}
              onClick={() => {
                pagos(record);
              }}
              type="link"
              icon={
                <CreditCardOutlined style={{ fontSize: 20, color: "orange" }} />
              }
            />
          </Tooltip>
          <Divider type="vertical" />
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
    <Card
      title="Lista de programación de pagos"
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
        <ModalProgramacionPago
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModal}
          tipo={tipo}
        />
      ) : null}
      {verModalPago ? (
        <Pago
          verModal={verModalPago}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModalPago}
        />
      ) : null}
      {verDetalle ? (
        <InfoProgramacionPago
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Card>
  );
};

export default ProgramacionPago;
