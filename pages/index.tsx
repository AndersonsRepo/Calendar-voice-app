import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import VoiceInput from '@/components/VoiceInput';

// Define the type for our response
interface WebhookResponse {
  response: string;
  success: boolean;
}

 
export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('What do I have scheduled this week?');

  // Function to fetch response from the webhook
  const fetchResponse = async (voiceQuery: string = query) => {
    setLoading(true);
    setError(null);
    setResponse('');
    
    try {
      // Send the voice query to the webhook
      const result = await axios.post('/api/calendar', {
        sessionId: 'bded18e27b064f659085802d9da651f8',
        action: 'sendMessage',
        chatInput: voiceQuery
      });
      
      // Handle the response format
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Extract the response from the array format
        const responseObj = result.data[0];
        if (responseObj.success && responseObj.response) {
          setResponse(responseObj.response);
        } else {
          setError('Invalid response format or unsuccessful response');
        }
      } else if (result.data && typeof result.data === 'object' && result.data.response) {
        // Handle direct object response format
        setResponse(result.data.response);
      } else if (typeof result.data === 'string') {
        // Handle direct string response
        setResponse(result.data);
      } else {
        // Fallback to showing the raw response
        setResponse(JSON.stringify(result.data));
      }
    } catch (err) {
      console.error('Error fetching response:', err);
      setError('Failed to fetch response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle voice query submission
  const handleVoiceQuery = (voiceQuery: string) => {
    setQuery(voiceQuery);
    fetchResponse(voiceQuery);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Calendar Voice App</title>
        <meta name="description" content="Calendar application with voice interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Calendar Voice App
        </h1>

        <VoiceInput onQuerySubmit={handleVoiceQuery} defaultQuery={query} />

        <div className={styles.responseContainer}>
          {loading ? (
            <div className={styles.loading}>Loading response...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : response ? (
            <div className={styles.response}>{response}</div>
          ) : (
            <div className={styles.placeholder}>Your response will appear here</div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Calendar Voice App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
