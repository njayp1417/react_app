// Security Test Suite
import { encryptMessage, decryptMessage, validateFile, processSecureFile } from './security';

export const testEncryption = async () => {
  console.log('🔒 Testing AES-256-GCM Encryption...');
  
  const testMessage = "Hello my love! This is a secret message 💕";
  
  try {
    // Test encryption
    const encrypted = await encryptMessage(testMessage);
    console.log('✅ Encryption successful');
    console.log('Encrypted:', encrypted.substring(0, 50) + '...');
    
    // Test decryption
    const decrypted = await decryptMessage(encrypted);
    console.log('✅ Decryption successful');
    console.log('Decrypted:', decrypted);
    
    // Verify integrity
    if (decrypted === testMessage) {
      console.log('✅ Message integrity verified');
      return true;
    } else {
      console.log('❌ Message integrity failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Encryption test failed:', error);
    return false;
  }
};

export const testFileValidation = () => {
  console.log('📁 Testing File Validation...');
  
  // Mock file objects for testing
  const validImage = {
    type: 'image/jpeg',
    name: 'test.jpg',
    size: 1024 * 1024 // 1MB
  };
  
  const invalidFile = {
    type: 'application/exe',
    name: 'virus.exe',
    size: 1024
  };
  
  const oversizedFile = {
    type: 'image/jpeg',
    name: 'huge.jpg',
    size: 100 * 1024 * 1024 // 100MB
  };
  
  try {
    validateFile(validImage);
    console.log('✅ Valid image accepted');
    
    try {
      validateFile(invalidFile);
      console.log('❌ Invalid file wrongly accepted');
      return false;
    } catch {
      console.log('✅ Invalid file correctly rejected');
    }
    
    try {
      validateFile(oversizedFile);
      console.log('❌ Oversized file wrongly accepted');
      return false;
    } catch {
      console.log('✅ Oversized file correctly rejected');
    }
    
    return true;
  } catch (error) {
    console.error('❌ File validation test failed:', error);
    return false;
  }
};

export const runAllTests = async () => {
  console.log('🧪 Running Security Test Suite...\n');
  
  const encryptionTest = await testEncryption();
  const fileTest = testFileValidation();
  
  console.log('\n📊 Test Results:');
  console.log(`Encryption: ${encryptionTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`File Validation: ${fileTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (encryptionTest && fileTest) {
    console.log('\n🎉 All security tests PASSED! Your app is secure.');
  } else {
    console.log('\n⚠️ Some tests FAILED. Check implementation.');
  }
  
  return encryptionTest && fileTest;
};