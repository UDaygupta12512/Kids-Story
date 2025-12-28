# Kids Talebook App 📚✨

An interactive and magical application designed to spark creativity in children by allowing them to create, read, and share their own stories. Built with modern web technologies, this app provides a seamless and engaging experience for young storytellers.

## 🚀 Features

- **Interactive Story Creation**: Easy-to-use interface for kids to write their own tales.
- **PDF Export**: Generate beautiful PDFs of stories to print or share.
- **Beautiful UI**: Designed with **shadcn/ui** and **Tailwind CSS** for a playful and accessible user experience.
- **Real-time Data**: Powered by **Supabase** for saving and retrieving stories securely.
- **Responsive Design**: Works great on tablets and desktops.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (with [TypeScript](https://www.typescriptlang.org/))
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/UDaygupta12512/Kids-Story.git
    cd Kids-Story
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```

5.  **Open in your browser**
    Navigate to `http://localhost:8080` (or the port shown in your terminal).

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components
├── pages/          # Application pages/routes
├── lib/            # Utilities and helper functions
├── hooks/          # Custom React hooks
└── App.tsx         # Main application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.
