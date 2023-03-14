import React from "react";

export const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <use xlinkHref="#svg-menu-icon" />
  </svg>
);
const MenuSvg = () => (
  <svg id="svg-menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="4" fill="black" />
    <rect y="10" width="24" height="4" fill="black" />
    <rect y="20" width="24" height="4" fill="black" />
  </svg>
);
export const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" transform="rotate(45)">
    <use xlinkHref="#svg-close-icon" />
  </svg>
);
export const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <use xlinkHref="#svg-close-icon" />
  </svg>
);
const CloseSvg = () => (
  <svg id="svg-close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="0.599976" y="20.6" width="28" height="4" transform="rotate(-45 0.599976 20.6)" fill="black" />
    <rect x="3.59998" y="0.599976" width="28" height="4" transform="rotate(45 3.59998 0.599976)" fill="black" />
  </svg>
);

export const SearchIcon = () => {
  const [hover, setHover] = React.useState(false);
  return (
    <svg onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} viewBox="0 0 24 24" width="24" height="24">
      {hover ? <use xlinkHref="#svg-search-white-icon" /> : <use xlinkHref="#svg-search-black-icon" />}
    </svg>
  );
};
const SearchSvg = () => (
  <>
    <svg id="svg-search-white-icon" data-name="Isolation Mode" viewBox="0 0 24 24" width="24" height="24">
      <path
        d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
        fill="white"
      />
    </svg>
    <svg id="svg-search-black-icon" data-name="Isolation Mode" viewBox="0 0 24 24" width="24" height="24">
      <path
        d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
        fill="black"
      />
    </svg>
  </>
);

export const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <use xlinkHref="#svg-edit-icon" />
  </svg>
);
const EditSvg = () => (
  <svg id="svg-edit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M16.6 3.20005L20.8 7.40005L7.50005 20.7001L2.60005 21.3L3.20005 16.4L16.6 3.20005ZM16.6 0.300049L1.40005 15.5L0.300049 23.6L8.40005 22.5L23.7001 7.40005L16.6 0.300049Z"
      fill="black"
    />
    <path d="M12.9 4L20 11.1" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
  </svg>
);

export const LoginIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <use xlinkHref="#svg-login-icon" />
  </svg>
);
const LoginSvg = () => (
  <svg id="svg-login-icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M14.1 2V4H16.1V0H0.0999756V22H16.1V18H14.1V20H2.09998V2H14.1Z" fill="black" />
    <path d="M5.89514 11.9525L21.8951 11.9525L21.8951 9.95251L5.89514 9.95251L5.89514 11.9525Z" fill="black" />
    <path d="M9.89671 16.3656L11.3109 14.9514L5.93695 9.57746L4.52275 10.9917L9.89671 16.3656Z" fill="black" />
    <path d="M5.91413 12.3752L11.2881 7.00122L9.87389 5.58702L4.49993 10.961L5.91413 12.3752Z" fill="black" />
  </svg>
);

export const LogoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <use xlinkHref="#svg-logout-icon" />
  </svg>
);
const LogoutSvg = () => (
  <svg id="svg-logout-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15.1 3V5H17.1V1H1.09998V23H17.1V19H15.1V21H3.09998V3H15.1Z" fill="black" />
    <path d="M21.5 11H5.5V13H21.5V11Z" fill="black" />
    <path d="M17.4984 6.58702L16.0842 8.00122L21.4582 13.3752L22.8724 11.961L17.4984 6.58702Z" fill="black" />
    <path d="M21.481 10.5775L16.1071 15.9514L17.5213 17.3656L22.8952 11.9917L21.481 10.5775Z" fill="black" />
  </svg>
);

export const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <use xlinkHref="#svg-user-icon" />
  </svg>
);
const UserSvg = () => (
  <svg id="svg-user-icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path
      d="M11 12C7.7 12 5 9.3 5 6C5 2.7 7.7 0 11 0C14.3 0 17 2.7 17 6C17 9.3 14.3 12 11 12ZM11 2C8.8 2 7 3.8 7 6C7 8.2 8.8 10 11 10C13.2 10 15 8.2 15 6C15 3.8 13.2 2 11 2Z"
      fill="black"
    />
    <path
      d="M21.9 22H0V19C0 15.7 2.7 13 6 13H15.9C19.2 13 21.9 15.7 21.9 19V22ZM2 20H19.9V19C19.9 16.8 18.1 15 15.9 15H6C3.8 15 2 16.8 2 19V20Z"
      fill="black"
    />
  </svg>
);

