import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarCollapseBtn,
  NavbarContainer,
  NavbarItem,
  NavbarList,
} from "keep-react";

const NavbarComponent = () => {
  return (
    <Navbar className="px-2">
      <NavbarContainer>
        <NavbarBrand>
          <h4>Stress</h4>
        </NavbarBrand>
        <NavbarList>
          <NavbarItem>Projects</NavbarItem>
          <NavbarItem>Research</NavbarItem>
          <NavbarItem>Contact</NavbarItem>
        </NavbarList>
        <NavbarList>
          <Link to="/login">
            <NavbarItem>Sign In</NavbarItem>
          </Link>
          <Link to="/register">
            <NavbarItem active={true}>Sign Up</NavbarItem>
          </Link>
        </NavbarList>
        <NavbarCollapseBtn />
        <NavbarCollapse>
          <NavbarItem>Projects</NavbarItem>
          <NavbarItem>Research</NavbarItem>
          <NavbarItem>Contact</NavbarItem>
          <Link to="/login">
            <NavbarItem>Sign In</NavbarItem>
          </Link>
          <Link to="/register">
            <NavbarItem active={true}>Sign Up</NavbarItem>
          </Link>
        </NavbarCollapse>
      </NavbarContainer>
    </Navbar>
  );
};

export default NavbarComponent;
