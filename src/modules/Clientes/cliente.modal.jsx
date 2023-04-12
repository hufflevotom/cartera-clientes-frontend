/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { Button, Modal, Form, Input } from "antd";

import { format, openNotification } from "../../util/utils";
import { clientesService } from "../../services";

export const ModalCliente = ({
  datoSeleccionado,
  verModal,
  setVerModal,
  tipo,
  traerDatos,
}) => {
  const [form] = Form.useForm();
  const [loadSave, setLoadSave] = useState(false);

  const agregar = async () => {
    setLoadSave(true);
    const documento = form.getFieldValue("documento");
    const razonSocial = form.getFieldValue("razonSocial");
    const responsable = form.getFieldValue("responsable");
    const telefono = form.getFieldValue("telefono");

    if (!documento || !razonSocial || !responsable || !telefono) {
      openNotification(
        "Datos Incompletos",
        "Complete todos los campos para guardar",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    const data = {
      documento,
      razonSocial,
      responsable,
      telefono,
    };

    try {
      if (tipo === "editar") {
        const respuesta = await clientesService.update(
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
            "El Cliente se editó correctamente",
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
        const respuesta = await clientesService.create(data);
        if (respuesta.data.statusCode === 200) {
          traerDatos({
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          });
          openNotification(
            "Guardado Correctamente",
            "El Cliente se registró correctamente",
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
      title={tipo === "editar" ? "Editar Cliente" : "Agregar Cliente"}
      maskClosable={false}
    >
      <Form
        layout="horizontal"
        form={form}
        initialValues={{ ...datoSeleccionado }}
        {...format}
      >
        <Form.Item label="Documento" name="documento" required>
          <Input type="text" placeholder="Ingrese el documento" />
        </Form.Item>
        <Form.Item label="Razón Social" name="razonSocial" required>
          <Input type="text" placeholder="Ingrese la razón social" />
        </Form.Item>
        <Form.Item label="Responsable" name="responsable" required>
          <Input type="text" placeholder="Ingrese el responsable" />
        </Form.Item>
        <Form.Item label="Teléfono" name="telefono" required>
          <Input type="text" placeholder="Ingrese el teléfono" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
