// SECURE EMAIL VERIFICATION - Only Nelson & Juliana's emails allowed
export const AUTHORIZED_EMAILS = {
  nelson: 'nelsonasagwara81@gmail.com',
  juliana: 'Oluwanifemiojo88@gmail.com'
};

export const verifyUserEmail = (email, selectedPrism) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if email matches the selected prism
  if (selectedPrism === 'nelson' && normalizedEmail === AUTHORIZED_EMAILS.nelson) {
    return { isValid: true, userType: 'nelson', displayName: 'Nelson' };
  }
  
  if (selectedPrism === 'juliana' && normalizedEmail === AUTHORIZED_EMAILS.juliana) {
    return { isValid: true, userType: 'juliana', displayName: 'Juliana' };
  }
  
  return { isValid: false, userType: null, displayName: null };
};

export const isAuthorizedEmail = (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  return Object.values(AUTHORIZED_EMAILS).includes(normalizedEmail);
};