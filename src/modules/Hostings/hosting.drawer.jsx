import { Drawer, Row, Col } from "antd";
import { HddTwoTone } from "@ant-design/icons";

import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";
import DrawerTitle from "../../components/DrawerTitle/DrawerTitle";

export const InfoHosting = ({ data, show, setShow }) => {
  return (
    <Drawer
      width={1000}
      placement="right"
      closable={false}
      onClose={() => setShow(false)}
      open={show}
    >
      <DrawerTitle title="Hosting" icon={<HddTwoTone />} />
      <SectionTitleItem>Información</SectionTitleItem>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <DescriptionItem
            title="Cliente"
            content={data.proyecto.cliente.razonSocial}
          />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Proyecto" content={data.proyecto.nombre} />
        </Col>
        <Col span={24}>
          <DescriptionItem
            title="Enlace"
            content={
              <a href={data.enlace} target="_blank" rel="noopener noreferrer">
                {data.enlace}
              </a>
            }
          />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Credenciales" content={data.credenciales} />
        </Col>
      </Row>
    </Drawer>
  );
};
