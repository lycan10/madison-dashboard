import React, { createContext, useState, useContext, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const EmailContext = createContext(null);

export const EmailProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const [emails, setEmails] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use refs to store the latest values without causing re-renders
  const tokenRef = useRef(token);
  const logoutRef = useRef(logout);
  
  // Update refs when values change
  React.useEffect(() => {
    tokenRef.current = token;
    logoutRef.current = logout;
  }, [token, logout]);

  const fetchEmails = useCallback(async (page = 1) => {
    if (!tokenRef.current) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/emails?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenRef.current}`,
          },
        }
      );

      if (response.status === 401) {
        logoutRef.current();
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch emails");
      }

      const data = await response.json();
      setEmails(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (err) {
      console.error("Fetch emails error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we're using refs

  const fetchMoreEmails = useCallback(async () => {
    if (loading) {
      return;
    }
    
    // Get current pagination state
    setPagination(currentPagination => {
      if (currentPagination.current_page >= currentPagination.last_page) {
        return currentPagination;
      }
      
      setLoading(true);
      setError(null);
      
      fetch(
        `${process.env.REACT_APP_BASE_URL}/api/emails?page=${currentPagination.current_page + 1}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenRef.current}`,
          },
        }
      )
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch more emails");
        }
        return response.json();
      })
      .then(data => {
        setEmails(prevEmails => [...prevEmails, ...data.data]);
        setPagination({
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        });
      })
      .catch(err => {
        console.error("Fetch more emails error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
      
      return currentPagination;
    });
  }, [loading]); // Only depend on loading state

  const assignTaskFromEmail = useCallback(async (emailId, userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/emails/${emailId}/assign-task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenRef.current}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to assign email as a task");
      }
      const result = await response.json();
      // Update the local email state to reflect the change
      setEmails((prevEmails) =>
        prevEmails.map((email) =>
          email.id === emailId ? { ...email, status: 'assigned', assigned_to_user_id: userId } : email
        )
      );
      return result;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const connectGoogleAccount = useCallback(async () => {
    // You must hardcode the redirect URI here for the Google client to work
    const redirectUri = process.env.REACT_APP_URL;

    // Build the Google OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&` +
      `access_type=offline&` +
      `include_granted_scopes=true&` +
      `response_type=code&` +
      `redirect_uri=${redirectUri}&` +
      `client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`;
      
    // Redirect the user to Google for authorization
    window.location.href = authUrl;
  }, []);

  const exchangeGoogleCode = useCallback(async (code) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/google/oauth/callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenRef.current}`,
          },
          body: JSON.stringify({ code }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to exchange code for token.");
      }
      return true;
    } catch (err) {
      console.error("Token exchange error:", err);
      return false;
    }
  }, []);

  const saveImapCredentials = useCallback(async (credentials) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/config/imap`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenRef.current}`,
                },
                body: JSON.stringify(credentials),
            }
        );
        if (!response.ok) {
            throw new Error("Failed to save IMAP credentials.");
        }
        return true;
    } catch (err) {
        console.error("Save IMAP credentials error:", err);
        setError(err.message);
        return false;
    }
  }, []);

  const fetchImapCredentials = useCallback(async () => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/config/imap`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenRef.current}`,
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch IMAP credentials.");
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Fetch IMAP credentials error:", err);
        setError(err.message);
        return null;
    }
  }, []);

  return (
    <EmailContext.Provider
      value={{
        emails,
        pagination,
        loading,
        error,
        fetchEmails,
        fetchMoreEmails,
        assignTaskFromEmail,
        connectGoogleAccount,
        exchangeGoogleCode,
        saveImapCredentials,
        fetchImapCredentials
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);