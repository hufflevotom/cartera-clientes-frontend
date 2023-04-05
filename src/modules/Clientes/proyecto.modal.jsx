/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { Button, Modal, Form, Input, ConfigProvider, DatePicker } from "antd";

import locale from "antd/es/locale/es_ES";

import { format, openNotification } from "../../util/utils";
import { proyectosService } from "../../services";
import moment from "moment";

const ModalProyecto = ({
  datoSeleccionado,
  datoSeleccionadoCliente,
  verModal,
  setVerModal,
  tipo,
  traerDatos,
}) => {
  const [form] = Form.useForm();
  const [loadSave, setLoadSave] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(
    tipo === "editar" && moment(datoSeleccionado.fechaInicio)
  );

  const agregar = async () => {
    setLoadSave(true);
    const nombre = form.getFieldValue("nombre");
    const descripcion = form.getFieldValue("descripcion");

    if (!nombre || !descripcion || !fechaInicio) {
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
      fechaInicio: fechaInicio.toISOString(),
      clienteId: datoSeleccionadoCliente.id,
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
      visible={verModal}
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
        <Form.Item label="Nombre" name="nombre" required>
          <Input type="text" placeholder="Ingrese el nombre" />
        </Form.Item>
        <Form.Item label="Descripción" name="descripcion" required>
          <Input type="text" placeholder="Ingrese la descripcion" />
        </Form.Item>
        <Form.Item label="Fecha de Inicio" name="fechaInicio" required>
          <ConfigProvider locale={locale}>
            <DatePicker
              placeholder="Fecha de Creación"
              style={{ width: "100%" }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e)}
            />
          </ConfigProvider>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalProyecto;
