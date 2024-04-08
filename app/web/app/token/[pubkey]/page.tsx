'use client';

import FetchDataLoading from '@/components/common/FetchDataLoading';
import usePersonTokenAccount from '@/hooks/usePersonTokenAccount';
import {
  IconCalendar,
  IconCircleCheck,
  IconCreditCard,
  IconUser,
  IconUserCircle,
  IconViewfinder,
} from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: {
    pubkey: string;
  };
};

const activity = [
  {
    id: 1,
    type: 'created',
    person: { name: 'Chelsea Hagon' },
    date: '7d ago',
    dateTime: '2023-01-23T10:32',
  },
  {
    id: 2,
    type: 'edited',
    person: { name: 'Chelsea Hagon' },
    date: '6d ago',
    dateTime: '2023-01-23T11:03',
  },
  {
    id: 3,
    type: 'sent',
    person: { name: 'Chelsea Hagon' },
    date: '6d ago',
    dateTime: '2023-01-23T11:24',
  },
  {
    id: 4,
    type: 'commented',
    person: {
      name: 'Chelsea Hagon',
      imageUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    comment:
      'Called client, they reassured me the invoice would be paid by the 25th.',
    date: '3d ago',
    dateTime: '2023-01-23T15:56',
  },
  {
    id: 5,
    type: 'viewed',
    person: { name: 'Alex Curren' },
    date: '2d ago',
    dateTime: '2023-01-24T09:12',
  },
  {
    id: 6,
    type: 'paid',
    person: { name: 'Alex Curren' },
    date: '1d ago',
    dateTime: '2023-01-24T09:20',
  },
];

const MintPage: React.FC<Props> = ({ params: { pubkey } }) => {
  const { data, isPending } = usePersonTokenAccount(pubkey);
  if (isPending) {
    return <FetchDataLoading />;
  }

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <div>
      {/* <h1>Mint: {pubkey}</h1> */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-x-6">
          <div className="sm:flex">
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
              {data?.image ? (
                <Image
                  className="h-32 w-full max-w-full border border-gray-300 bg-white text-gray-300"
                  src={data.image}
                  alt={data.name!}
                  width={200}
                  height={200}
                />
              ) : null}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{data.name}</h2>
              <h4 className="uppercase text-lg text-secondary font-bold">
                {data.symbol}
              </h4>
              <p className="mt-1">{data.description}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-8">
          <Link
            href={`https://explorer.solana.com/address/${data.mint}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn btn-ghost btn-outline btn-sm">
              Explorer <IconViewfinder />
            </button>
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Invoice summary */}
          <div className="lg:col-start-3 lg:row-end-1">
            <h2 className="sr-only">Summary</h2>
            <div className="rounded-lg bg-gray-800 shadow-sm ring-1 ring-gray-900/5 pb-6">
              <dl className="flex flex-wrap">
                <div className="flex-auto pl-6 pt-6">
                  <dt className="text-sm font-semibold leading-6 text-gray-400">
                    Current supply
                  </dt>
                  <dd className="mt-1 text-base font-semibold leading-6 text-gray-400">
                    {data.currentSupply}
                  </dd>
                </div>
                <div className="flex self-end px-6 pt-4 gap-2">
                  <button className="btn btn-sm btn-accent text-white">
                    Buy
                  </button>
                  <button className="btn btn-sm btn-secondary text-white">
                    Sell
                  </button>
                </div>
                <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <dt className="flex-none">
                    <span className="sr-only">Client</span>
                    <IconUserCircle
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm font-medium leading-6 text-gray-400 hover:text-gray-500">
                    <Link href={`/profile/${data.author}`}>
                      {data.author?.slice(0, 20)}...
                    </Link>
                  </dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Created at</span>
                    <IconCalendar
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-400">
                    {data.created_at ? (
                      <time dateTime={data.created_at}>
                        {new Date(data.created_at).toLocaleDateString()}
                      </time>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Invoice */}
          <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16"></div>

          <div className="lg:col-start-3">
            {/* Activity feed */}
            <h2 className="text-sm font-semibold leading-6 text-gray-400">
              Activity
            </h2>
            <ul role="list" className="mt-6 space-y-6">
              {activity.map((activityItem, activityItemIdx) => (
                <li key={activityItem.id} className="relative flex gap-x-4">
                  <div
                    className={clsx(
                      activityItemIdx === activity.length - 1
                        ? 'h-6'
                        : '-bottom-6',
                      'absolute left-0 top-0 flex w-6 justify-center'
                    )}
                  >
                    <div className="w-px bg-gray-200" />
                  </div>
                  {activityItem.type === 'commented' ? (
                    <>
                      {activityItem.person.imageUrl ? (
                        <img
                          src={activityItem.person.imageUrl}
                          alt=""
                          className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                        />
                      ) : null}
                      <div className="flex-auto rounded-md p-3 ring-1 ring-inset">
                        <div className="flex justify-between gap-x-4">
                          <div className="py-0.5 text-xs leading-5 text-gray-500">
                            <span className="font-medium text-gray-400">
                              {activityItem.person.name}
                            </span>{' '}
                            commented
                          </div>
                          <time
                            dateTime={activityItem.dateTime}
                            className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                          >
                            {activityItem.date}
                          </time>
                        </div>
                        <p className="text-sm leading-6 text-gray-500">
                          {activityItem.comment}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                        {activityItem.type === 'paid' ? (
                          <IconCircleCheck
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <IconUser className="h-4 w-4 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                        )}
                      </div>
                      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-400">
                          {activityItem.person.name}
                        </span>{' '}
                        {activityItem.type} the invoice.
                      </p>
                      <time
                        dateTime={activityItem.dateTime}
                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                      >
                        {activityItem.date}
                      </time>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MintPage;
