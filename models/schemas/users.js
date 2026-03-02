export function check() {
  const email = document.querySelector('[name="email"]').value;

  if (!email) {
    alert("Please enter your email.");
    return false;
  }

  const password = document.querySelector('[name="password"]').value;

  if (!password) {
    alert("Please enter your password.");
    return false;
  }

  return true;
} 

