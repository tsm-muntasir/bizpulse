import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';

export async function setAccessToken(token) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK
  });
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function clearAccessToken() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}
