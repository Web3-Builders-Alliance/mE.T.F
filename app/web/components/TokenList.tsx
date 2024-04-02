'use client';
import useTokenList from '@/hooks/useTokenList';
import Image from 'next/image';
import Link from 'next/link';

const TokenList = () => {
  const { data } = useTokenList();
  if (!data) return null;
  return (
    <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 text-gray-400 gap-4">
      {data.map((token) => (
        <Link href={`/mint/${token.mint}`} key={token.mint}>
          <div className="bg-base-100 hover:shadow-xl transition-shadow duration-300 max-h-[10rem] overflow-hidden h-fit p-2 flex border border-transparent gap-2 w-full ">
            <figure className="min-w-[8rem]">
              <Image
                src={token.image}
                alt={token.name}
                width={96}
                height={96}
                className="w-32 h-32"
              />
            </figure>
            <div className="gap-1 grid h-fit">
              <h4 className="text-sm">
                Created by:{' '}
                <Link
                  href={`/profile/${token.author}`}
                  className="text-indigo-500 hover:text-indigo-600 transition-colors duration-300"
                >
                  {token.author.slice(0, 10)}
                </Link>
              </h4>
              <div className="text-sm">
                Symbol:{' '}
                <span className="text-accent font-bold uppercase">
                  {token.symbol}
                </span>
              </div>
              <p className="w-full break-words break-all text-xs">
                {token.description}
              </p>
              <div className="card-actions justify-end">
                {/* <button className="btn btn-primary">Watch</button> */}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TokenList;
