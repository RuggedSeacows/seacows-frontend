import { Table, Form, Input, Row, Col, Pagination } from 'antd';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const { useForm } = Form;

interface FormValues {
  name: string;
  symbol: string;
}

const TitleWrapper = styled.div`
  color: white;

  h2 {
    color: white;
  }
`;

const PageWrapper = styled.div`
  /* max-width: 920px; */
  padding: 24px;
`;

const ExplorePage = () => {
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <PageWrapper>
      <TitleWrapper>
        <h2>Explore</h2>
        <p>Explore NFTs and swap whichever instantaneously</p>
      </TitleWrapper>
      <Table bordered={false} dataSource={dataSource} columns={columns} />
    </PageWrapper>
  );
};

export default ExplorePage;
