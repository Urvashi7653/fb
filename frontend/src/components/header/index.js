import "./style.css";
import { Link } from "react-router-dom";
import {
  Friends,
  HomeActive,
  Logo,
  Search,
  Watch,
  Market,
  Gaming,
  Menu,
  Messenger,
  ArrowDown,
  Notifications,
} from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import AllMenu from "./AllMenu";
import { useState, useRef } from "react";
import useClickOutside from "../../helpers/clickOutside";
import UserMenu from "./user menu";

export default function Header() {
  const { user } = useSelector((user) => ({ ...user }));
  console.log(user);
  const color = "#65676b";
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allmenu = useRef(null);
  const usermenu = useRef(null);
  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });
  return (
    <header className="header">
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div
          className=" search search1 "
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search facebook"
            className="hide_input"
          />
        </div>
      </div>

      {showSearchMenu && (
        <SearchMenu color={color} setShowSearchMenu={setShowSearchMenu} />
      )}
      <div className="header_middle">
        <Link to="/" className="middle_icon hover1 active">
          <HomeActive color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1 ">
          <Friends color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <div className="middle_notification">9+</div>
          <Watch color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Market color={color} />
        </Link>
        <Link to="/" className="middle_icon hover1">
          <Gaming color={color} />
        </Link>
      </div>
      <div className="header_right">
        <Link to="/profile" className="profile_link hover1">
          <img src={user?.picture} alt=""></img>
          <span>{user?.first_name}</span>
        </Link>
        <div className="circle_icon hover1" ref={allmenu}>
          <div
            onClick={() => {
              setShowAllMenu((prev) => !prev);
            }}
          >
            <Menu />{" "}
          </div>
          {showAllMenu && <AllMenu />}
        </div>
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">5</div>
        </div>
        <div className="circle_icon hover1" ref={usermenu}>
          <div onClick={() => setShowUserMenu((prev) => !prev)}>
            {" "}
            <ArrowDown />
          </div>{" "}
          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
