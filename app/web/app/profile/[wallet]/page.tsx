import React from 'react';

type Props = {
  params: {
    wallet: string;
  };
};
const ProfilePage: React.FC<Props> = ({ params: { wallet } }) => {
  return <div>Profile: {wallet}</div>;
};

export default ProfilePage;
