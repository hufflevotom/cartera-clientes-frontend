import "./DrawerTitle.css";

const DrawerTitle = ({ icon, title }) => {
  return (
    <div className="drawer-title">
      {icon} {title}
    </div>
  );
};

export default DrawerTitle;
