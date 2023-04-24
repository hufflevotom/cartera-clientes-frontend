import React from "react";

import { Drawer, Row, Col } from "antd";
import { SmileTwoTone } from "@ant-design/icons";
import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";

export const InfoMotoTaxi = ({ data, show, setShow }) => {
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
        <SmileTwoTone /> Moto Taxi
      </p>
      <SectionTitleItem>Detalles</SectionTitleItem>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <DescriptionItem title="Documento" content={data.documento} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Razón Social" content={data.razonSocial} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Responsable" content={data.responsable} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Telefono" content={data.telefono} />
        </Col>
      </Row>
    </Drawer>
  );
};
