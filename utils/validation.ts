export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };
  
  export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone.replace(/[^\d]/g, ''));
  };
  
  export const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };
  
  export const validateRequired = (value: string): boolean => {
    return value.trim().length > 0;
  };