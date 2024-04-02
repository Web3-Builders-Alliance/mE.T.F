import { IconExclamationCircle } from '@tabler/icons-react';

const FetchDataError = () => {
  return (
    <div role="alert" className="alert alert-error">
      <IconExclamationCircle />
      <span>Error! Request failed.</span>
    </div>
  );
};

export default FetchDataError;
