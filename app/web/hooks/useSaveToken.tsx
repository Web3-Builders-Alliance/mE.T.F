import savePersonToken from '@/actions/savePersonToken';
import { useMetfProgram } from '@/components/metf/metf-data-access';
import { useTransactionToast } from '@/components/ui/ui-layout';
import { BN } from '@coral-xyz/anchor';
import { useMutation } from '@tanstack/react-query';

const useSaveToken = () => {
  const transactionToast = useTransactionToast();
  const { createPersonToken } = useMetfProgram();
  return useMutation({
    mutationKey: ['saveToken'],
    mutationFn: async (data: any) => {
      // const formData = new FormData();
      // formData.set('file', data.image);
      // const result = await savePersonToken(
      //   {
      //     name: data.name,
      //     symbol: data.symbol,
      //     description: data.description,
      //     photo: data.image,
      //     model: data.model,
      //   },
      //   formData
      // );
      const result = await createPersonToken.mutate({
        name: data.name,
        symbol: data.symbol,
        uri: data.image,
      });
      return result;
    },
  });
};

export default useSaveToken;
