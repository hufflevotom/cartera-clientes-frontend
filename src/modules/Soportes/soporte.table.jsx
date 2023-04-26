/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Table } from "antd";

import { Boton } from "../../components/Boton";

import { soporte } from "../../models/soporte";
import { soportesService } from "../../services";

import { ModalSoporte as Modal } from "./soporte.modal";
import { InfoSoporte as Drawer } from "./soporte.drawer";
import { useDataTable } from "../../hooks/useDataTable";
import moment from "moment";
import { formatter, openNotification } from "../../util/utils";
import confirm from "antd/lib/modal/confirm";
import { CloseCircleOutlined } from "@ant-design/icons";

const TablaSoporte = () => {
  const model = "soporte";
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
    model: soporte,
    service: soportesService,
    tabla: {
      columns: [
        {
          title: "Cliente",
          dataIndex: ["proyecto", "cliente", "razonSocial"],
          key: "cliente",
        },
        {
          title: "Proyecto",
          dataIndex: ["proyecto", "nombre"],
          key: "proyecto",
        },
        {
          title: "Fecha de inicio",
          dataIndex: "fechaInicio",
          key: "fechaInicio",
          render: (text) => moment(text).format("DD/MM/YYYY"),
        },
        {
          title: "Costo",
          dataIndex: "costo",
          key: "costo",
          render: (text) => formatter.format(text),
        },
        {
          title: "Estado",
          dataIndex: "abierto",
          key: "abierto",
          render: (text) => (text ? "Abierto" : "Cerrado"),
        },
      ],
      actions: {
        info: true,
        edit: true,
        editDisabled: (record) => !record.abierto,
        delete: true,
        aditionalActions: [
          {
            title: "Terminar Proyecto",
            disabled: (record) => !record.abierto,
            onClick: (record) => {
              confirmCerrar(record);
            },
            icon: (
              <CloseCircleOutlined style={{ fontSize: 20, color: "orange" }} />
            ),
          },
        ],
      },
    },
  });

  const confirmCerrar = (record) => {
    confirm({
      title: "¿Esta seguro que desea cambiar el estado a terminado?",
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
    const response = await soportesService.changeState.close(record.id);
    if (response.data.statusCode === 200) {
      openNotification(
        "Registro modificado",
        "El soporte se registró como concluído",
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
    <Card
      title={`Lista de ${model}s`}
      extra={
        <Boton type="primary" onClick={agregar} name={`Agregar ${model}`} />
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
        <Modal
          datoSeleccionado={datoSeleccionado}
          verModal={verModal}
          setVerModal={setVerModal}
          tipo={tipo}
          traerDatos={traerDatos}
        />
      ) : null}
      {verDetalle ? (
        <Drawer
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Card>
  );
};

export default TablaSoporte;
