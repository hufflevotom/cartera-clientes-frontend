import React from "react";

import { Drawer, Row, Col } from "antd";
import { CreditCardTwoTone } from "@ant-design/icons";

import { formatter } from "../../util/utils";

import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";

export const InfoProgramacionPago = ({ data, show, setShow }) => {
  return (
    <Drawer
      width={1000}
      placement="right"
      closable={false}
      onClose={() => setShow(false)}
      open={show}
    >
      <p
        style={{
          marginBottom: 24,
          fontSize: "24px",
        }}
      >
        <CreditCardTwoTone /> Programación de pago
      </p>
      <SectionTitleItem>Detalles</SectionTitleItem>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <DescriptionItem
            title="Día de pago"
            content={data.diaPago + " de cada mes"}
          />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Proyecto" content={data.proyecto.nombre} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Observaciones" content={data.Observaciones} />
        </Col>
      </Row>
      {data.pagos.length > 0 && (
        <>
          <SectionTitleItem>Pagos</SectionTitleItem>
          <Row style={{ width: "100%" }}>
            <Col span={24}>
              <DescriptionItem title="Pagos" content={data.pagos.length} />
            </Col>
            <Col span={24}>
              <DescriptionItem
                title="Monto pagado"
                content={formatter.format(
                  data.pagos
                    .reduce((a, b) => a + parseFloat(b.monto), 0)
                    .toFixed(2)
                )}
              />
            </Col>
            <Col span={24}>
              <DescriptionItem
                title="Última fecha de pago"
                content={new Date(
                  data.pagos.sort(
                    (a, b) => new Date(a.fechaPago) - new Date(b.fechaPago)
                  )[0]?.fechaPago || null
                ).toLocaleDateString()}
              />
            </Col>
          </Row>
        </>
      )}
    </Drawer>
  );
};
