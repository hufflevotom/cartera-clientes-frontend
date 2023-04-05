/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { Button, Divider, Modal, Table, Tooltip } from "antd";

import { Boton } from "../../components/Boton";

import { proyecto } from "../../models/proyecto";
import { proyectosService } from "../../services";
import { openNotification } from "../../util/utils";

import ModalProyecto from "./proyecto.modal";
import InfoProyecto from "./proyecto.drawer";
import moment from "moment";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const Proyectos = ({
  datoSeleccionado: datoSeleccionadoCliente,
  verModal: verModalCliente,
  setVerModal: setVerModalCliente,
}) => {
  const confirm = Modal.confirm;
  const [verDetalle, setVerDetalle] = useState(false);
  const [verModal, setVerModal] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(proyecto);
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
    setDatoSeleccionado({ ...proyecto });
    setTipo("agregar");
    setVerModal(true);
  };

  const editar = (record) => {
    setDatoSeleccionado(record);
    setTipo("editar");
    setVerModal(true);
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
    const respuesta = await proyectosService.getAll(
      limit,
      offset,
      datoSeleccionadoCliente.id,
      ""
    );
    const data = respuesta.data.body.map((e, i) => ({
      ...e,
      key: i,
    }));
    setLoading(false);
    setData([...data]);
    setPaginacion({ ...pagination, total: respuesta.data.body.length });
  };

  const eliminarData = async (record) => {
    setLoading(true);
    const respuesta = await proyectosService.delete(record._id);
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
    {
      title: "",
      key: "action",
      width: 200,
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
