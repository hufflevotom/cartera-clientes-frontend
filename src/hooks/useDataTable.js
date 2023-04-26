/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { openNotification } from "../util/utils";

/** v1.0 @hufflevotom
 * Hook para manejar la tabla de datos de ant design
 *
 * @param {{model: Object, tabla: Object, service: Service, getAll: Function, _delete: Function}} - Object con los parametros:
 *  - model: Object con los datos del modelo. (Obligatorio)
 *  - tabla: Object con los datos de la tabla: (Obligatorio)
 *    -- columns: Array de columnas de la tabla, sigue la estructura de ant design. (Obligatorio)
 *    -- actions: Object de acciones de la tabla, tiene las siguientes propiedades:
 *      --- info: Boolean que indica si se muestra la columna de acciones.
 *      --- infoDisabled: FunctionIndica si se muestra la columna de acciones.
 *      --- edit: Boolean que Indica si se muestra la columna de acciones.
 *      --- editDisabled: FunctionIndica si se muestra la columna de acciones.
 *      --- delete: Boolean que Indica si se muestra la columna de acciones.
 *      --- deleteDisabled: FunctionIndica si se muestra la columna de acciones.
 *      --- aditionalActions: Object que muestra las columnas de acciones, tiene las siguientes propiedades:
 *        ---- title: Texto del tooltip.
 *        ---- icon: Icono de la accion.
 *        ---- onClick: Icono de la accion.
 *        ---- disabled: Icono de la accion.
 * - service: Servicio para obtener los datos de la tabla y eliminarlos. (Obligatorio)
 * - getAll: Object para obtener todos los datos de la tabla, tiene las siguientes propiedades:
 *   -- func: Function para obtener los datos de la tabla.
 *   -- response: Function para transformar la respuesta y retornar los datos de la tabla.
 *   -- params: Object de parametros para la función, tiene las siguientes propiedades:
 *    --- paginate: Boolean para indicar si se paginan los datos.
 *    --- values: Array .
 * - _delete: Function para eliminar un registro de la tabla.
 *
 * @returns {Object} Objeto con los datos de la tabla
 * @returns {Boolean} Objeto.loading Indica si se esta cargando la tabla
 * @returns {Array} Objeto.data Datos de la tabla
 * @returns {Object} Objeto.paginacion Configuracion de la paginacion
 * @returns {Function} Objeto.showInfo Funcion para mostrar el detalle de un registro
 * @returns {Function} Objeto.agregar Funcion para agregar un registro
 * @returns {Function} Objeto.editar Funcion para editar un registro
 * @returns {Function} Objeto.eliminar Funcion para eliminar un registro
 * @returns {Function} Objeto.traerDatos Funcion para obtener los datos de la tabla
 * @returns {Function} Objeto.eliminarData Funcion para eliminar un registro
 * @returns {Function} Objeto.showDeleteConfirm Funcion para mostrar el modal de confirmacion de eliminacion
 * @returns {Function} Objeto.showModal Funcion para mostrar el modal de detalle, agregar o editar
 * @returns {Function} Objeto.handleCancel Funcion para ocultar el modal de detalle, agregar o editar
 * @returns {Function} Objeto.handleOk Funcion para ocultar el modal de detalle, agregar o editar
 * @returns {Function} Objeto.handleTableChange Funcion para manejar los cambios de la tabla
 * @returns {Function} Objeto.handlePagination Funcion para manejar los cambios de la paginacion
 * @returns {Function} Objeto.handleSearch Funcion para manejar la busqueda
 * @returns {Function} Objeto.handleReset Funcion para manejar el reseteo de la busqueda
 * @returns {Function} Objeto.handleSizeChange Funcion para manejar el cambio de tamaño de pagina
 * @returns {Function} Objeto.handleCurrentChange Funcion para manejar el cambio de pagina
 * @returns {Function} Objeto.handleDelete Funcion para manejar la eliminacion de un registro
 * @returns {Function} Objeto.handleEdit Funcion para manejar la edicion de un registro
 * @returns {Function} Objeto.handleAdd Funcion para manejar la adicion de un registro
 * @returns {Function} Objeto.handleInfo Funcion para manejar la visualizacion de un registro
 * @returns {Function} Objeto.handleInfo Funcion para manejar la visualizacion de un registro
 * @returns {Function} Objeto.handleInfo Funcion para manejar la visualizacion de un registro
 * @returns {Function} Objeto.handleInfo Funcion para manejar la visualizacion de un registro
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
