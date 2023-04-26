import { Drawer, Row, Col } from "antd";
import { CustomerServiceTwoTone } from "@ant-design/icons";

import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";
import DrawerTitle from "../../components/DrawerTitle/DrawerTitle";
import moment from "moment";
import { formatter } from "../../util/utils";

export const InfoSoporte = ({ data, show, setShow }) => {
  return (
    <Drawer
      width={1000}
      placement="right"
      closable={false}
      onClose={() => setShow(false)}
      open={show}
    >
      <DrawerTitle title="Soporte" icon={<CustomerServiceTwoTone />} />
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
            title="Fecha de inicio"
            content={
              data.fechaInicio
                ? moment(data.fechaInicio).format("DD/MM/YYYY")
                : "-"
            }
          />
        </Col>
        <Col span={24}>
          <DescriptionItem
            title="Fecha de fin"
            content={
              data.fechaFin ? moment(data.fechaFin).format("DD/MM/YYYY") : "-"
            }
          />
        </Col>
      </Row>
      <SectionTitleItem>Detalles</SectionTitleItem>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <DescriptionItem
            title="Costo"
            content={formatter.format(data.costo)}
          />
        </Col>
        <Col span={24}>
          <DescriptionItem
            title="Estado"
            content={data.abierto ? "Abierto" : "Cerrado"}
          />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Observación" content={data.observacion} />
        </Col>
      </Row>
    </Drawer>
  );
};
