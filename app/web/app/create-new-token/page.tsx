import CreateTokenForm from '@/components/CreateTokenForm';

const CreateNewTokenPage = () => {
  return (
    <div className="divide-y divide-gray-500 overflow-hidden rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-300">Create new token</h2>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <CreateTokenForm />
      </div>
    </div>
  );
};

export default CreateNewTokenPage;
