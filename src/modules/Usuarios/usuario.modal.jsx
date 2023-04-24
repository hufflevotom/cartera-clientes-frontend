/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Input } from "antd";

import { format, openNotification } from "../../util/utils";
import { usuariosService } from "../../services";

export const ModalUsuario = ({
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
    const password = form.getFieldValue("password");
    const nombre = form.getFieldValue("nombre");
    const apellido = form.getFieldValue("apellido");
    const email = form.getFieldValue("email");
    const celular = form.getFieldValue("celular");

    if (!nombre || !apellido || !email || !password || !celular) {
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
      apellido,
      email,
      password,
      celular,
    };

    try {
      if (tipo === "editar") {
        const respuesta = await usuariosService.update(
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
            "El Usuario se editó correctamente",
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
        const respuesta = await usuariosService.create(data);
        if (respuesta.data.statusCode === 200) {
          traerDatos({
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          });
          openNotification(
            "Guardado Correctamente",
            "El Usuario se registró correctamente",
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

  useEffect(() => {
    if (tipo === "editar") {
      form.setFieldsValue({
        password: "",
      });
    }
  }, []);

  return (
    <Modal
      open={verModal}
      footer={
        <Button onClick={agregar} type="primary" loading={loadSave}>
          {tipo === "editar" ? "Editar" : "Agregar"}
        </Button>
      }
      onCancel={() => setVerModal(false)}
      title={tipo === "editar" ? "Editar Usuario" : "Agregar Usuario"}
      maskClosable={false}
    >
      <Form
        layout="horizontal"
        form={form}
        initialValues={{ ...datoSeleccionado }}
        {...format}
      >
        <Form.Item label="Nombres" name="nombre" required>
          <Input type="text" placeholder="Ingrese el nombre" />
        </Form.Item>
        <Form.Item label="Apellidos" name="apellido" required>
          <Input type="text" placeholder="Ingrese los apellido" />
        </Form.Item>
        <Form.Item label="e-mail" name="email" required>
          <Input type="email" placeholder="Ingrese el email" />
        </Form.Item>
        <Form.Item label="Celular" name="celular" required>
          <Input type="number" placeholder="Ingrese los celular" />
        </Form.Item>
        <Form.Item label="Contraseña" name="password" required>
          <Input
            type="password"
            placeholder="Ingrese la contraseña"
            autocomplete="new-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
