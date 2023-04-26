/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Table } from "antd";

import { Boton } from "../../components/Boton";

import { proyecto } from "../../models/proyecto";
import { proyectosService } from "../../services";

import ModalProyecto from "./proyecto.modal";
import InfoProyecto from "./proyecto.drawer";
import moment from "moment";

import { useDataTable } from "../../hooks/useDataTable";
import { CloseCircleOutlined } from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import { openNotification } from "../../util/utils";

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
        {
          title: "Estado",
          dataIndex: "inProgress",
          key: "inProgress",
          render: (text) => <span>{text ? "En Progreso" : "Terminado"}</span>,
        },
      ],
      info: true,
      edit: true,
      editDisabled: (record) => !record.inProgress,
      delete: true,
      aditionalActions: [
        {
          title: "Terminar Proyecto",
          disabled: (record) => !record.inProgress,
          onClick: (record) => {
            confirmCerrar(record);
          },
          icon: (
            <CloseCircleOutlined style={{ fontSize: 20, color: "orange" }} />
          ),
        },
      ],
    },
    getAll: {
      func: proyectosService.getAll,
      params: { paginate: true, values: [datoSeleccionadoCliente.id] },
    },
  });

  const confirmCerrar = (record) => {
    confirm({
      title:
        "¿Esta seguro que desea cambiar el estado del proyecto a terminado?",
      content: "",
      okText: "Si, terminar",
      okType: "danger",
      cancelText: "No, salir",
      onOk() {
        cerrarProyecto(record);
      },
      onCancel() {},
    });
  };

  const cerrarProyecto = async (record) => {
    const response = await proyectosService.changeState.close(record.id);
    if (response.data.statusCode === 200) {
      openNotification(
        "Registro modificado",
        "El proyecto se registró como concluído",
        ""
      );
    } else {
      openNotification(
        "Error al modificar",
        "Ocurrió un error al modificar el proyecto",
        ""
      );
    }
    traerDatos();
  };

  return (
    <Modal
      open={verModalCliente}
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
