# AutoMate - AI Car Buying Assistant

A polished demo web app for **AutoMate**, an AI agent that helps Gen Z users buy cars end-to-end without talking to salespeople.

## Features

- **Natural Language Search**: Describe your ideal car in plain English
- **AI-Powered Recommendations**: Get curated car suggestions based on your needs
- **Detailed Research Hub**: View comprehensive car information, pros/cons, and financing options
- **Simulated Negotiation**: Watch AutoMate negotiate with dealers automatically
- **Modern, Mobile-First Design**: Clean UI with animated pastel gradients

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- React Router (page navigation)
- Tailwind CSS (styling)
- All AI behavior is mocked/deterministic (no real APIs required)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── pages/                  # Page components
│   ├── Landing.tsx        # Hero + chatbot prompt
│   ├── Results.tsx        # Car recommendations grid
│   ├── HowItWorks.tsx     # Feature breakdown
│   ├── AboutUs.tsx        # Company story
│   └── Contact.tsx        # Contact form
├── components/            # Reusable components
│   ├── Navbar.tsx        # Navigation with routing
│   ├── CarCard.tsx       # Car recommendation card
│   ├── CarDetailPanel.tsx # Detailed car info panel
│   └── NegotiationSimulator.tsx # AI negotiation demo
├── data/
│   └── mockData.ts       # Mock car data and listings
├── utils/
│   └── mockAgent.ts      # Mock AI agent logic
├── types.ts              # TypeScript type definitions
├── App.tsx               # Router setup
└── main.tsx              # Entry point
```

## Pages

- `/` - Landing page with chatbot-style search
- `/results?q=...` - Search results with car recommendations
- `/how-it-works` - How AutoMate works
- `/about` - About the company
- `/contact` - Contact form

## Color Palette

The app uses a soft pastel gradient palette:
- Lavender Veil: `#F0DCFE`
- Thistle: `#F3CCFC`
- Mauve: `#EBBDFB`
- Light Cyan: `#C8F6FF`
- Lavender: `#D4E2FF`
- Pale Sky: `#D7ECFF`

## Integrating Real APIs

### Replace Mock AI Agent

Update `src/utils/mockAgent.ts`:

```typescript
export const generateAgentResponse = async (query: string): Promise<ChatMessage> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return {
    id: crypto.randomUUID(),
    role: 'agent',
    content: data.message,
  };
};
```

### Replace Mock Car Data

Update `src/data/mockData.ts` to fetch real car inventory:

```typescript
export const searchCars = async (query: string): Promise<Car[]> => {
  const response = await fetch(`/api/cars?q=${encodeURIComponent(query)}`);
  return response.json();
};
```

## License

Demo project for presentation purposes.
