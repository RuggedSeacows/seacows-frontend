import { Form, Typography } from 'antd';
import React from 'react';
import { shallow } from 'zustand/shallow';
import { SearchCollection } from 'src/components/common/Collection/SearchCollection';
import { TokenSelect } from 'src/components/common/Token/TokenSelect';
import { useCreatePoolStore } from './store';

interface Props {
  title: string;
  className?: string;
}

export function TokenCollectionForm({ title, className }: Props) {
  const [form] = Form.useForm();
  const [token, collection] = useCreatePoolStore((state) => [state.token, state.collection], shallow);
  const setToken = useCreatePoolStore((state) => state.setToken);
  const setCollection = useCreatePoolStore((state) => state.setCollection);
  const setCollectionLoading = useCreatePoolStore((state) => state.setCollectionLoading);

  const onFormValueChanges = (changedValues: any) => {
    if (changedValues.token) {
      setToken(changedValues.token);
    }
    // if (changedValues.collection) {
    //   setCollection(changedValues.collection as string);
    // }
  };

  return (
    <div className={className}>
      <Typography.Title level={4}>{title}</Typography.Title>
      <Form
        layout="vertical"
        form={form}
        initialValues={{ token }}
        onValuesChange={onFormValueChanges}
        style={{ width: '100%' }}
      >
        <Form.Item label="Token" name="token">
          <TokenSelect />
        </Form.Item>
        <Form.Item label="NFTs">
          <SearchCollection
            placeholder="Select an NFT collection"
            value={collection}
            checkPool
            onChange={setCollection}
            onSearchLoading={setCollectionLoading}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
