import React from 'react';
import { Button, Result } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

function ErrorPage() {
  const { push } = useRouter();
  return (
    <>
      <Head>
        <title>Page does not exist</title>
      </Head>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => push('/')}>
            Back Home
          </Button>
        }
      />
    </>
  );
}

export default ErrorPage;
