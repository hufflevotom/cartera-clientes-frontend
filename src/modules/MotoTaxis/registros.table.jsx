/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import { Modal, Table } from "antd";

import { Boton } from "../../components/Boton";

import { registro } from "../../models/registro";
import { registrosService } from "../../services";

import ModalRegistro from "./registros.modal";
import InfoRegistros from "./registros.drawer";
import moment from "moment";

import { useDataTable } from "../../hooks/useDataTable";
import { Buscador } from "../../components/Buscador";
import { useEffect } from "react";

const opcionesInicial = {
  buscar: "",
  avanzado: true,
  filtros: true,
  limpiar: true,
  opciones: [
    {
      date: true,
      rango: 0,
      criterio: "fechaInicio",
      placeholder: "Fecha Inicial",
      value: moment().startOf("week"),
    },
    {
      date: true,
      rango: 1,
      criterio: "fechaFin",
      placeholder: "Fecha Final",
      value: moment().add(1, "days"),
    },
  ],
};

const Registros = ({
  datoSeleccionado: datoSeleccionadoMotoTaxi,
  verModal: verModalMotoTaxi,
  setVerModal: setVerModalMotoTaxi,
}) => {
  const [loadingLeyenda, setLoadingLeyenda] = useState(false);
  const [dataLeyenda, setDataLeyenda] = useState(null);
  const [opciones, setOpciones] = useState(opcionesInicial);
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
    model: registro,
    service: registrosService,
    tabla: {
      columns: [
        {
          title: "Fecha",
          dataIndex: "fecha",
          key: "fecha",
          render: (text) => <span>{moment(text).format("DD/MM/YYYY")}</span>,
        },
        {
          title: "Registro: " + dataLeyenda?.sumaValor?.valor,
          dataIndex: "valor",
          key: "valor",
        },
        {
          title: "Gasto: " + dataLeyenda?.sumaValorGasto?.valor,
          dataIndex: "valor_gasto",
          key: "valor_gasto",
          render: (text) => <span>{parseFloat(text) === 0 ? "-" : text}</span>,
        },
        {
          title:
            "Total: " +
            (
              parseFloat(dataLeyenda?.sumaValor?.valor) -
              parseFloat(dataLeyenda?.sumaValorGasto?.valor)
            ).toFixed(2),
          dataIndex: "resta",
          key: "resta",
          render: (text, record) => (
            <span>
              {(
                parseFloat(record.valor) - parseFloat(record.valor_gasto)
              ).toFixed(2)}
            </span>
          ),
        },
      ],
      info: true,
      edit: true,
      delete: true,
    },
    getAll: {
      func: registrosService.getAll,
      params: {
        paginate: true,
        values: [
          ...opciones.opciones.map((op) => op.value),
          datoSeleccionadoMotoTaxi.id,
        ],
      },
    },
  });

  const traerLeyenda = async () => {
    //* Iniciar loading de Leyenda
    setLoadingLeyenda(true);

    //* Obtener parametros de paginacion
    const limit = paginacion.pageSize;
    const offset =
      paginacion.current * paginacion.pageSize - paginacion.pageSize;
    const paginate = [limit, offset, ""];

    //* Obtener parametros adicionales
    const params = [
      ...paginate,
      ...opciones.opciones.map((op) => op.value),
      datoSeleccionadoMotoTaxi.id,
    ];

    //* Invocar servicio
    const respuesta = await registrosService.getLeyend(...params);

    //* Obtener data y total de registros
    const data = respuesta.data.body;

    //* Detener loading
    setLoadingLeyenda(false);

    //* Actualizar data y total de registros
    setDataLeyenda(data);
  };

  useEffect(() => {
    traerLeyenda();
  }, [data]);

  return (
    <Modal
      open={verModalMotoTaxi}
      onCancel={() => setVerModalMotoTaxi(false)}
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
          <div>Lista de Registros</div>

          <Boton type="primary" onClick={agregar} name="Agregar Registro" />
        </div>
      }
      maskClosable={false}
      closable={false}
      width={1000}
      footer={
        <Boton
          type="primary"
          onClick={() => setVerModalMotoTaxi(false)}
          name="Cerrar"
        />
      }
    >
      <Buscador
        opciones={opciones}
        setOpciones={setOpciones}
        buscar={traerDatos}
        paginacion={paginacion}
        reset={opcionesInicial}
      />
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
        <ModalRegistro
          traerDatos={traerDatos}
          verModal={verModal}
          datoSeleccionado={datoSeleccionado}
          datoSeleccionadoMotoTaxi={datoSeleccionadoMotoTaxi}
          setVerModal={setVerModal}
          tipo={tipo}
        />
      ) : null}
      {verDetalle ? (
        <InfoRegistros
          show={verDetalle}
          setShow={setVerDetalle}
          data={datoSeleccionado}
        />
      ) : null}
    </Modal>
  );
};

export default Registros;
