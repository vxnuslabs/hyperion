# Getting Started

To develop Hyperion locally:

## Prerequisites
- Node.js (v18+)
- npm

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vxnus/hyperion.git
   cd hyperion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Verify the build:**
   ```bash
   npm run lint
   npm run build
   ```

## Project Structure
- `app/` - Next.js App Router views.
- `lib/store.tsx` - Zustand state store.
- `app/globals.css` - Custom Tailwind theme variables.
- `docs/` - Project documentation.
