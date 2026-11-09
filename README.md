# gratitude-jar

Senior Project for BYU-Pathway
During this thanksgiving eve many of us struggle to consistently recognize and remember the positive moments and blessings in our daily lives. Gratitude Jar aims to help users develop a habit of gratitude through a simple and interactive web application.
The application will allow users to create their own virtual gratitude jar, where they can record things they are thankful for each day. Over time, users will be able to revisit past memories, track their gratitude habits, and view summaries of their entries.
The goal is to create an engaging and user-friendly experience that encourages gratitude and personal reflection.

# Andres Quote:

"The effectual fervent prayer of a righteous man availeth much".

# Daniel Quote:

"[Men] cannot really long rest content with mediocrity once excellence is within their reach." - Thomas S. Monson

# Lucas Quote:

"The future is as bright as your faith." - Thomas S. Monson

# Project Setup:

## Project Setup

Follow these steps to set up and run the Gratitude Jar application locally.

### 1. Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/)
- [pnpm](https://pnpm.io/installation)

After installing Node.js, install pnpm globally:

```bash
npm install -g pnpm
```

### 2. Clone the Repository

```bash
git clone https://github.com/adcostanzi/gratitude-jar
cd gratitude-jar
```

Replace the repository URL with the actual GitHub repository URL.

### 3. Install Dependencies

```bash
pnpm install --frozen-lockfile
```

This installs the required dependencies using the project's `pnpm-lock.yaml` file.

### 4. Configure Environment Variables

Create a `.env.local` file in the project root, next to `package.json`.

Copy the contents of `.env.example` into `.env.local` and replace the placeholder values with Lucas Supabase URL and API key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Ask the team member managing Supabase for the correct values.

**Important:** Never commit `.env.local` to GitHub.

### 5. Run the Application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Verify the Setup

- The application loads without errors.
- You can register or log in using a test account.
- The application connects successfully to Supabase.

### Useful Commands

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the development server         |
| `pnpm build`   | Build the application for production |
| `pnpm lint`    | Run ESLint                           |
| `pnpm install` | Install or update dependencies       |

### Notes

- Use **pnpm**, not npm, to keep dependencies consistent.
- Do not commit `.env.local`, `node_modules`, or `.next`.
- Supabase database configuration and Vercel deployment are managed by Lucas Mercau.
