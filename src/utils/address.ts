import { supportedChains } from "src/app/config"

export function isSameAddress(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase()
}

export function getEtherscanLink(networkId: number, path: string) {
  const baseUrl = networkId === 1 ? supportedChains[0].blockExplorers.default.url : networkId === 5 ? supportedChains[1].blockExplorers.default.url : '';

  return `${baseUrl}/${path}`;
}
