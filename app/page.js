'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all links on component mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: originalUrl,
          code: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Link created successfully!');
        setOriginalUrl('');
        setCustomCode('');
        fetchLinks(); // Refresh the list
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to create link');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Link deleted successfully!');
        fetchLinks(); // Refresh the list
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to delete link');
      console.error('Error:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('Copied to clipboard!');
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>URL Shortener</h1>

        {message && (
          <div className={styles.message}>
            {message}
          </div>
        )}

        <div className={styles.formContainer}>
          <h2>Create Short Link</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="url">Original URL:</label>
              <input
                type="url"
                id="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="customCode">Custom Code (optional):</label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="6-8 alphanumeric characters"
                pattern="[A-Za-z0-9]{6,8}"
                title="6-8 alphanumeric characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Creating...' : 'Create Short Link'}
            </button>
          </form>
        </div>

        <div className={styles.linksContainer}>
          <h2>All Links</h2>
          {links.length === 0 ? (
            <p>No links created yet.</p>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Short Code</th>
                    <th>Original URL</th>
                    <th>Clicks</th>
                    <th>Last Clicked</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td>
                        <a
                          href={`/${link.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.code}
                        </a>
                      </td>
                      <td className={styles.truncate}>
                        <a
                          href={link.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.targetUrl}
                        </a>
                      </td>
                      <td>{link.clicks}</td>
                      <td>
                        {link.lastClicked
                          ? new Date(link.lastClicked).toLocaleString()
                          : 'Never'}
                      </td>
                      <td>
                        <Link href={`/code/${link.code}`} className={styles.smallButton}>
                          Stats
                        </Link>
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/${link.code}`)}
                          className={styles.smallButton}
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleDelete(link.code)}
                          className={styles.smallButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}