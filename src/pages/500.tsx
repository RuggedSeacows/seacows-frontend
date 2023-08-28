import React from 'react';
import { Button, Result } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

function ErrorPage() {
  const { push } = useRouter();
  return (
    <>
      <Head>
        <title>Something went wrong</title>
      </Head>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
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
