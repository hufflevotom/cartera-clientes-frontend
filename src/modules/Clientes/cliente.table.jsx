/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { Button, Card, Divider, Modal, Table, Tooltip } from "antd";

import { Boton } from "../../components/Boton";

import { cliente } from "../../models/cliente";
import { clientesService } from "../../services";
import { openNotification } from "../../util/utils";

import ModalCliente from "./cliente.modal";
import InfoUsuario from "./cliente.drawer";
import Proyectos from "./proyecto.table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

const Clientes = () => {
  const confirm = Modal.confirm;
  const [verDetalle, setVerDetalle] = useState(false);
  const [verModal, setVerModal] = useState(false);
  const [verModalProyecto, setVerModalProyecto] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(cliente);
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
    setDatoSeleccionado({ ...cliente });
    setTipo("agregar");
    setVerModal(true);
  };

  const editar = (record) => {
    setDatoSeleccionado(record);
    setTipo("editar");
    setVerModal(true);
  };

  const proyectos = (record) => {
    setDatoSeleccionado(record);
    setVerModalProyecto(true);
  };

  const eliminar = (record) => {
    eliminarData(record);
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: "¿Esta seguro que desea eliminar " + record.documento + "?",
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
    const respuesta = await clientesService.getAll(limit, offset, "");
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
    const respuesta = await clientesService.delete(record._id);
    if (respuesta.data.statusCode === 200) {
      traerDatos(paginacion);
      openNotification(
        "Registro Eliminado",
        record.documento + " fue eliminado con exito",
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
    {
      title: "",
      key: "action",
      width: 250,
      render: (text, record) => (
        <span>
          <Tooltip placement="top" title="Proyectos">
            <Button
              style={{ margin: 0, padding: 0 }}
              onClick={() => {
                proyectos(record);
              }}
              type="link"
              icon={
                <ProjectOutlined style={{ fontSize: 20, color: "orange" }} />
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
          <Tooltip placement="top" title="Editar">
            <Button
              style={{ margin: 0, padding: 0 }}
              onClick={() => {
                editar(record);
              }}
              type="link"
              icon={<EditOutlined style={{ fontSize: 20, color: "green" }} />}
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
      title="Lista de clientes"
      extra={<Boton type="primary" onClick={agregar} name="Agregar Cliente" />}
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
        <ModalCliente
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModal}
          tipo={tipo}
        />
      ) : null}
      {verModalProyecto ? (
        <Proyectos
          verModal={verModalProyecto}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModalProyecto}
        />
      ) : null}
      {verDetalle ? (
        <InfoUsuario
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Card>
  );
};

export default Clientes;
