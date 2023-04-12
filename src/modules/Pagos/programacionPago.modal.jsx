/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Button, Modal, Form, Select, InputNumber } from "antd";

import { format, openNotification } from "../../util/utils";
import {
  clientesService,
  programacionPagosService,
  proyectosService,
} from "../../services";
import TextArea from "antd/lib/input/TextArea";

export const ModalProgramacionPago = ({
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
      const data = respuesta.data.body.map((e, i) => ({
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
    const diaPago = form.getFieldValue("diaPago");
    const Observaciones = form.getFieldValue("Observaciones");

    if (!proyectoId || !diaPago || !Observaciones) {
      openNotification(
        "Datos Incompletos",
        "Complete todos los campos para guardar",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    if (diaPago < 1 || diaPago > 31) {
      openNotification(
        "Datos Incompletos",
        "El día de pago debe estar entre 1 y 31",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    const data = {
      proyectoId,
      diaPago,
      Observaciones,
    };

    try {
      if (tipo === "editar") {
        const respuesta = await programacionPagosService.update(
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
            "La programación del pago se editó correctamente",
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
        const respuesta = await programacionPagosService.create(data);
        if (respuesta.data.statusCode === 200) {
          traerDatos({
            current: 1,
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
          });
          openNotification(
            "Guardado Correctamente",
            "La programación del pago se registró correctamente",
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
      visible={verModal}
      footer={
        <Button onClick={agregar} type="primary" loading={loadSave}>
          {tipo === "editar" ? "Editar" : "Agregar"}
        </Button>
      }
      onCancel={() => setVerModal(false)}
      title={
        tipo === "editar"
          ? "Editar Programación de Pago"
          : "Agregar Programación de Pago"
      }
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
        <Form.Item label="Día de Pago" name="diaPago" required>
          <InputNumber min={1} max={30} />
        </Form.Item>
        <Form.Item label="Observaciones" name="Observaciones" required>
          <TextArea rows={4} placeholder="Ingrese las Observaciones" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
