# Kids Talebook Backend

This is the backend server for the Kids Talebook App. It handles API requests and serves as a foundation for features like AI story generation.

## Getting Started

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    npm run dev
    ```

The server will run on `http://localhost:5000`.

## API Endpoints

-   `GET /api/health` - Check if the backend is running.
-   `POST /api/story/generate` - Generate a story (currently a placeholder).

## Configuration

The backend uses a `.env` file for configuration.
`PORT=5000` is set by default.
Add your API keys (e.g., `OPENAI_API_KEY`) to this file as needed.
