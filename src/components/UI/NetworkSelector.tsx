import { FC, useCallback } from 'react';
import { Popover, Input, Menu } from 'antd';
import styled from 'styled-components';
import { supportedChains } from 'src/app/config';
import NetworkIcon from 'src/components/UI/NetworkIcon';
import { addNetwork } from 'src/utils/web3';
import { SearchOutlined } from '@ant-design/icons';
import { useNetwork, useSwitchNetwork } from 'wagmi';

const { Item: MenuItem } = Menu;

const StyledMenu = styled(Menu)`
  background-color: transparent !important;
  border-right: 0;

  .ant-menu-item-selected {
    background-color: unset;
  }

  .ant-menu-item {
    height: unset;
    line-height: unset;
    margin-top: 8px;
  }
`;

const StyledInput = styled(Input)`
  color: white;

  ::placeholder {
    color: grey;
  }
`;

const NetworkName = styled.div`
  cursor: pointer;
  margin-left: 8px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: white;
`;

const StyledPopover = styled(({ className, ...props }) => <Popover {...props} overlayClassName={className} />)`
  top: 40px !important;
  .ant-popover-inner {
    background: #333333;
    padding: 0 8px;
    margin-top: 8px;
    border-radius: 8px;
    border: 1px solid grey;
  }

  .ant-popover-inner-content {
    padding: 0;
  }

  .ant-popover-title {
    border-bottom-color: rgba(226, 232, 240, 0.1);
  }

  .ant-popover-arrow {
    display: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: hsla(0, 0%, 100%, 0.04);
  border-radius: 8px;
  padding: 8px;
`;

const NetworkButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 4px 0;
`;

type NetworkModalProps = {};

const NetworkModal: FC<NetworkModalProps> = () => {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const handleSelect = useCallback(
    async (id: number) => {
      try {
        await switchNetworkAsync?.(id);
      } catch (err: any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if (err.code === 4902) {
        //   const info = supportedChains.find((v) => v.id === id);
        //   if (info) {
        //     await addNetwork(info);
        //   }
        //   return;
        // }
        // console.log(err.code);
        const info = supportedChains.find((v) => v.id === id);
        if (info) {
          await addNetwork(info);
        }
      }
      // onClose();
    },
    [switchNetworkAsync],
  );

  return (
    <StyledPopover
      placement="topRight"
      title={
        <div style={{ display: 'flex', color: 'grey', alignItems: 'center' }}>
          <SearchOutlined />
          <StyledInput placeholder="Search networks" bordered={false} />
        </div>
      }
      content={
        <StyledMenu selectable={false} theme="dark">
          {supportedChains.map(({ name, id }) => (
            <MenuItem style={{}} key={name} onClick={() => handleSelect(id)}>
              <NetworkButton>
                <NetworkIcon width={20} height={20} chainId={id} />
                <NetworkName>{name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</NetworkName>
              </NetworkButton>
            </MenuItem>
          ))}
        </StyledMenu>
      }
      trigger="click"
    >
      <Wrapper>
        {chain && (
          <>
            <NetworkIcon width={20} height={20} chainId={chain?.id} />
            <NetworkName>{chain.name.charAt(0).toUpperCase() + chain.name.slice(1).toLowerCase()}</NetworkName>
          </>
        )}
      </Wrapper>
    </StyledPopover>
  );
};

export default NetworkModal;
