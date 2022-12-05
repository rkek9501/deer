import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPopper } from "@popperjs/core";
import { useRouter } from "next/router";

import { AppContext } from "@context/index";
import RequestHelper from "@utils/requestHelper";
import { checkToken } from "@utils/tokenManager";
import Menu from "@components/Menu";
import Icons from "./Icons";

const LogoSvg = () => <svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.5568 35H2.27557V8.81818H11.6335C14.267 8.81818 16.5341 9.34233 18.4347 10.3906C20.3352 11.4304 21.7969 12.9261 22.8196 14.8778C23.8509 16.8295 24.3665 19.1648 24.3665 21.8835C24.3665 24.6108 23.8509 26.9545 22.8196 28.9148C21.7969 30.875 20.3267 32.3793 18.4091 33.4276C16.5 34.4759 14.2159 35 11.5568 35ZM7.81108 30.2571H11.3267C12.9631 30.2571 14.3395 29.9673 15.456 29.3878C16.581 28.7997 17.4247 27.892 17.9872 26.6648C18.5582 25.429 18.8438 23.8352 18.8438 21.8835C18.8438 19.9489 18.5582 18.3679 17.9872 17.1406C17.4247 15.9134 16.5852 15.0099 15.4688 14.4304C14.3523 13.8509 12.9759 13.5611 11.3395 13.5611H7.81108V30.2571ZM28.467 35V8.81818H46.109V13.3821H34.0025V19.6207H45.2014V24.1847H34.0025V30.4361H46.1602V35H28.467Z" fill="black"/>
  <path d="M52.0426 6.90909L55.4496 17.2131H55.5838L58.9844 6.90909H61.5923L56.9773 20H54.0497L49.4411 6.90909H52.0426ZM63.3166 20V6.90909H71.8308V8.89702H65.688V12.451H71.3897V14.4389H65.688V18.0121H71.8819V20H63.3166ZM74.2502 20V6.90909H76.6216V18.0121H82.3873V20H74.2502ZM95.6332 13.4545C95.6332 14.8651 95.369 16.0732 94.8406 17.0788C94.3164 18.0803 93.6005 18.8473 92.6928 19.38C91.7894 19.9126 90.7646 20.179 89.6183 20.179C88.4719 20.179 87.445 19.9126 86.5373 19.38C85.6339 18.843 84.918 18.0739 84.3896 17.0724C83.8654 16.0668 83.6033 14.8608 83.6033 13.4545C83.6033 12.044 83.8654 10.8381 84.3896 9.83665C84.918 8.83097 85.6339 8.06179 86.5373 7.52912C87.445 6.99645 88.4719 6.73011 89.6183 6.73011C90.7646 6.73011 91.7894 6.99645 92.6928 7.52912C93.6005 8.06179 94.3164 8.83097 94.8406 9.83665C95.369 10.8381 95.6332 12.044 95.6332 13.4545ZM93.2489 13.4545C93.2489 12.4616 93.0934 11.6243 92.7823 10.9425C92.4755 10.2564 92.0494 9.73864 91.5039 9.3892C90.9585 9.03551 90.3299 8.85866 89.6183 8.85866C88.9066 8.85866 88.2781 9.03551 87.7326 9.3892C87.1871 9.73864 86.7589 10.2564 86.4478 10.9425C86.141 11.6243 85.9876 12.4616 85.9876 13.4545C85.9876 14.4474 86.141 15.2869 86.4478 15.973C86.7589 16.6548 87.1871 17.1726 87.7326 17.5263C88.2781 17.8757 88.9066 18.0504 89.6183 18.0504C90.3299 18.0504 90.9585 17.8757 91.5039 17.5263C92.0494 17.1726 92.4755 16.6548 92.7823 15.973C93.0934 15.2869 93.2489 14.4474 93.2489 13.4545ZM97.8752 20V6.90909H102.784C103.79 6.90909 104.634 7.09659 105.316 7.47159C106.002 7.84659 106.519 8.36222 106.869 9.01847C107.222 9.67045 107.399 10.4119 107.399 11.2429C107.399 12.0824 107.222 12.8281 106.869 13.4801C106.515 14.1321 105.993 14.6456 105.303 15.0206C104.612 15.3913 103.762 15.5767 102.752 15.5767H99.4988V13.6271H102.433C103.021 13.6271 103.502 13.5249 103.877 13.3203C104.252 13.1158 104.529 12.8345 104.708 12.4766C104.892 12.1186 104.983 11.7074 104.983 11.2429C104.983 10.7784 104.892 10.3693 104.708 10.0156C104.529 9.66193 104.25 9.38707 103.871 9.19105C103.496 8.99077 103.012 8.89062 102.42 8.89062H100.247V20H97.8752Z" fill="black"/>
  <path d="M62.4055 27.5078C62.3459 26.9496 62.0945 26.5149 61.6513 26.2038C61.2124 25.8928 60.6413 25.7372 59.9382 25.7372C59.4439 25.7372 59.0199 25.8118 58.6662 25.9609C58.3125 26.1101 58.0419 26.3125 57.8544 26.5682C57.6669 26.8239 57.571 27.1158 57.5668 27.4439C57.5668 27.7166 57.6286 27.9531 57.7521 28.1534C57.88 28.3537 58.0526 28.5241 58.2699 28.6648C58.4872 28.8011 58.728 28.9162 58.9922 29.0099C59.2564 29.1037 59.5227 29.1825 59.7912 29.2464L61.0185 29.5533C61.5128 29.6683 61.9879 29.8239 62.4439 30.0199C62.9041 30.2159 63.3153 30.4631 63.6776 30.7614C64.044 31.0597 64.3338 31.4197 64.5469 31.8416C64.7599 32.2635 64.8665 32.7578 64.8665 33.3246C64.8665 34.0916 64.6705 34.767 64.2784 35.3509C63.8864 35.9304 63.3196 36.3842 62.5781 36.7124C61.8409 37.0362 60.9482 37.1982 59.8999 37.1982C58.8814 37.1982 57.9972 37.0405 57.2472 36.7251C56.5014 36.4098 55.9176 35.9496 55.4957 35.3445C55.0781 34.7393 54.8523 34.0021 54.8182 33.1328H57.1513C57.1854 33.5888 57.326 33.968 57.5732 34.2706C57.8203 34.5732 58.142 34.799 58.5384 34.9482C58.9389 35.0973 59.3864 35.1719 59.8807 35.1719C60.3963 35.1719 60.848 35.0952 61.2358 34.9418C61.6278 34.7841 61.9347 34.5668 62.1562 34.2898C62.3778 34.0085 62.4908 33.6804 62.495 33.3054C62.4908 32.9645 62.3906 32.6832 62.1946 32.4616C61.9986 32.2358 61.7237 32.0483 61.37 31.8991C61.0206 31.7457 60.6115 31.6094 60.1428 31.4901L58.6534 31.1065C57.5753 30.8295 56.723 30.4098 56.0966 29.8473C55.4744 29.2805 55.1634 28.5284 55.1634 27.5909C55.1634 26.8196 55.3722 26.1442 55.7898 25.5646C56.2116 24.9851 56.7848 24.5355 57.5092 24.2159C58.2337 23.892 59.054 23.7301 59.9702 23.7301C60.8991 23.7301 61.7131 23.892 62.4119 24.2159C63.1151 24.5355 63.6669 24.9808 64.0675 25.5518C64.468 26.1186 64.6747 26.7706 64.6875 27.5078H62.4055ZM71.1521 23.9091V37H68.7806V23.9091H71.1521ZM84.29 28.0895C84.1835 27.7443 84.0364 27.4354 83.8489 27.1626C83.6657 26.8857 83.4441 26.6491 83.1842 26.4531C82.9285 26.2571 82.6344 26.1101 82.3021 26.0121C81.9697 25.9098 81.6075 25.8587 81.2154 25.8587C80.5123 25.8587 79.8859 26.0355 79.3362 26.3892C78.7864 26.7429 78.3539 27.2628 78.0386 27.9489C77.7275 28.6307 77.5719 29.4616 77.5719 30.4418C77.5719 31.4304 77.7275 32.2678 78.0386 32.9538C78.3496 33.6399 78.7822 34.1619 79.3362 34.5199C79.8901 34.8736 80.5336 35.0504 81.2665 35.0504C81.9313 35.0504 82.5066 34.9226 82.9924 34.6669C83.4825 34.4112 83.8596 34.049 84.1238 33.5803C84.388 33.1072 84.5201 32.5533 84.5201 31.9183L85.057 32.0014H81.5031V30.1477H86.8148V31.7202C86.8148 32.8409 86.5762 33.8104 86.0989 34.6286C85.6217 35.4467 84.9654 36.0774 84.1302 36.5206C83.295 36.9595 82.3362 37.179 81.2538 37.179C80.0478 37.179 78.9889 36.9084 78.0769 36.3672C77.1692 35.8217 76.4597 35.0483 75.9484 34.0469C75.4413 33.0412 75.1877 31.848 75.1877 30.4673C75.1877 29.4105 75.3369 28.4666 75.6352 27.6357C75.9377 26.8047 76.3596 26.0994 76.9008 25.5199C77.442 24.9361 78.0769 24.4929 78.8056 24.1903C79.5343 23.8835 80.3269 23.7301 81.1835 23.7301C81.9079 23.7301 82.5833 23.8366 83.2097 24.0497C83.8362 24.2585 84.3923 24.5568 84.8781 24.9446C85.3681 25.3324 85.7708 25.7926 86.0862 26.3253C86.4015 26.858 86.6082 27.446 86.7062 28.0895H84.29ZM101.666 23.9091V37H99.5564L93.3881 28.0831H93.2794V37H90.908V23.9091H93.0302L99.1921 32.8324H99.3071V23.9091H101.666Z" fill="black"/>
  <path d="M110.276 35V8.81818H127.918V13.3821H115.811V19.6207H127.01V24.1847H115.811V30.4361H127.969V35H110.276ZM132.319 35V8.81818H142.648C144.625 8.81818 146.313 9.17187 147.711 9.87926C149.117 10.5781 150.186 11.571 150.919 12.858C151.661 14.1364 152.032 15.6406 152.032 17.3707C152.032 19.1094 151.657 20.6051 150.907 21.858C150.157 23.1023 149.07 24.0568 147.647 24.7216C146.232 25.3864 144.519 25.7188 142.507 25.7188H135.591V21.2699H141.613C142.669 21.2699 143.547 21.125 144.246 20.8352C144.945 20.5455 145.465 20.1108 145.806 19.5312C146.155 18.9517 146.33 18.2315 146.33 17.3707C146.33 16.5014 146.155 15.7685 145.806 15.1719C145.465 14.5753 144.941 14.1236 144.233 13.8168C143.534 13.5014 142.652 13.3438 141.587 13.3438H137.854V35H132.319ZM146.458 23.0852L152.965 35H146.854L140.488 23.0852H146.458Z" fill="black"/>
  <path d="M30 22H127" stroke="black" stroke-width="2"/>
