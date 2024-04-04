import { useMetfProgram } from '@/components/metf/metf-data-access';
import { useMutation } from '@tanstack/react-query';

const useSaveToken = () => {
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
        uri: data.photo,
      });
      return result;
    },
  });
};

export default useSaveToken;
