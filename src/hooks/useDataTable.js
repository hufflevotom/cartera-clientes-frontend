/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { openNotification } from "../util/utils";

export const useDataTable = ({
  model,
  tabla,
  service,
  getAll = null,
  _delete = null,
}) => {
  const confirm = Modal.confirm;
  const [verDetalle, setVerDetalle] = useState(false);
  const [verModal, setVerModal] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(model);
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
    setDatoSeleccionado({ ...model });
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
      title: "¿Esta seguro que desea eliminar el registro?",
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
    const respuesta = getAll
      ? await getAll.func(limit, offset, "", ...getAll.params)
      : await service.getAll(limit, offset, "");
    let data = [];
    let total = 0;
    if (respuesta.data.body[1] && typeof respuesta.data.body[1] === "number") {
      data = respuesta.data.body[0].map((e, i) => ({
        ...e,
        key: i,
      }));
      total = respuesta.data.body[1];
    } else {
      data = respuesta.data.body.map((e, i) => ({
        ...e,
        key: i,
      }));
      total = respuesta.data.body.length;
    }
    setLoading(false);
    setData([...data]);
    setPaginacion({ ...pagination, total });
  };

  const eliminarData = async (record) => {
    setLoading(true);
    const respuesta = _delete
      ? _delete.func(record.id)
      : await service.delete(record.id);
    if (respuesta.data.statusCode === 200) {
      traerDatos(paginacion);
      openNotification("Registro Eliminado", "Eliminado con exito", "");
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
    ...tabla.columns,
    {
      title: "",
      key: "action",
      width:
        50 +
        (tabla.info ? 50 : 0) +
        (tabla.edit ? 50 : 0) +
        (tabla.delete ? 50 : 0) +
        (tabla.aditionalActions ? tabla.aditionalActions.length * 50 : 0),
      render: (text, record) => (
        <span>
          {tabla.aditionalActions?.map((act) => (
            <>
              <Tooltip placement="top" title={act.title}>
                <Button
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => act.onClick(record)}
                  type="link"
                  icon={act.icon}
                />
              </Tooltip>
              <Divider type="vertical" />
            </>
          ))}
          {tabla.info && (
            <>
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
            </>
          )}
          {tabla.edit && (
            <>
              <Tooltip placement="top" title="Editar">
                <Button
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => {
                    editar(record);
                  }}
                  type="link"
                  icon={
                    <EditOutlined style={{ fontSize: 20, color: "green" }} />
                  }
                />
              </Tooltip>
              <Divider type="vertical" />
            </>
          )}
          {tabla.delete && (
            <>
              <Tooltip placement="top" title="Eliminar">
                <Button
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => {
                    showDeleteConfirm(record);
                  }}
                  type="link"
                  icon={
                    <DeleteOutlined style={{ fontSize: 20, color: "red" }} />
                  }
                />
              </Tooltip>
            </>
          )}
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

  return {
    agregar,
    loading,
    setLoading,
    columns,
    data,
    setData,
    paginacion,
    setPaginacion,
    handleTableChange,
    datoSeleccionado,
    setDatoSeleccionado,
    verDetalle,
    setVerDetalle,
    verModal,
    setVerModal,
    tipo,
    traerDatos,
  };
};
