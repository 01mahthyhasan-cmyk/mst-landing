export const metadata = {
  title: 'MST Health Care - Admin Portal',
  description: 'Internal Administrative Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPortalLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --primary-color: #08363B;
            --secondary-color: #EDF9FC;
            --accent-color: #00A8BC;
            --bg-color: #F8FAFC;
            --card-bg: #FFFFFF;
            --text-primary: #1E293B;
            --text-secondary: #64748B;
            --border-color: #E2E8F0;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --success-color: #10B981;
            --error-color: #EF4444;
            --warning-color: #F59E0B;
          }

          body {
            margin: 0;
            padding: 0;
            font-family: 'Rethink Sans', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
