type Props = {
  params: {
    mint: string;
  };
};

const MintPage: React.FC<Props> = ({ params: { mint } }) => {
  return (
    <div>
      <h1>Mint: {mint}</h1>
    </div>
  );
};
export default MintPage;
