import moment from "moment";
import { Drawer, Row, Col } from "antd";
import { CreditCardTwoTone } from "@ant-design/icons";

import SectionTitleItem from "../../components/SectionTitleItem/SectionTitleItem";
import DescriptionItem from "../../components/DescriptionItem/DescriptionItem";
import DrawerTitle from "../../components/DrawerTitle/DrawerTitle";

const InfoPago = ({ data, show, setShow }) => {
  return (
    <Drawer
      width={1000}
      placement="right"
      closable={false}
      onClose={() => setShow(false)}
      open={show}
    >
      <DrawerTitle title="Pago" icon={<CreditCardTwoTone />} />
      <SectionTitleItem>Detalles</SectionTitleItem>
      <Row style={{ width: "100%" }}>
        <Col span={24}>
          <DescriptionItem title="Monto" content={data.monto} />
        </Col>
        <Col span={24}>
          <DescriptionItem
            title="Fecha de pago"
            content={moment(data.fechaPago).format("DD/MM/YYYY")}
          />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Observaciones" content={data.observaciones} />
        </Col>
      </Row>
    </Drawer>
  );
};

export default InfoPago;
