type Props = {
  params: {
    pubkey: string;
  };
};

const MintPage: React.FC<Props> = ({ params: { pubkey } }) => {
  return (
    <div>
      <h1>Mint: {pubkey}</h1>
    </div>
  );
};
export default MintPage;
