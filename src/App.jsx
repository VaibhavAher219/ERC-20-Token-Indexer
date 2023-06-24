

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import {ethers} from 'ethers';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [account,setAccount] = useState("None")
  async function getTokenBalance() {
    const config = {
      apiKey: ,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      ) || {};
      await tokenDataPromises.push(tokenData);
    }

     setTokenDataObjects(await Promise.all(tokenDataPromises));
     setHasQueried(true);
    console.log(data);
    console.log(Promise.all(tokenDataPromises))
    console.log(tokenDataObjects);

  }

  async function getWalletAddress(){
    const {ethereum}=window;
    if(ethereum){
      const account = await ethereum.request({method:'eth_requestAccounts'});
      window.ethereum.on("chainChanged",()=>{
        window.location.reload();
      })
      window.ethereum.on("accountsChanged",()=>{
        window.location.reload();
      })
      const provider= new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setAccount(account);
      console.log(account);
      const entrytab=document.querySelector('.entrytab');
      
     
        // Handle the case where the user manually entered a value
       
    
        // Handle the case where the entry tab was filled with the connected wallet address or is empty
        setUserAddress(account[0]);
        entrytab.value = account[0];
      
  
    }
    else{
      alert('install krle bhai')
    }
  }
  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input className='entrytab'
          
         
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>
        <Button fontSize={20} onClick={getWalletAddress} mt={37} bgColor="blue">
          Connect Wallet
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {hasQueried ? (
          <SimpleGrid w={'90vw'} columns={4} spacing={24}>
            {results.tokenBalances.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  bg="blue"
                  w={'20vw'}
                  key={e.id}
                >
                  <Box>
                    <b>Symbol:</b> ${tokenDataObjects[i].symbol || 'N/A'}&nbsp;
                  </Box>
                  <Box>
                    <b>Balance:</b>&nbsp;
                    {Utils.formatUnits(
                      e.tokenBalance,
                      tokenDataObjects[i].decimals || 0
                    )}
                  </Box>
                  <Image src={tokenDataObjects[i].logo} />
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          'Please make a query! This may take a few seconds...'
        )}
      </Flex>
    </Box>
  );
}

export default App;
