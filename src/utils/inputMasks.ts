export const cpfMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');
    
    return cleanedValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  
};

export const cnpjMask = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');

    return cleanedValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');

};

export const phoneMask = (value: string) => {
  value = value.replace(/\D/g, "");
  
  if (value.length > 10) {
    return value
      .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length <7) {
    return value
      .replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2$3");
  } else {
    return value
      .replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
}