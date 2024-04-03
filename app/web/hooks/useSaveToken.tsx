import savePersonToken from '@/actions/savePersonToken';
import { useTransactionToast } from '@/components/ui/ui-layout';
import { useMutation } from '@tanstack/react-query';

const useSaveToken = () => {
  const transactionToast = useTransactionToast();
  return useMutation({
    mutationKey: ['saveToken'],
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.set('file', data.image);
      const result = await savePersonToken(
        {
          name: data.name,
          symbol: data.symbol,
          description: data.description,
          photo: data.image,
          model: data.model,
        },
        formData
      );
      transactionToast('Token saved');
      return result;
    },
  });
};

export default useSaveToken;
