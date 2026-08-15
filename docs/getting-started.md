# Getting Started

To develop Hyperion locally:

## Prerequisites
- Node.js (v18+)
- npm

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vxnuslabs/hyperion.git
   cd hyperion
   ```

2. **Configure Local Proxy (Optional but Recommended):**
   For maximum security locally, create a `.env.local` file and add your OpenRouter API key. This enables a local proxy so your key never touches the browser memory.
   ```bash
   # Create .env.local and add OPENROUTER_API_KEY=your-key
   ```

3. **Install dependencies:**
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
- `lib/store.tsx` - React Context state store.
- `app/globals.css` - Custom Tailwind theme variables.
- `docs/` - Project documentation.
