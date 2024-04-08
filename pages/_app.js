// app/_app.js
import '../globals.css'

function MyApp({ Component, pageProps }) {
    console.log('Custom _app.js is loaded!');
  return <Component {...pageProps} />
}

export default MyApp;