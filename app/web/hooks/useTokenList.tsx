import { useQuery } from '@tanstack/react-query';

const useTokenList = () => {
  return useQuery({
    queryKey: ['tokenList'],
    queryFn: async () => {
      // delay for 1 second to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return [
        {
          mint: 'FyD6fWSb4nCfAisi2BRuUeDaCG5aKL7oniq2FbePULqr',
          author: 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM',
          name: 'Cat Ape',
          symbol: 'CAPE',
          decimals: 6,
          image:
            'https://pump.mypinata.cloud/ipfs/QmWsDF8G7w4Q9mrHXDdL8oSjbh6ytHqKE8TqEUB3MNSXDU',
          description: 'Just a cat dressed as an ape',
        },
        {
          mint: 'By9dwMCpJSY3q9B3WrZdFkCbiwmqCREG9u5K3Ds8gGzg',
          author: 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM',
          name: 'Silly Whale Cat',
          symbol: 'WHALECAT',
          decimals: 6,
          image:
            'https://pump.mypinata.cloud/ipfs/QmWwWb7vywRn1yA5rpuTwZ7iMjvaJpukcGgnyB5Ueb9tN6',
          description: `Once upon the crypto realm, there was Silly Whale Cat - the OG chonker all other meme kitties bow down to. Mew Cat, Shark Cat, Nub Cat and even fancy furballs wif hats – they all hail from this one chunky legend. Silly Whale Cat's the alpha of all meme coins, ruling the oceanic waves and bonding curve of the catnip market with its mighty purr. x.com/sillywhalecat t.me/sillywhalecat`,
        },
      ];
    },
  });
};

export default useTokenList;
