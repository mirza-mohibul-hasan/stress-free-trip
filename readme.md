# Stress Free Trip System

This project is an AI-integrated itinerary generation system that provides users with customized travel plans, including transport options, meal plans, accommodation suggestions, and estimated costs. Built using the MERN stack and Vite, it leverages AI to recommend routes and calculate costs, simplifying travel planning for users.

## Features

- **User-Friendly Interface**: Allows users to input their travel destination easily.
- **AI-Driven Route Optimization**: Uses AI algorithms to find the best routes, balancing time, cost, and convenience.
- **Transportation Options**: Recommends various transport modes tailored to the user’s travel needs.
- **Meal Plan Suggestions**: Provides meal plans suited to the location and user preferences.
- **Accommodation Recommendations**: Suggests accommodations based on budget, distance, and user specifications.
- **Cost Estimation**: Calculates and displays an estimated cost for the entire itinerary based on AI predictions and real-time data.

## Technology Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Integration**: Custom AI models for route finding and cost prediction

## Installation

1. **Clone the repository**:

```sh
   git clone https://github.com/mirza-mohibul-hasan/stress-free-trip.git
   cd stress-free-trip
```

2. **Install dependencies for both frontend and backend**:

```sh
cd frontend
npm install
cd ../backend
npm install
```

3. **Environment Variables**:

- Configure .env files in both frontend and backend directories.
- Specify API keys, database credentials, and any AI service configurations as required.

4. **Start the development server**:

- For the frontend:

```sh
cd frontend
npm run dev
```

- For the backend:

```sh
cd backend
npm run dev
```

5. **Access the application** at `http://localhost:3000`.

## Usage

**Enter Destination:** Provide your destination to receive a complete itinerary.
**Customize Preferences:** Adjust travel preferences for transport, meals, and accommodation.
**Generate Itinerary:** Review the generated travel plan, which includes AI-calculated route options and cost estimations.
**Export Options:** Save or export the itinerary in a printable format.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
