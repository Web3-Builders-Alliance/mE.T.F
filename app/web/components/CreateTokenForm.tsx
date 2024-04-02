'use client';
import savePersonToken from '@/actions/savePersonToken';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import { IconCircleX, IconPhotoScan, IconSend } from '@tabler/icons-react';
import { useRef, useState } from 'react';

const schema = yup.object().shape({
  name: yup.string().max(50).required('Name is required'),
  symbol: yup.string().max(6).required('Symbol is required'),
  description: yup.string().max(200),
  image: yup
    .mixed<File>()
    .required('You need to provide a file')
    .test('fileSize', 'The file is too large', (value) => {
      if (!value) {
        return true;
      }
      return value.size <= 10485760;
    }),
});

const CreateTokenForm = () => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [image, setImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.set('file', data.image);
    const result = await savePersonToken(
      {
        name: data.name,
        symbol: data.symbol,
        description: data.description,
      },
      formData
    );
    console.log('result', result);
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
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
              />
            </div>
          </div>
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
          {!image ? (
            <IconPhotoScan
              className="h-24 w-24 text-gray-500"
              aria-hidden="true"
            />
          ) : (
            <img
              src={image}
              alt="Token image"
              className="h-24 w-24 rounded-lg object-cover"
            />
          )}
          <Controller
            control={control}
            name="image"
            rules={{ required: 'Token image is required' }}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <input
                  {...field}
                  value={(value as any)?.filename}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onChange(file);
                      onImageChange(event);
                    }
                  }}
                  ref={(instance) => {
                    inputRef.current = instance;
                  }}
                  type="file"
                  multiple={false}
                  className="sr-only hidden"
                  accept=".jpg,.png,.jpeg"
                />
              );
            }}
          />
          <button
            type="button"
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Change
          </button>
          <p className="text-xs leading-5 text-gray-400">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="btn btn-ghost">
          <IconCircleX className="h-5 w-5 mr-2" aria-hidden="true" />
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <IconSend className="h-5 w-5 mr-2" aria-hidden="true" />
          Save
        </button>
      </div>
    </form>
  );
};

export default CreateTokenForm;