</svg>;

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
        <h1 className="title title-trident" onClick={() => router.push("/", undefined, { shallow: false })}>
          <LogoSvg />
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
    margin-top: 0.5rem;
    padding: 0 1rem;
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
  const { logout, isMobile } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  
  const btnDropdownRef = useRef<HTMLAnchorElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = checkToken();
    console.log("when changed path, check tokenwriteHead", token)
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

  const onLogout = async () => {
    await RequestHelper.Get({ url: "/api/user/logout" });
    logout();
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
      <a
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          if (open) closeDropdownPopover();
          else openDropdownPopover();
        }}
      >
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
                <div
                  className="menu-item"
                  onClick={() => {
                    router.push("/editor");
                  }}
                >
                  <Icons.Edit />
                  글작성
                </div>
              )}
              <div className="menu-item" onClick={() => onLogout()}>
                <Icons.Logout />
                로그아웃
              </div>
              {pathname !== "/user" && (
                <div
                  className="menu-item"
                  onClick={() => {
                    router.push("/user");
                  }}
                >
                  <Icons.User />
                  내정보 수정
                </div>
              )}
            </>
          ) : (
            <div
              className="menu-item"
              onClick={() => {
                router.push("/login");
                closeDropdownPopover();
              }}
            >
              <Icons.Login />
              로그인
            </div>
          )}
        </div>
      </div>
    </MenuContainer>
  );
};
