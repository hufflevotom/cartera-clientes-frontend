/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { openNotification } from "../util/utils";

/** v1.0 @hufflevotom
 * Hook para manejar la tabla de datos de ant design
 *
 * @param {Object} : Object con los siguientes parametros:
 *  - model: Object con los datos del modelo. (Obligatorio)
 *  - tabla: Object con los datos de la tabla: (Obligatorio)
 *    -- columns: Array de columnas de la tabla, sigue la estructura de ant design. (Obligatorio)
 *    -- actions: Object de acciones de la tabla, tiene las siguientes propiedades:
 *      --- info: Boolean que indica si se muestra el botón de información.
 *      --- infoDisabled: Function que retorna un Boolean de acuerdo al record, para deshabilitar el botón de información.
 *      --- edit: Boolean que Indica si se muestra el botón de editar.
 *      --- editDisabled: Function que retorna un Boolean de acuerdo al record, para deshabilitar el botón de editar.
 *      --- delete: Boolean que Indica si se muestra el botón de eliminar.
 *      --- deleteDisabled: Function que retorna un Boolean de acuerdo al record, para deshabilitar el botón de eliminar.
 *      --- aditionalActions: Array de Object's que muestra botones de acciones, tiene las siguientes propiedades:
 *        ---- title: String, texto del tooltip.
 *        ---- icon: XHTML, ícono del botón.
 *        ---- onClick: Fuction de la accion.
 *        ---- disabled: Fuction que retorna un Boolean de acuerdo al record, para deshabilitar la acción.
 * - service: Servicio para obtener los datos de la tabla y eliminarlos. (Obligatorio)
 * - getAll: Object para obtener todos los datos de la tabla, tiene las siguientes propiedades:
 *   -- func: Function para obtener los datos de la tabla.
 *   -- response: Function para transformar la respuesta y retornar los datos de la tabla.
 *   -- params: Object de parametros para la función, tiene las siguientes propiedades:
 *    --- paginate: Boolean para indicar si se paginan los datos.
 *    --- values: Array que contiene los parametros para la funcion de obtener los datos.
 * - _delete: Function para eliminar un registro de la tabla.
 *
 * @return {Object} : Object que tiene las siguientes propiedades:
 * - agregar: Function para mostrar el modal de registro de información.
 * - loading: Boolean que indica si se esta cargando la tabla.
 * - setLoading: Function para cambiar el estado de loading.
 * - columns: Array de columnas de la tabla.
 * - data: Array de datos de la tabla.
 * - setData: Function para cambiar los datos de la tabla.
 * - paginacion: Object de paginación de la tabla.
 * - setPaginacion: Function para cambiar la paginación de la tabla.
 * - handleTableChange: Function para manejar el cambio de paginación de la tabla.
 * - datoSeleccionado: Object con los datos del registro seleccionado.
 * - setDatoSeleccionado: Function para cambiar los datos del registro seleccionado.
 * - verDetalle: Boolean que indica si se muestra el modal de información.
 * - setVerDetalle: Function para cambiar el estado de verDetalle.
 * - verModal: Boolean que indica si se muestra el modal de registro de información.
 * - setVerModal: Function para cambiar el estado de verModal.
 * - tipo: String que indica el tipo de modal, puede ser "agregar" o "editar".
 * - traerDatos: Function para obtener los datos de la tabla.
 */
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
    //* Iniciar loading
    setLoading(true);

    //* Obtener parametros de paginacion
    const limit = pagination ? pagination.pageSize : paginacion.pageSize;
    const offset = pagination
      ? pagination.current * pagination.pageSize - pagination.pageSize
      : paginacion.current * paginacion.pageSize - paginacion.pageSize;
    const paginate = [limit, offset, getAll?.params?.search || ""];

    //* Obtener parametros adicionales
    const params = getAll
      ? getAll.params.paginate
        ? [...paginate, ...getAll.params.values]
        : getAll.params.values
      : [];

    //* Invocar servicio
    const respuesta = getAll
      ? await getAll.func(...params)
      : await service.getAll(limit, offset, getAll?.params?.search || "");

    //* Obtener data y total de registros
    let data = [];
    let total = 0;
    if (
      respuesta.data?.body?.length === 2 &&
      typeof respuesta.data.body[1] === "number" &&
      Array.isArray(respuesta.data.body[0])
    ) {
      data =
        getAll && getAll.response && typeof getAll.response === "function"
          ? getAll.response(respuesta.data.body[0])
          : respuesta.data.body[0].map((e, i) => ({
              ...e,
              key: i,
            }));
      total = respuesta.data.body[1];
    } else {
      data =
        getAll && getAll.response && typeof getAll.response === "function"
          ? getAll.response(respuesta.data.body)
          : respuesta.data.body.map((e, i) => ({
              ...e,
              key: i,
            }));

      total = respuesta.data.body.length;
    }

    //* Detener loading
    setLoading(false);

    //* Actualizar data
    setData([...data]);

    //* Actualizar paginación
    const currentPaginacion = pagination ? pagination : paginacion;
    setPaginacion({ ...currentPaginacion, total });
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
        (tabla.actions.info ? 50 : 0) +
        (tabla.actions.edit ? 50 : 0) +
        (tabla.actions.delete ? 50 : 0) +
        (tabla.actions.aditionalActions
          ? tabla.actions.aditionalActions.length * 50
          : 0),
      render: (text, record) => (
        <span>
          {tabla.actions.aditionalActions?.map((act) => (
            <>
              <Tooltip placement="top" title={act.title}>
                <Button
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => act.onClick(record)}
                  type="link"
                  icon={act.icon}
                  disabled={act.disabled ? act.disabled(record) : false}
                />
              </Tooltip>
              <Divider type="vertical" />
            </>
          ))}
          {tabla.actions.info && (
            <>
              <Tooltip placement="top" title="Detalles">
                <Button
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => {
                    showInfo(record);
                  }}
                  disabled={
                    tabla.actions.infoDisabled
                      ? tabla.actions.infoDisabled(record)
                      : false
                  }
                  type="link"
                  icon={<EyeOutlined style={{ fontSize: 20 }} />}
                />
              </Tooltip>
              <Divider type="vertical" />
            </>
          )}
          {tabla.actions.edit && (
            <>
              <Tooltip placement="top" title="Editar">
                <Button
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => {
                    editar(record);
                  }}
                  disabled={
                    tabla.actions.editDisabled
                      ? tabla.actions.editDisabled(record)
                      : false
                  }
                  type="link"
                  icon={
                    <EditOutlined style={{ fontSize: 20, color: "green" }} />
                  }
                />
              </Tooltip>
              <Divider type="vertical" />
            </>
          )}
          {tabla.actions.delete && (
            <>
              <Tooltip placement="top" title="Eliminar">
                <Button
                  style={{ margin: 0, padding: 0 }}
                  onClick={() => {
                    showDeleteConfirm(record);
                  }}
                  disabled={
                    tabla.actions.deleteDisabled
                      ? tabla.actions.deleteDisabled(record)
                      : false
                  }
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