export const ToTopIcon = () => (
  <svg width="35" height="35" viewBox="0 0 37 37" fill="none">
    <use xlinkHref="#svg-to-top-icon" />
  </svg>
);
const ToTopSvg = () => (
  <svg id="svg-to-top-icon" width="35" height="35" viewBox="0 0 37 37" fill="none">
    <path d="M1 19.6144L18.5 2M18.5 2L36 19.6144M18.5 2V37" stroke="#333333" strokeWidth="2" />
  </svg>
);

export const AddBoxIcon = () => {
  const [hover, setHover] = React.useState(false);
  return (
    <svg
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill={hover ? "black" : "white"}
    >
      {hover ? <use xlinkHref="#svg-addbox-white-icon" /> : <use xlinkHref="#svg-addbox-black-icon" />}
      <rect x="0.5" y="0.5" width="29" height="29" stroke={hover ? "white" : "black"} />
      <rect x="14" y="5" width="2" height="20" fill={hover ? "white" : "black"} />
      <rect x="25" y="14" width="2" height="20" transform="rotate(90 25 14)" fill={hover ? "white" : "black"} />
    </svg>
  );
};
const AddBoxSvg = () => (
  <>
    <svg id="svg-addbox-whtie-icon" width="35" height="35" viewBox="0 0 35 35" fill="white">
      <rect x="0.5" y="0.5" width="29" height="29" stroke="white" />
      <rect x="14" y="5" width="2" height="20" fill="white" />
      <rect x="25" y="14" width="2" height="20" transform="rotate(90 25 14)" fill="white" />
    </svg>
    <svg id="svg-addbox-black-icon" width="35" height="35" viewBox="0 0 35 35" fill="black">
      <rect x="0.5" y="0.5" width="29" height="29" stroke="black" />
      <rect x="14" y="5" width="2" height="20" fill="black" />
      <rect x="25" y="14" width="2" height="20" transform="rotate(90 25 14)" fill="black" />
    </svg>
  </>
);

export const UploadIcon = () => (
  <svg viewBox="0 0 1024 1024" width="12" height="12">
    <use xlinkHref="#svg-upload-icon" />
  </svg>
);
const UploadSvg = () => (
  <svg id="svg-upload-icon" viewBox="0 0 1024 1024" width="12" height="12"> 
    <path fill="currentColor" d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z" /> 
  </svg>
);

export const ExpandLessIcon = (props: { rotate?: number }) => (
  <svg width="20" height="10" viewBox="0 0 47 23" fill="none" transform={`rotate(${props.rotate || 0})`}>
    <use xlinkHref="#svg-expandless-icon" />
  </svg>
);
const ExpandLessSvg = (props: { rotate?: number }) => (
  <svg id="svg-expandless-icon" width="20" height="10" viewBox="0 0 47 23" fill="none" transform={`rotate(${props.rotate || 0})`}>
    <path d="M2 2L25.5 20L45.5 2" stroke="black" strokeWidth="4" />
  </svg>
);

export const HashTagIcon = () => (
  <svg width="21" height="23" viewBox="0 0 21 23">
    <use xlinkHref="#svg-hash-tag-icon" />
  </svg>
);
const HashTagSvg = () => (
  <svg id="svg-hash-tag-icon" width="21" height="23" viewBox="0 0 21 23" fill="none">
    <path d="M8.664 18.976H11.088L12.192 13.864H15.864V11.728H12.624L13.608 7.408H16.776V5.272H14.04L15.168 0.159999H12.744L11.616 5.272H7.8L8.928 0.159999H6.504L5.352 5.272H1.728V7.408H4.92L3.96 11.728H0.816V13.864H3.528L2.424 18.976H4.824L5.952 13.864H9.768L8.664 18.976ZM7.344 7.408H11.16L10.2 11.728H6.384L7.344 7.408Z" fill="black"/>
  </svg>
);

