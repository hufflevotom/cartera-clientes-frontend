/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { Button, Modal, Form, Input, ConfigProvider, DatePicker } from "antd";

import locale from "antd/es/locale/es_ES";

import { openNotification } from "../../util/utils";
import { motoTaxisService } from "../../services";
import moment from "moment";

export const ModalMotoTaxi = ({
  datoSeleccionado,
  verModal,
  setVerModal,
  tipo,
  traerDatos,
}) => {
  const [form] = Form.useForm();
  const [loadSave, setLoadSave] = useState(false);
  const [imagenEntrega, setImagenEntrega] = useState(null);
  const [imagenRecepcion, setImagenRecepcion] = useState(null);
  const [fechaIngreso, setFechaIngreso] = useState(
    tipo === "editar" ? moment(datoSeleccionado.fecha_ingreso) : moment()
  );

  const guardarImgEntrega = async (id) => {
    try {
      const respuesta = await motoTaxisService.uploadImage({
        imagen: imagenEntrega,
        motoPersonaId: id,
        tipo: "entrega",
      });
      if (respuesta.data.statusCode !== 200)
        openNotification(
          "Error",
          "No se pudo guardar la imagen de entrega",
          "Alerta"
        );
      return respuesta;
    } catch (error) {
      openNotification(
        "Error",
        "Ocurrió un error al guardar: " + error.response.data.message,
        "Alerta"
      );
    }
  };

  const guardarImgRecepcion = async (id) => {
    try {
      const respuesta = await motoTaxisService.uploadImage({
        imagen: imagenRecepcion,
        motoPersonaId: id,
        tipo: "recepcion",
      });
      if (respuesta.data.statusCode !== 200)
        openNotification(
          "Error",
          "No se pudo guardar la imagen de entrega",
          "Alerta"
        );
      return respuesta;
    } catch (error) {
      openNotification(
        "Error",
        "Ocurrió un error al guardar: " + error.response.data.message,
        "Alerta"
      );
    }
  };

  const agregar = async () => {
    setLoadSave(true);
    const placa = form.getFieldValue("placa");
    const persona = form.getFieldValue("persona");
    const color = form.getFieldValue("color");
    const nombre_moto = form.getFieldValue("nombre_moto");

    if (!placa || !persona || !color || !nombre_moto || !fechaIngreso) {
      openNotification(
        "Datos Incompletos",
        "Complete todos los campos para guardar",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    const data = {
      placa,
      persona,
      color,
      nombre_moto,
      fecha_ingreso: fechaIngreso.toISOString(),
    };

    let respuesta;
    try {
      if (tipo === "editar") {
        respuesta = await motoTaxisService.update(datoSeleccionado.id, data);
        if (respuesta.data.statusCode === 200) {
          openNotification(
            "Guardado Correctamente",
            "La moto taxi se editó correctamente",
            ""
          );
        } else {
          openNotification("Error", "No se pudo editar", "Alerta");
        }
      } else {
        respuesta = await motoTaxisService.create(data);
        if (respuesta.data.statusCode === 200) {
          openNotification(
            "Guardado Correctamente",
            "La moto taxi se registró correctamente",
            ""
          );
        } else {
          openNotification("Error", "No se pudo registrar", "Alerta");
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

    if (imagenEntrega) await guardarImgEntrega(respuesta.data.body.id);
    if (imagenRecepcion) await guardarImgRecepcion(respuesta.data.body.id);

    traerDatos({
      current: 1,
      pageSize: 5,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20],
    });
    setVerModal(false);
    setLoadSave(false);
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
      title={tipo === "editar" ? "Editar Moto Taxi" : "Agregar Moto Taxi"}
      maskClosable={false}
    >
      <Form
        layout="horizontal"
        form={form}
        initialValues={{ ...datoSeleccionado }}
        {...{
          labelCol: {
            span: 8,
          },
          wrapperCol: {
            span: 16,
          },
        }}
      >
        <Form.Item label="Nombre de Moto" name="nombre_moto" required>
          <Input type="text" placeholder="Ingrese el nombre de la moto" />
        </Form.Item>
        <Form.Item label="Placa" name="placa" required>
          <Input type="text" placeholder="Ingrese la placa" />
        </Form.Item>
        <Form.Item label="Color" name="color" required>
          <Input type="text" placeholder="Ingrese el color" />
        </Form.Item>
        <Form.Item label="Responsable" name="persona" required>
          <Input type="text" placeholder="Ingrese el nombre de la persona" />
        </Form.Item>
        <Form.Item label="Fecha de Ingreso" name="fecha_ingreso" required>
          <ConfigProvider locale={locale}>
            <DatePicker
              placeholder="Fecha de ingreso"
              style={{ width: "100%" }}
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e)}
            />
          </ConfigProvider>
        </Form.Item>
        <Form.Item
          name="imagen_entrega"
          label="Imagen de Entrega"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Input
            type="file"
            onChange={(event) => {
              setImagenEntrega(event.target.files[0]);
            }}
            accept="image/jpeg, image/png"
          />
        </Form.Item>
        <Form.Item
          name="imagen_recepcion"
          label="Imagen de Recepcion"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Input
            type="file"
            onChange={(event) => {
              setImagenRecepcion(event.target.files[0]);
            }}
            accept="image/jpeg, image/png"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
