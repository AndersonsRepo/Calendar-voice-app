# Calendar Voice App

A Next.js application that connects to a webhook to display calendar events. The app features a voice interface that allows users to query their calendar using natural language.

## Features

- Voice-enabled interface for querying calendar events
- Display of weekly calendar events in a clean, organized format
- Webhook integration for fetching calendar data
- Responsive design that works on both desktop and mobile devices
- Dark mode support

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure the webhook URL:
   - Open `/pages/api/calendar.ts`
   - Replace `https://your-webhook-url.com/calendar` with your actual webhook URL

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

## Webhook Integration

The application is designed to work with a webhook that accepts the following payload format:

```json
{
  "sessionId": "bded18e27b064f659085802d9da651f8",
  "action": "sendMessage",
  "chatInput": "What do I have scheduled this week?"
}
```

The webhook should return an array of calendar events in the following format:

```json
[
  {
    "id": "1",
    "title": "Event Title",
    "start": "2025-06-04T10:00:00-07:00",
    "end": "2025-06-04T11:00:00-07:00",
    "location": "Location (optional)",
    "description": "Description (optional)"
  }
]
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Axios](https://axios-http.com/) - HTTP client
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Voice recognition

## License

This project is licensed under the MIT License.
