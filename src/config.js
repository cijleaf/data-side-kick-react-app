const { env: { NODE_ENV } } = process;

function getUrl() {
  if (NODE_ENV === 'development') {
    return 'https://localhost:3000';
  }

  return 'https://datasidekick.com';
}

export const url = getUrl();
export const apiUrl = 'https://datasidekick.com/api';
export const salesforceClientId = '3MVG9fMtCkV6eLhcLN21Pu0dMpqlYV05rmcJZSxM6zUug07DsLs.3ULfUJMjApnckuWSm2ewyts7UpK_IvLDW';
