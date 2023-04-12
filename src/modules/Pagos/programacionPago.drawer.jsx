import React from "react";

import { Drawer, Row, Col } from "antd";
import { SmileTwoTone } from "@ant-design/icons";
import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";

const InfoProgramacionPago = ({ data, show, setShow }) => {
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
        <SmileTwoTone /> {data.proyecto.nombre}
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
          <DescriptionItem title="Observaciones" content={data.Observaciones} />
        </Col>
      </Row>
    </Drawer>
  );
};

export default InfoProgramacionPago;
