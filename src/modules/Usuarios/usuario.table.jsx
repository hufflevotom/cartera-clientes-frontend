/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Table } from "antd";

import { Boton } from "../../components/Boton";
import { ModalUsuario as Modal } from "./usuario.modal";

import { usuario } from "../../models/usuario";
import { usuariosService } from "../../services";
import { InfoUsuario as Drawer } from "./usuario.drawer";
import { useDataTable } from "../../hooks/useDataTable";

const Usuarios = () => {
  const model = "usuario";
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
    model: usuario,
    service: usuariosService,
    tabla: {
      columns: [
        {
          title: "Documento de Identidad",
          dataIndex: "documento",
          key: "documento",
        },
        {
          title: "Nombre",
          dataIndex: "nombre",
          key: "nombre",
          render: (text, record) => {
            return <span>{`${record.nombre} ${record.apellidos}`}</span>;
          },
        },
        {
          title: "Celular",
          dataIndex: "celular",
          key: "celular",
        },
        {
          title: "Rol",
          dataIndex: ["idTipoRol", "descripcion"],
          key: "rol",
        },
      ],
      info: true,
      edit: true,
      delete: true,
    },
  });

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
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          setVerModal={setVerModal}
          tipo={tipo}
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

export default Usuarios;
