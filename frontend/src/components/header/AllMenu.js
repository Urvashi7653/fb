import { menu, create } from "../../components/data/allMenu.js";
import AllMenuItem from "./allMenuItem.js";

export default function AllMenu() {
  return (
    <div className="all_menu">
      <div className=" all_menu_header">
        <div className="all_menu_wrap scrollbar">
          <div className="all_left">
            <div className="all_menu_search">
              <i className="amm_s_ic"></i>
              <input type="text" placeholder="Search Menu" />
            </div>
            <div className="all_menu_group">
              <div className="all_menu_group_header">Choose from below</div>
              {menu.map((item, i) => (
                <AllMenuItem
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
          <div className="all_right">
            <div className="all_right_header">Create
              {create.map((item,i) => (
                <div className="all_right_item hover1" key={i}> 
                    <div className="all_right_circle">
                  <i className={item.icon}></i>
                  </div>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
