import React from "react";

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="4" fill="black" />
    <rect y="10" width="24" height="4" fill="black" />
    <rect y="20" width="24" height="4" fill="black" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.599976" y="20.6" width="28" height="4" transform="rotate(-45 0.599976 20.6)" fill="black" />
    <rect x="3.59998" y="0.599976" width="28" height="4" transform="rotate(45 3.59998 0.599976)" fill="black" />
  </svg>
);

const SearchIcon = () => {
  const [hover, setHover] = React.useState(false);
  return (
    <svg
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      xmlns="http://www.w3.org/2000/svg"
      id="Isolation_Mode"
      data-name="Isolation Mode"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
        fill={hover ? "white" : "black"}
      />
    </svg>
  );
};

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.6 3.20005L20.8 7.40005L7.50005 20.7001L2.60005 21.3L3.20005 16.4L16.6 3.20005ZM16.6 0.300049L1.40005 15.5L0.300049 23.6L8.40005 22.5L23.7001 7.40005L16.6 0.300049Z"
      fill="black"
    />
    <path d="M12.9 4L20 11.1" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
  </svg>
);

const LoginIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.1 2V4H16.1V0H0.0999756V22H16.1V18H14.1V20H2.09998V2H14.1Z" fill="black" />
    <path d="M5.89514 11.9525L21.8951 11.9525L21.8951 9.95251L5.89514 9.95251L5.89514 11.9525Z" fill="black" />
    <path d="M9.89671 16.3656L11.3109 14.9514L5.93695 9.57746L4.52275 10.9917L9.89671 16.3656Z" fill="black" />
    <path d="M5.91413 12.3752L11.2881 7.00122L9.87389 5.58702L4.49993 10.961L5.91413 12.3752Z" fill="black" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.1 3V5H17.1V1H1.09998V23H17.1V19H15.1V21H3.09998V3H15.1Z" fill="black" />
    <path d="M21.5 11H5.5V13H21.5V11Z" fill="black" />
    <path d="M17.4984 6.58702L16.0842 8.00122L21.4582 13.3752L22.8724 11.961L17.4984 6.58702Z" fill="black" />
    <path d="M21.481 10.5775L16.1071 15.9514L17.5213 17.3656L22.8952 11.9917L21.481 10.5775Z" fill="black" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const ToTopIcon = () => (
  <svg width="35" height="35" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 19.6144L18.5 2M18.5 2L36 19.6144M18.5 2V37" stroke="#333333" strokeWidth="2" />
  </svg>
);

const AddBoxIcon = () => {
  const [hover, setHover] = React.useState(false);
  return (
    <svg
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill={hover ? "black" : "white"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="29" height="29" stroke={hover ? "white" : "black"} />
      <rect x="14" y="5" width="2" height="20" fill={hover ? "white" : "black"} />
      <rect x="25" y="14" width="2" height="20" transform="rotate(90 25 14)" fill={hover ? "white" : "black"} />
    </svg>
  );
};

const UploadIcon = () => <svg viewBox="0 0 1024 1024" width="12" height="12">
  <path fill="currentColor" d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z" />
</svg>;

export default {
  Menu: MenuIcon,
  Close: CloseIcon,
  Search: SearchIcon,
  Edit: EditIcon,
  Logout: LogoutIcon,
  Login: LoginIcon,
  User: UserIcon,
  ToTop: ToTopIcon,
  AddBox: AddBoxIcon,
  Upload: UploadIcon
};
