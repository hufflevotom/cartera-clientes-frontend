import moment from "moment";
import { Drawer, Row, Col } from "antd";
import { ProjectTwoTone } from "@ant-design/icons";

import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";
import DrawerTitle from "../../components/DrawerTitle/DrawerTitle";

const InfoProyecto = ({ data, show, setShow }) => {
  return (
    <Drawer
      width={1000}
      placement="right"
      closable={false}
      onClose={() => setShow(false)}
      open={show}
    >
      <DrawerTitle title="Proyecto" icon={<ProjectTwoTone />} />
      <SectionTitleItem>Información</SectionTitleItem>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <DescriptionItem title="Nombre" content={data.nombre} />
        </Col>
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
