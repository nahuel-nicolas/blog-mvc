import '../styles/globals.css'
import { AuthProvider } from '../components/authentication/AuthContext';
import Head from 'next/head';
import UserHeaderSection from '../components/authentication/UserHeaderSection';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
    <link 
      rel="stylesheet" 
      href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" 
      integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" 
      crossOrigin="anonymous"
    ></link>
    </Head>
    <AuthProvider>
      <UserHeaderSection />
      <br />
      <Component {...pageProps} />
    </AuthProvider>
  </>
}

export default MyApp
