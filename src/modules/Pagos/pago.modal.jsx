/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { Button, Modal, Form, Input, InputNumber } from "antd";

import { format, openNotification } from "../../util/utils";
import { pagosService } from "../../services";

const ModalPago = ({
  datoSeleccionado,
  datoSeleccionadoProgramacion,
  verModal,
  setVerModal,
  tipo,
  traerDatos,
}) => {
  const [form] = Form.useForm();
  const [loadSave, setLoadSave] = useState(false);

  const agregar = async () => {
    setLoadSave(true);
    const monto = form.getFieldValue("monto");
    const observaciones = form.getFieldValue("observaciones");

    if (!monto || !observaciones) {
      openNotification(
        "Datos Incompletos",
        "Complete todos los campos para guardar",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    if (monto < 1) {
      openNotification(
        "Datos Incompletos",
        "El monto debe ser mayor o igual a 1",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    const data = {
      monto,
      observaciones,
      programacionPagoId: datoSeleccionadoProgramacion.id,
    };
    
    try {
      if (tipo === "editar") {
        const respuesta = await pagosService.update(datoSeleccionado.id, data);
        if (respuesta.data.statusCode === 200) {
          traerDatos({
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          });
          openNotification(
            "Editado Correctamente",
            "El Pago se editó correctamente",
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
        const respuesta = await pagosService.create(data);
        if (respuesta.data.statusCode === 200) {
          traerDatos({
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          });
          openNotification(
            "Guardado Correctamente",
            "El Pago se registró correctamente",
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
      title={tipo === "editar" ? "Editar Pago" : "Agregar Pago"}
      maskClosable={false}
    >
      <Form
        layout="horizontal"
        form={form}
        initialValues={{ ...datoSeleccionado }}
        {...format}
      >
        <Form.Item label="Monto" name="monto" required>
          <InputNumber min={1} placeholder="Ingrese el monto" />
        </Form.Item>
        <Form.Item label="Observaciones" name="observaciones" required>
          <Input type="text" placeholder="Ingrese las observaciones" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalPago;
