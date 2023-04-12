import React from "react";

import { Drawer, Row, Col } from "antd";
import { SmileTwoTone } from "@ant-design/icons";
import moment from "moment";
import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";

const InfoProyecto = ({ data, show, setShow }) => {
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
        <SmileTwoTone /> {data.nombre}
      </p>
      <SectionTitleItem>Detalles</SectionTitleItem>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <DescriptionItem title="Descripcion" content={data.descripcion} />
        </Col>
        <Col span={24}>
          <DescriptionItem
            title="Fecha de Inicio"
            content={moment(data.fechaInicio).format("DD/MM/YYYY")}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default InfoProyecto;
