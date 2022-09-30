const passwordValidation = (pass: string) => {
  if (/\s+/.test(pass)) return "비밀번호는 공백 없이 입력해주세요.";

  let hasEng = false;
  let hasNum = false;
  let hasSpc = false;
  let hasCount = 0;

  if (/[a-z]/.test(pass)) {
    hasEng = true;
    hasCount++;
  }
  if (/[0-9]/.test(pass)) {
    hasNum = true;
    hasCount++;
  }
  if (/[`~!@#$%\^&\*?\/<>]/.test(pass)) {
    hasSpc = true;
    hasCount++;
  }

  if (hasCount <= 1) {
    return "비밀번호는 영문,숫자,특수문자 중 2가지 이상을 조합해 주세요.";
  } else if (hasCount === 2 && (pass.toString().length > 128 || pass.toString().length < 10)) {
    return "비밀번호는 10자리 이상 입력해주세요.";
  } else if (hasCount === 3 && (pass.toString().length > 128 || pass.toString().length < 8)) {
    return "비밀번호는 8자리 이상 입력해주세요.";
  }
  return false;
};

const isValidHex = (color: string) => {
  if (!color || typeof color !== "string") return false;

  // Validate hex values
  if (color.substring(0, 1) === "#") color = color.substring(1);

  switch (color.length) {
    case 3:
      return /^[0-9A-F]{3}$/i.test(color);
    case 6:
      return /^[0-9A-F]{6}$/i.test(color);
    case 8:
      return /^[0-9A-F]{8}$/i.test(color);
    default:
      return false;
  }
};

export { passwordValidation, isValidHex };
