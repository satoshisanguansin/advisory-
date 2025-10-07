declare global {
  interface Window {
    gapi: any;
  }
}

export const createCalendarEvent = async (
    title: string,
    description: string,
    startTime: string, // ISO 8601 format: "2024-08-20T09:00:00-07:00"
    endTime: string,   // ISO 8601 format: "2024-08-20T10:00:00-07:00"
    location: string,
    accessToken: string
): Promise<any> => {

    if (!window.gapi || !window.gapi.client) {
        throw new Error("Google API client not loaded.");
    }
    
    // Set the access token for this request
    window.gapi.client.setToken({ access_token: accessToken });

    await window.gapi.client.load('calendar', 'v3');
    
    const event = {
        'summary': title,
        'location': location,
        'description': description,
        'start': {
            'dateTime': startTime,
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        'end': {
            'dateTime': endTime,
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        'reminders': {
            'useDefault': true,
        }
    };

    try {
        const response = await window.gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });
        
        if (response.status >= 200 && response.status < 300) {
            return response.result;
        } else {
            throw new Error(response.result.error.message);
        }
    } catch (error) {
        console.error("Google Calendar API Error:", error);
        throw new Error(`Error creating event: ${error.message || 'Unknown error'}`);
    }
};