'use server';

import { createClient } from 'utils/supabase/server';

type Inputs = {
  author: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  model: string;
  mint: string;
};
export default async function savePersonToken(inputData: Inputs) {
  const supabase = createClient();
  return supabase.from('person_token').insert([
    {
      author: inputData.author,
      name: inputData.name,
      decimals: 9,
      symbol: inputData.symbol,
      description: inputData.description,
      image: inputData.image,
      mint: inputData.mint,
    },
  ]);
  // formData.append('pinataMetadata', JSON.stringify({ name: 'File to upload' }));
  // const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${process.env.PINATA_JWT}`,
  //   },
  //   body: formData,
  // });
  // const { IpfsHash } = await res.json();
  return {
    ...inputData,
    // url: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/ipfs/${IpfsHash}`,
  };
}
