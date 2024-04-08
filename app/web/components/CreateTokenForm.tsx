'use client';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { IconCircleX, IconPhotoScan, IconSend } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import useSaveToken from '@/hooks/useSaveToken';
import useUserInfo from '@/hooks/useUserInfo';
import { Model } from '@/lib/enum';

const schema = yup.object().shape({
  name: yup.string().max(50).required('Name is required'),
  symbol: yup.string().max(6).required('Symbol is required'),
  model: yup
    .string()
    .required('Model is required')
    .default(Model.StabilityModel),
  description: yup.string().max(200),
  photo: yup.string().url().required('Photo is required'),
  // image: yup
  //   .mixed<File>()
  //   .required('You need to provide a file')
  //   .test('fileSize', 'The file is too large', (value) => {
  //     if (!value) {
  //       return true;
  //     }
  //     return value.size <= 10485760;
  //   }),
});

const models = [
  {
    id: Model.StabilityModel,
    name: 'Stability Model',
    description:
      'Ensures a stable system with token value increasing gradually over time, while maintaining appeal for long-term token holders',
    enable: true,
  },
  {
    id: Model.LiquidityBoostModel,
    name: 'Liquidity Boost Model',
    description:
      'Designed to increase token liquidity, fostering a flexible trading environment and encouraging user participation to bolster token liquidity.',
    enable: false,
  },
  {
    id: Model.SecurityFocusModel,
    name: 'Security Focus Model',
    description:
      'Aims to create a token with low liquidity and reduced susceptibility to attacks by employing a low-curvature bonding curve.',
    enable: false,
  },
  {
    id: Model.AccelerationModel,
    name: 'Acceleration Model',
    description:
      'Promotes rapid growth and encourages frequent trading by utilizing a high-curvature bonding curve, stimulating user engagement and trading activity.',
    enable: false,
  },
];

const CreateTokenForm = () => {
  const userInfo = useUserInfo();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      model: Model.StabilityModel,
      name: 'xDhackr',
      symbol: 'NTD',
      photo:
        'https://pump.mypinata.cloud/ipfs/QmTBNpGBLXuRKQS2B8HQLc7B7YndPUCdDJX2FwL29GPb8G',
    },
  });

  const saveToken = useSaveToken();
  const onSubmit = async (data: any) => {
    try {
      await saveToken.mutateAsync(data);
    } catch (error) {
      toast.error(
        <div className={'text-center'}>
          <div className="text-lg">Token creation failed</div>
        </div>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-white">
      <h2 className="text-base font-semibold leading-7 text-white">
        Personal token
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-400">
        Create a personal token that represents you
      </p>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 "
          >
            Name
          </label>
          <div className="mt-2">
            <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500">
              <input
                defaultValue="My personal token"
                {...register('name', { required: true })}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                disabled
              />
            </div>
          </div>
          <p className="text-error text-xs mt-1">{errors.name?.message}</p>
        </div>
        <div className="sm:col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 "
          >
            Symbol
          </label>
          <div className="mt-2">
            <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500">
              <input
                defaultValue="MPT"
                {...register('symbol', { required: true })}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <p className="text-error text-xs mt-1">{errors.symbol?.message}</p>
        </div>
        <div className="col-span-full">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-white"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              {...register('description')}
              rows={3}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            Write a few sentences about token
          </p>
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="photo"
          className="block text-sm font-medium leading-6 text-white"
        >
          Photo
        </label>
        <div className="mt-2 flex items-center gap-x-3">
          <img
            src={userInfo.photo}
            alt="Token image"
            className="h-24 w-24 rounded-lg object-cover"
          />
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="photo"
          className="block text-sm font-medium leading-6 text-white"
        >
          What model do you want to use?
        </label>
        <div className="mt-2 flex items-center gap-x-3 w-full">
          <div className="space-y-5">
            {models.map((model) => (
              <div key={model.id} className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id={model.id}
                    aria-describedby={`${model.id}-description`}
                    value={model.id}
                    type="radio"
                    defaultChecked={model.id === Model.StabilityModel}
                    className="h-4 w-4 border-gray-300  radio radio-warning"
                    disabled={!model.enable}
                    {...register('model')}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor={model.id} className="font-medium">
                    {model.name}
                  </label>
                  <p id={`${model.id}-description`} className="text-gray-500">
                    {model.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-error text-xs mt-1">{errors.model?.message}</p>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="btn btn-ghost">
          <IconCircleX className="h-5 w-5 mr-2" aria-hidden="true" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saveToken.isPending}
        >
          {saveToken.isPending ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <IconSend className="h-5 w-5 mr-2" aria-hidden="true" />
          )}
          Save
        </button>
      </div>
    </form>
  );
};

export default CreateTokenForm;
