import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPopper } from "@popperjs/core";
import { useRouter } from "next/router";
import Link from "next/link";

import { AppContext } from "@context/index";
import RequestHelper from "@utils/requestHelper";
import { checkToken } from "@utils/tokenManager";
import Menu from "@components/Menu";
import Icons from "./Icons";

const Header = () => {
  const { setPage } = useContext(AppContext);
  const router = useRouter();
  const pathname = router.pathname;

  useEffect(() => {
    setPage(pathname);
  }, [pathname]);

  return (
    <HeaderContainer>
      <div className="header-left">
        <h1 className="title title-deer">
          <Link href="/" passHref>
            <a>
              <Icons.Logo />
            </a>
          </Link>
        </h1>
      </div>

      <div className="header-right">
        <HeaderMenu />
      </div>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  height: 70px;
  padding-top: 0.5rem;
  border-top: 5px solid transparent;
  border-bottom: 5px solid black;
  /* smartphones, iPhone, portrait 480x320 phones */
  @media (min-width: 1px) and (max-width: 480px) {
    padding: 0 2rem;
    height: 60px;
    padding-top: 0.5rem;
    border-bottom: 5px solid black;
    .title {
      font-size: 24px !important;
    }
  }
  .title {
    font-size: 3rem;
    margin: 0;
    padding: 0 1rem;
    display: flex;
  }
  .page {
    margin-left: 3rem;
    display: flex;
    flex-direction: row;
    .name {
      display: flex;
      align-items: center;
      padding: 0 1rem;
    }
  }
  .header-left {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header-right {
    button.name {
      color: black;
    }
  }
`;

const MenuContainer = styled.span`
  float: left;
  #menu-container {
    z-index: 10;
    background-color: white;
    border: solid 2px lightgray;
    border-radius: 5px;
    .menu-item {
      display: flex;
      border-radius: 5px;
      flex-direction: row;
      align-items: center;
      font-size: 1.6rem;
      padding: 1rem 2rem;
      width: 100%;
      &:hover {
        background-color: #f9f9f9;
      }
      svg {
        margin-right: 1.5rem;
      }
    }
  }
  @media (min-width: 1px) and (max-width: 480px) {
    #menu-container {
      position: fixed;
      display: flex;
      flex-direction: column;
      width: 100vw !important;
      right: 0 !important;
      left: 0 !important;
      top: 60px !important;
      bottom: 0 !important;
      border: none;
      border-radius: 0;
      transform: none !important;
    }
    #menu-list-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding-bottom: 5rem;
      justify-content: flex-end;
    }
  }
`;

const HeaderMenu = () => {
  const { logout, isMobile, setLoading } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;

  const btnDropdownRef = useRef<HTMLAnchorElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = checkToken();
    console.log("when changed path, check tokenwriteHead", token);
    setSession(token);
  }, [router.pathname]);

  useEffect(() => {
    if (btnDropdownRef?.current && popoverDropdownRef?.current) {
      const popperInstance = createPopper(btnDropdownRef?.current, popoverDropdownRef?.current, {
        placement: "bottom-end",
        strategy: "fixed",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 0]
            }
          }
        ]
      });
      const update = () => {
        popperInstance?.update();
      };
      btnDropdownRef?.current?.addEventListener("click", update);
      return () => btnDropdownRef?.current?.removeEventListener("click", update);
    }
    return () => {};
  }, [btnDropdownRef, popoverDropdownRef]);

  const openDropdownPopover = () => setOpen(true);
  const closeDropdownPopover = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (btnDropdownRef.current && !btnDropdownRef.current?.contains(event.target)) {
        closeDropdownPopover();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, [btnDropdownRef]);

  const onClickDropdownPopover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (open) closeDropdownPopover();
    else openDropdownPopover();
  };
  const onLogout = async () => {
    await RequestHelper.Get({ url: "/api/user/logout" });
    logout();
    closeDropdownPopover();
  };

  const onClickMemu = () => {
    setLoading(true);
    closeDropdownPopover();
  };

  return (
    <MenuContainer
      onScroll={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onDrag={(e) => e.stopPropagation()}
    >
      <a ref={btnDropdownRef} onClick={onClickDropdownPopover}>
        {!open ? <Icons.Menu /> : <Icons.Close />}
      </a>
      <div ref={popoverDropdownRef} id="menu-container" style={{ display: `${open ? "flex" : "none"}`, zIndex: 10 }}>
        <div id="menu-tag-list">
          {isMobile && (
            <div>
              <Menu onClick={() => setOpen(false)} />
            </div>
          )}
        </div>
        <div id="menu-list-container" onClick={() => closeDropdownPopover()}>
          {session ? (
            <>
              {pathname !== "/editor" && (
                <Link href="/editor" passHref onClick={onClickMemu}>
                  <a className="menu-item">
                    <Icons.Edit />
                    글작성
                  </a>
                </Link>
              )}
              <a className="menu-item" onClick={onLogout}>
                <Icons.Logout />
                로그아웃
              </a>
              {pathname !== "/user" && (
                <Link href="/user" passHref onClick={onClickMemu}>
                  <a className="menu-item">
                    <Icons.User />
                    내정보 수정
                  </a>
                </Link>
              )}
            </>
          ) : (
            <Link href="/login" passHref onClick={onClickMemu}>
              <a className="menu-item">
                <Icons.Login />
                로그인
              </a>
            </Link>
          )}
        </div>
      </div>
    </MenuContainer>
  );
};
