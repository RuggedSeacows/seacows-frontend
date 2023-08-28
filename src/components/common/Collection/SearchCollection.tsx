import React, { useMemo, useRef, useState } from 'react';
import { Select, Spin, Space, Image, Tooltip } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { SupportedChain } from '@yolominds/metadata-service-api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { metadataApi } from 'src/utils/api';

const { Option } = Select;

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  onSearchLoading?: (loading: boolean) => unknown;
}

export interface CollectionValue {
  label: string;
  value: string;
  image: string;
  hasPool?: boolean;
}

function DebounceSelect<ValueType extends CollectionValue = CollectionValue>({
  fetchOptions,
  onSearchLoading,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      if (onSearchLoading) {
        onSearchLoading(true);
      }

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);

        if (onSearchLoading) {
          onSearchLoading(false);
        }
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, onSearchLoading]);

  return (
    <Select
      labelInValue
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options.map((option, index) => (
        <Option value={option.value} label={option.label} key={index} disabled={option.hasPool}>
          <Space style={{ opacity: option.hasPool ? 0.7 : 1 }}>
            <Image
              src={option.image || `https://via.placeholder.com/24?text=${option.label.slice(0, 1)}`}
              alt={option.label}
              width={24}
              height={24}
              preview={false}
            />
            {option.label}
            {option.hasPool ? (
              <Tooltip
                placement="top"
                title="A pool for this collection already exists."
                arrow
                style={{ marginLeft: 8 }}
              >
                <QuestionCircleOutlined />
              </Tooltip>
            ) : null}
          </Space>
        </Option>
      ))}
    </Select>
  );
}

async function fetchCollectionList(name: string, checkPool = false): Promise<CollectionValue[]> {
  try {
    const response = await metadataApi.collection.searchCollections(
      SupportedChain.GOERLI,
      name,
      checkPool ? 'true' : 'false',
    );
    return (response.collections || []).map((c) => ({
      label: c.name!,
      image: c.image!,
      value: c.collectionId!,
      hasPool: c.collectionId ? (((response as any).status || {})[c.collectionId] as boolean) : undefined,
    }));
  } catch (error) {
    console.error('fetchCollectionList error', error);
  }
  return [];
}

interface Props {
  style?: React.CSSProperties;
  placeholder?: string;
  checkPool?: boolean;
  value?: CollectionValue;
  onChange?: (value: CollectionValue) => unknown;
  onSelect?: DebounceSelectProps['onSelect'];
  onSearchLoading?: DebounceSelectProps['onSearchLoading'];
}

export function SearchCollection({
  style,
  placeholder = 'Search collections',
  value,
  checkPool,
  onChange,
  onSelect,
  onSearchLoading,
}: Props) {
  return (
    <DebounceSelect
      value={value}
      placeholder={placeholder}
      fetchOptions={(search: string) => fetchCollectionList(search, checkPool)}
      onChange={(v) => onChange && onChange(v as CollectionValue)}
      onSelect={onSelect}
      onSearchLoading={onSearchLoading}
      style={style}
    />
  );
}
