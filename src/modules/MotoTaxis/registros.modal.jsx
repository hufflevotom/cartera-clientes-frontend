/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import {
  Button,
  Modal,
  Form,
  Input,
  ConfigProvider,
  DatePicker,
  Switch,
} from "antd";

import locale from "antd/es/locale/es_ES";

import { format, openNotification } from "../../util/utils";
import { proyectosService } from "../../services";
import moment from "moment";

const ModalRegitro = ({
  datoSeleccionado,
  datoSeleccionadoRegistro,
  verModal,
  setVerModal,
  tipo,
  traerDatos,
}) => {
  const [form] = Form.useForm();
  const [loadSave, setLoadSave] = useState(false);
  const [fecha, setFecha] = useState(
    tipo === "editar" && moment(datoSeleccionado.fechaInicio)
  );
  const [gasto, setGasto] = useState(
    tipo === "editar" ? datoSeleccionado.valor_gasto > 0 : false
  );

  const agregar = async () => {
    setLoadSave(true);
    const nombre = form.getFieldValue("nombre");
    const descripcion = form.getFieldValue("descripcion");

    if (!nombre || !descripcion || !fecha) {
      openNotification(
        "Datos Incompletos",
        "Complete todos los campos para guardar",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    const data = {
      nombre,
      descripcion,
      fechaInicio: fecha.toISOString(),
      clienteId: datoSeleccionadoRegistro.id,
    };

    try {
      if (tipo === "editar") {
        const respuesta = await proyectosService.update(
          datoSeleccionado.id,
          data
        );
        if (respuesta.data.statusCode === 200) {
          traerDatos({
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          });
          openNotification(
            "Editado Correctamente",
            "El Proyecto se editó correctamente",
            ""
          );
          setVerModal(false);
          setLoadSave(false);
        } else {
          openNotification(
            "Datos Incompletos",
            "Complete todos los campos para guardar",
            "Alerta"
          );
        }
      } else {
        const respuesta = await proyectosService.create(data);
        if (respuesta.data.statusCode === 200) {
          traerDatos({
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          });
          openNotification(
            "Guardado Correctamente",
            "El Proyecto se registró correctamente",
            ""
          );
          setVerModal(false);
          setLoadSave(false);
        } else {
          openNotification(
            "Datos Incompletos",
            "Complete todos los campos para guardar",
            "Alerta"
          );
        }
      }
    } catch (e) {
      openNotification(
        "Error",
        "Ocurrió un error al guardar: " + e.response.data.message,
        "Alerta"
      );
      setLoadSave(false);
      return;
    }
  };

  return (
    <Modal
      open={verModal}
      footer={
        <Button onClick={agregar} type="primary" loading={loadSave}>
          {tipo === "editar" ? "Editar" : "Agregar"}
        </Button>
      }
      onCancel={() => setVerModal(false)}
      title={tipo === "editar" ? "Editar Proyecto" : "Agregar Proyecto"}
      maskClosable={false}
    >
      <Form
        layout="horizontal"
        form={form}
        initialValues={{ ...datoSeleccionado }}
        {...format}
      >
        <Form.Item label="Valor" name="valor" required>
          <Input type="text" placeholder="Ingrese el valor" />
        </Form.Item>
        <Form.Item label="Fecha" name="fecha" required>
          <ConfigProvider locale={locale}>
            <DatePicker
              placeholder="Fecha"
              style={{ width: "100%" }}
              value={fecha}
              onChange={setFecha}
            />
          </ConfigProvider>
        </Form.Item>
        <Form.Item label="Gasto" name="gasto" required>
          <Switch checked={gasto} onChange={setGasto} />
        </Form.Item>
        {gasto && (
          <>
            <Form.Item label="Valor de gasto" name="valor_gasto" required>
              <Input type="text" placeholder="Ingrese el valor de gasto" />
            </Form.Item>
            <Form.Item label="Descripción" name="descripcion" required>
              <Input type="text" placeholder="Ingrese la descripcion" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ModalRegitro;
