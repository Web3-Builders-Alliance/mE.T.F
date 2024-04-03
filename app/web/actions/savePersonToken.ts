'use server';
type Inputs = {
  name: string;
  symbol: string;
  description: string;
  photo: string;
  model: string;
};
export default async function savePersonToken(
  inputData: Inputs,
  formData: FormData
) {
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
