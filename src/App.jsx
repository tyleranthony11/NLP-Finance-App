import React, { useEffect, useState } from "react";
// ... other imports

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      setUser({ name: "Test User" });
    }

    AOS.init({ duration: 1000, once: true });

    const today = new Date().toISOString().split("T")[0];
    const storedVisits = JSON.parse(localStorage.getItem("visits") || "{}");
    storedVisits[today] = (storedVisits[today] || 0) + 1;
    localStorage.setItem("visits", JSON.stringify(storedVisits));
  }, [user]);
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ClientLayout>
                <Home />
              </ClientLayout>
            }
          />
          <Route
            path="/finance"
            element={
              <ClientLayout>
                <Finance />
              </ClientLayout>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ClientLayout>
                <Marketplace />
              </ClientLayout>
            }
          />
          <Route
            path="/marketplace/:id"
            element={
              <ClientLayout>
                <MarketplaceDetail />
              </ClientLayout>
            }
          />
          <Route
            path="/PostAdForm"
            element={
              <ClientLayout>
                <PostAdForm />
              </ClientLayout>
            }
          />
          <Route
            path="/dealers"
            element={
              <ClientLayout>
                <Dealers />
              </ClientLayout>
            }
          />
          <Route
            path="/about"
            element={
              <ClientLayout>
                <About />
              </ClientLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <ClientLayout>
                <Privacy />
              </ClientLayout>
            }
          />
          <Route
            path="/terms"
            element={
              <ClientLayout>
                <Terms />
              </ClientLayout>
            }
          />

          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