export const Logo = () => (
  <svg width="108" height="31" viewBox="0 0 108 31" fill="none">
    <use xlinkHref="#deer-main-logo" />
  </svg>
);
const LogoSvg = () => (
  <svg id="deer-main-logo" width="108" height="31" viewBox="0 0 108 31" fill="none">
    <path
      d="M103.281 0H98.5618V2.38462H103.281V4.76923H98.5618V7.15385H103.281V9.53846H89.1236H87.9438C85.9854 9.53846 84.4045 11.1362 84.4045 13.1154V14.3077V17.8846V19.0769C84.4045 21.0562 85.9854 22.6538 87.9438 22.6538H89.1236H90.4095L84.4045 31H90.3034L98.373 19.7804C98.9511 18.9935 98.3848 17.8846 97.4292 17.8846H96.2022H93.8427H90.3034C89.6545 17.8846 89.1236 17.3481 89.1236 16.6923V15.5C89.1236 14.8442 89.6545 14.3077 90.3034 14.3077H102.101C102.75 14.3077 103.281 14.8442 103.281 15.5V29.8077C103.281 30.4635 103.812 31 104.461 31H106.82C107.469 31 108 30.4635 108 29.8077V14.3077V9.53846V7.15385V4.76923V2.38462V1.19231C108 0.536538 107.469 0 106.82 0H103.281Z"
      fill="black"
    />
    <path
      d="M51.875 13.5V11.1667C51.875 10.525 51.3406 10 50.6875 10H32.875H29.3125C28.6594 10 28.125 10.525 28.125 11.1667V14.6667V18.1667V22.8333V26.3333V29.8333C28.125 30.475 28.6594 31 29.3125 31H32.875H50.6875C51.3406 31 51.875 30.475 51.875 29.8333V27.5C51.875 26.8583 51.3406 26.3333 50.6875 26.3333H34.0625C33.4094 26.3333 32.875 25.8083 32.875 25.1667V24C32.875 23.3583 32.875 17.6417 32.875 17V15.8333C32.875 15.1917 33.4094 14.6667 34.0625 14.6667H50.6875C51.3406 14.6667 51.875 14.1417 51.875 13.5Z"
      fill="black"
    />
    <path
      d="M50.3875 22.8333H38.4875C37.6694 22.8333 37 22.3083 37 21.6667V19.3333C37 18.6917 37.6694 18.1667 38.4875 18.1667H50.3875C51.2056 18.1667 51.875 18.6917 51.875 19.3333V21.6667C51.875 22.3083 51.2056 22.8333 50.3875 22.8333Z"
      fill="black"
    />
    <path
      d="M80 13.5V11.1667C80 10.525 79.4656 10 78.8125 10H61H57.4375C56.7844 10 56.25 10.525 56.25 11.1667V14.6667V18.1667V22.8333V26.3333V29.8333C56.25 30.475 56.7844 31 57.4375 31H61H78.8125C79.4656 31 80 30.475 80 29.8333V27.5C80 26.8583 79.4656 26.3333 78.8125 26.3333H62.1875C61.5344 26.3333 61 25.8083 61 25.1667V24C61 23.3583 61 17.6417 61 17V15.8333C61 15.1917 61.5344 14.6667 62.1875 14.6667H78.8125C79.4656 14.6667 80 14.1417 80 13.5Z"
      fill="black"
    />
    <path
      d="M78.5 22.8333H66.5C65.675 22.8333 65 22.3083 65 21.6667V19.3333C65 18.6917 65.675 18.1667 66.5 18.1667H78.5C79.325 18.1667 80 18.6917 80 19.3333V21.6667C80 22.3083 79.325 22.8333 78.5 22.8333Z"
      fill="black"
    />
    <g clipPath="url(#clip0_2413_4829)">
      <path
        d="M17.1 10H5.6H2.15C1.5175 10 1 10.525 1 11.1667V14.6667V26.3333V29.8333C1 30.475 1.5175 31 2.15 31H5.6H17.1C20.9065 31 24 27.8617 24 24V17C24 13.1383 20.9065 10 17.1 10ZM19.4 24C19.4 25.2833 18.365 26.3333 17.1 26.3333H5.6V14.6667H17.1C18.365 14.6667 19.4 15.7167 19.4 17V24Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_2413_4829">
        <rect width="23" height="21" fill="white" transform="translate(1 10)" />
      </clipPath>
    </defs>
  </svg>
);

export const SvgDefs = () => {
  return (
    <div style={{ display: "none" }}>
      <defs>
        <AddBoxSvg />
        <CloseSvg />
        <EditSvg />
        <ExpandLessSvg />
        <HashTagSvg />
        <LogoSvg />
        <LoginSvg />
        <LogoutSvg />
        <MenuSvg />
        <SearchSvg />
        <ToTopSvg />
        <UploadSvg />
        <UserSvg />
      </defs>
    </div>
  );
};

export default {
  Logo,
  Menu: MenuIcon,
  Close: CloseIcon,
  Search: SearchIcon,
  HashTag: HashTagIcon,
  Edit: EditIcon,
  Logout: LogoutIcon,
  Login: LoginIcon,
  User: UserIcon,
  ToTop: ToTopIcon,
  AddBox: AddBoxIcon,
  Upload: UploadIcon,
  Plus: PlusIcon,
  ExpandLess: ExpandLessIcon
};
