export const AUTH_REGEX = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  name: /^[a-zA-Z\s]{3,20}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}; 

export const VALIDATION_MSG = {
  email: "Email must be in the format user@example.com.",
  name:
    "Name must only contain letters and white spaces and should be 3 to 20 characters long.",
  password:
    "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*).",
  confirmPassword: "Must match the first password input field.",
}