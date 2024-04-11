import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Adobe Fonts Link */}
        
          <link rel="stylesheet" href="https://use.typekit.net/unv7ina.css"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;