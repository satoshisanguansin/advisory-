
declare global {
  interface Window {
    gapi: any;
  }
}

export const saveReportToDrive = async (fileName: string, htmlContent: string, accessToken: string): Promise<any> => {
  if (!window.gapi || !window.gapi.client) {
    throw new Error("Google API client not loaded.");
  }

  // Set the access token for the GAPI client
  window.gapi.client.setToken({ access_token: accessToken });
  
  await window.gapi.client.load('drive', 'v3');
  
  const fileMetadata = {
    name: `${fileName}.gdoc`,
    mimeType: 'application/vnd.google-apps.document',
  };

  // Using Blobs for media upload is more robust
  const blob = new Blob([htmlContent], { type: 'text/html' });

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
  form.append('file', blob);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ 'Authorization': `Bearer ${accessToken}` }),
      body: form,
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(`Google Drive API Error: ${errorBody.error.message}`);
  }

  return await res.json();
};