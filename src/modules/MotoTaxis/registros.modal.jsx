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
import { registrosService } from "../../services";
import moment from "moment";

const ModalRegitro = ({
  datoSeleccionado,
  datoSeleccionadoMotoTaxi,
  verModal,
  setVerModal,
  tipo,
  traerDatos,
}) => {
  const [form] = Form.useForm();
  const [loadSave, setLoadSave] = useState(false);
  const [imagenDocumento, setImagenDocumento] = useState(null);
  const [fecha, setFecha] = useState(
    tipo === "editar" && moment(datoSeleccionado.fechaInicio)
  );
  const [gasto, setGasto] = useState(
    tipo === "editar" ? datoSeleccionado.valor_gasto > 0 : false
  );

  const guardarImgDocumento = async (id) => {
    try {
      const respuesta = await registrosService.uploadImage({
        imagen: imagenDocumento,
        registroMotoId: id,
      });
      if (respuesta.data.statusCode !== 200)
        openNotification("Error", "No se pudo guardar la imagen", "Alerta");
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
    const valor = form.getFieldValue("valor");
    const valor_gasto = form.getFieldValue("valor_gasto");
    const descripcion = form.getFieldValue("descripcion");

    if (!valor || !fecha) {
      openNotification(
        "Datos Incompletos",
        "Complete todos los campos para guardar",
        "Alerta"
      );
      setLoadSave(false);
      return;
    }

    const data = {
      valor,
      fecha: fecha.toISOString(),
      valor_gasto,
      descripcion,
      motoPersonaId: datoSeleccionadoMotoTaxi.id,
    };

    let respuesta;
    try {
      if (tipo === "editar") {
        respuesta = await registrosService.update(datoSeleccionado.id, data);
        if (respuesta.data.statusCode === 200) {
          openNotification(
            "Editado Correctamente",
            "El Registro se editó correctamente",
            ""
          );
        } else {
          openNotification("Error", "No se pudo registrar", "Alerta");
        }
      } else {
        respuesta = await registrosService.create(data);
        if (respuesta.data.statusCode === 200) {
          openNotification(
            "Guardado Correctamente",
            "El Registro se registró correctamente",
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

    if (imagenDocumento) await guardarImgDocumento(respuesta.data.body.id);

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
      title={tipo === "editar" ? "Editar Registro" : "Agregar Registro"}
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
        <Form.Item label="Gasto" name="gasto">
          <Switch checked={gasto} onChange={setGasto} />
        </Form.Item>
        {gasto && (
          <>
            <Form.Item label="Valor de gasto" name="valor_gasto">
              <Input type="text" placeholder="Ingrese el valor de gasto" />
            </Form.Item>
            <Form.Item label="Descripción" name="descripcion">
              <Input type="text" placeholder="Ingrese la descripcion" />
            </Form.Item>
            <Form.Item name="imagen" label="Documento">
              <Input
                type="file"
                onChange={(event) => {
                  setImagenDocumento(event.target.files[0]);
                }}
                accept="image/jpeg, image/png"
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ModalRegitro;
