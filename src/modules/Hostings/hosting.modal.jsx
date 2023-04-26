/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Select, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";

import { format, openNotification } from "../../util/utils";
import {
  clientesService,
  proyectosService,
  hostingsService,
} from "../../services";

export const ModalHosting = ({
  datoSeleccionado,
  verModal,
  setVerModal,
  tipo,
  traerDatos,
}) => {
  const [form] = Form.useForm();
  const [loadSave, setLoadSave] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  const traerClientes = async (query) => {
    try {
      const respuesta = await clientesService.getAll(10, 0, query);
      const data = respuesta.data.body[0].map((e, i) => ({
        ...e,
        key: i,
        value: e.id,
        label: `${e.documento} / ${e.razonSocial}`,
      }));
      setClientes([...data]);
    } catch (error) {}
  };

  const traerProyectos = async (idCliente) => {
    try {
      const respuesta = await proyectosService.getAll(10, 0, "", idCliente);
      const data = respuesta.data.body
        .filter((fp) => !fp.inProgress)
        .map((e, i) => ({
          ...e,
          key: i,
          value: e.id,
          label: `${e.nombre}`,
        }));
      setProyectos([...data]);
    } catch (error) {}
  };

  const agregar = async () => {
    setLoadSave(true);
    const proyectoId = form.getFieldValue("proyectoId");
    const enlace = form.getFieldValue("enlace");
    const credenciales = form.getFieldValue("credenciales");

    if (!proyectoId || !enlace || !credenciales) {
      openNotification(
        "Datos Incompletos",
        "Complete todos los campos para guardar",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    const data = {
      proyectoId,
      enlace,
      credenciales,
    };

    try {
      if (tipo === "editar") {
        const respuesta = await hostingsService.update(
          datoSeleccionado.id,
          data
        );
        if (respuesta.data.statusCode === 200) {
          openNotification(
            "Editado Correctamente",
            "El soporte se editó correctamente",
            ""
          );
        } else {
          openNotification(
            "Datos Incompletos",
            "Complete todos los campos para guardar",
            "Alerta"
          );
        }
      } else {
        const respuesta = await hostingsService.create(data);
        if (respuesta.data.statusCode === 200) {
          openNotification(
            "Guardado Correctamente",
            "El soporte se registró correctamente",
            ""
          );
        } else {
          openNotification(
            "Datos Incompletos",
            "Complete todos los campos para guardar",
            "Alerta"
          );
        }
      }
      traerDatos({
        current: 1,
        pageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20],
      });
      setVerModal(false);
      setLoadSave(false);
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
    traerClientes();
    if (tipo === "editar") {
      form.setFieldsValue({
        ...datoSeleccionado,
        proyectoId: {
          value: datoSeleccionado.proyecto.id,
          label: datoSeleccionado.proyecto.nombre,
        },
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
      title={tipo === "editar" ? "Editar hosting" : "Agregar hosting"}
      maskClosable={false}
    >
      <Form
        layout="horizontal"
        form={form}
        initialValues={{ ...datoSeleccionado }}
        {...format}
      >
        {tipo !== "editar" && (
          <Form.Item label="Cliente" name="clienteId" required>
            <Select
              showSearch
              options={clientes}
              onSearch={(e) => traerClientes(e)}
              onChange={(e) => traerProyectos(e)}
              placeholder="Seleccione el cliente"
            />
          </Form.Item>
        )}
        <Form.Item label="Proyecto" name="proyectoId" required>
          <Select
            options={proyectos}
            placeholder="Seleccione el proyecto"
            disabled={tipo === "editar"}
          />
        </Form.Item>
        <Form.Item label="Enlace" name="enlace" required>
          <Input
            placeholder="Ingrese el enlace del hosting"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Credenciales" name="credenciales" required>
          <TextArea rows={2} placeholder="Registre las credenciales" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
